import type { Answer, Thread, ThreadSort } from "@/entities/forum";
import { apiClient } from "@/shared/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as repo from "./forumRepository";

const USE_MOCK = import.meta.env.VITE_MOCK_FORUM !== "false";

export const forumKeys = {
  all: ["forum"] as const,
  threads: (sort: ThreadSort) => [...forumKeys.all, "threads", sort] as const,
  thread: (id: string) => [...forumKeys.all, "thread", id] as const,
  answers: (threadId: string) => [...forumKeys.all, "answers", threadId] as const,
};

async function fetchThreads(sort: ThreadSort): Promise<Thread[]> {
  if (USE_MOCK) return repo.listThreads(sort);
  const { data } = await apiClient.get<Thread[]>("/forum/threads", { params: { sort } });
  return data;
}

async function fetchThread(id: string): Promise<Thread> {
  if (USE_MOCK) {
    const thread = repo.getThread(id);
    if (!thread) throw new Error("Thread not found");
    return thread;
  }
  const { data } = await apiClient.get<Thread>(`/forum/threads/${id}`);
  return data;
}

async function fetchAnswers(threadId: string): Promise<Answer[]> {
  if (USE_MOCK) return repo.listAnswers(threadId);
  const { data } = await apiClient.get<Answer[]>(`/forum/threads/${threadId}/answers`);
  return data;
}

export function useThreads(sort: ThreadSort) {
  return useQuery({
    queryKey: forumKeys.threads(sort),
    queryFn: () => fetchThreads(sort),
  });
}

export function useThread(threadId: string) {
  return useQuery({
    queryKey: forumKeys.thread(threadId),
    queryFn: () => fetchThread(threadId),
    enabled: Boolean(threadId),
  });
}

export function useAnswers(threadId: string) {
  return useQuery({
    queryKey: forumKeys.answers(threadId),
    queryFn: () => fetchAnswers(threadId),
    enabled: Boolean(threadId),
  });
}

export function useCreateThread() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      authorId: string;
      authorName: string;
      title: string;
      body: string;
    }) => {
      if (USE_MOCK) return repo.createThread(input);
      const { data } = await apiClient.post<Thread>("/forum/threads", input);
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: forumKeys.all });
    },
  });
}

export function useCreateAnswer(threadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { authorId: string; authorName: string; body: string }) => {
      if (USE_MOCK) return repo.createAnswer({ ...input, threadId });
      const { data } = await apiClient.post<Answer>(`/forum/threads/${threadId}/answers`, input);
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: forumKeys.answers(threadId) });
      void qc.invalidateQueries({ queryKey: forumKeys.thread(threadId) });
      void qc.invalidateQueries({ queryKey: forumKeys.all });
    },
  });
}

export function useLikeAnswer(threadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ answerId, userId }: { answerId: string; userId: string }) => {
      if (USE_MOCK) return repo.toggleLikeAnswer(answerId, userId);
      const { data } = await apiClient.post<Answer>(`/forum/answers/${answerId}/like`);
      return data;
    },
    onMutate: async ({ answerId, userId }) => {
      await qc.cancelQueries({ queryKey: forumKeys.answers(threadId) });
      const previous = qc.getQueryData<Answer[]>(forumKeys.answers(threadId));
      if (previous) {
        qc.setQueryData<Answer[]>(
          forumKeys.answers(threadId),
          previous.map((a) => {
            if (a.id !== answerId) return a;
            const liked = a.likedByUserIds.includes(userId);
            return {
              ...a,
              likes: liked ? a.likes - 1 : a.likes + 1,
              likedByUserIds: liked
                ? a.likedByUserIds.filter((id) => id !== userId)
                : [...a.likedByUserIds, userId],
            };
          }),
        );
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(forumKeys.answers(threadId), ctx.previous);
      }
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: forumKeys.answers(threadId) });
      void qc.invalidateQueries({ queryKey: forumKeys.all });
    },
  });
}

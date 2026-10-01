export interface Thread {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  createdAt: string;
  answerCount: number;
  topAnswerLikes: number;
}

export interface Answer {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
  likes: number;
  likedByUserIds: string[];
}

/** @deprecated Use Thread for list previews */
export interface ForumPost {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  votes: number;
  replies: number;
}

export type ThreadSort = "top" | "newest";

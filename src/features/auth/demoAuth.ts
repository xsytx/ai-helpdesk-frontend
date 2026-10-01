import type { User } from "@/entities/user";

const ACCOUNTS_KEY = "ai_helpdesk_accounts";
const PENDING_KEY = "ai_helpdesk_pending_verify";

export interface StoredAccount {
  id: string;
  email: string;
  username: string;
  password: string;
  role: User["role"];
}

export type VerifyPurpose = "signup" | "reset";

export interface PendingVerify {
  email: string;
  purpose: VerifyPurpose;
  code: string;
  username?: string;
  password?: string;
  createdAt: number;
}

function readAccounts(): StoredAccount[] {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredAccount[];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function findAccount(email: string): StoredAccount | undefined {
  const normalized = email.trim().toLowerCase();
  return readAccounts().find((a) => a.email === normalized);
}

export function accountExists(email: string): boolean {
  return Boolean(findAccount(email));
}

export function createAccount(input: {
  email: string;
  username: string;
  password: string;
}): StoredAccount {
  const accounts = readAccounts();
  const email = input.email.trim().toLowerCase();
  if (accounts.some((a) => a.email === email)) {
    throw new Error("exists");
  }
  const account: StoredAccount = {
    id: crypto.randomUUID(),
    email,
    username: input.username.trim(),
    password: input.password,
    role: email.startsWith("admin@") ? "admin" : "student",
  };
  accounts.push(account);
  writeAccounts(accounts);
  return account;
}

export function updatePassword(email: string, password: string): StoredAccount {
  const accounts = readAccounts();
  const normalized = email.trim().toLowerCase();
  const account = accounts.find((a) => a.email === normalized);
  if (!account) throw new Error("not-found");
  account.password = password;
  writeAccounts(accounts);
  return account;
}

export function authenticate(email: string, password: string): StoredAccount {
  const account = findAccount(email);
  if (!account || account.password !== password) {
    throw new Error("invalid");
  }
  return account;
}

export function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function startVerification(pending: Omit<PendingVerify, "code" | "createdAt">): PendingVerify {
  const record: PendingVerify = {
    ...pending,
    email: pending.email.trim().toLowerCase(),
    code: generateCode(),
    createdAt: Date.now(),
  };
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(record));
  return record;
}

export function readPending(): PendingVerify | null {
  const raw = sessionStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingVerify;
  } catch {
    return null;
  }
}

export function clearPending() {
  sessionStorage.removeItem(PENDING_KEY);
}

export function verifyCode(email: string, code: string): PendingVerify {
  const pending = readPending();
  if (!pending || pending.email !== email.trim().toLowerCase()) {
    throw new Error("expired");
  }
  const ageMs = Date.now() - pending.createdAt;
  if (ageMs > 10 * 60_000) {
    clearPending();
    throw new Error("expired");
  }
  if (pending.code !== code.trim()) {
    throw new Error("invalid");
  }
  return pending;
}

export function toUser(account: StoredAccount): User {
  return {
    id: account.id,
    email: account.email,
    name: account.username,
    role: account.role,
  };
}

export function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

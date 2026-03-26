import type { Task } from "@/types/task.types";
import type { User } from "@/types/user.types";

interface LocalChange {
  tasks: Task[];
  user: User;
}

interface SyncAdapter {
  baseUrl: string;
  pull(lastSyncedAt: number): Promise<unknown>
  push(changes: LocalChange[]): Promise<unknown>
  subscribe?(onRemoteChange: (change: unknown) => void): () => void
}

const delay = async (timeout: number) => {
  return new Promise((res) => {
    setTimeout(res, timeout)
  })
}

export class MockSyncAdapter implements SyncAdapter {
  baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  async pull(lastSyncedAt: number) {
    await delay(300);
    return { changes: [], serverTime: Date.now() }
  }
  async push(changes: LocalChange[]) {
    await delay(200);
    return { accepted: changes, conflicts: [] }
  }
}

export class HttpSyncAdapter implements SyncAdapter {
  baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  async pull(lastSyncedAt: number) {
    const res = await fetch(`${this.baseUrl}/changes?lastSyncedAt=${lastSyncedAt}`)
    return res.json()
  }
  async push(changes: LocalChange[]) {
    const res = await fetch(`${this.baseUrl}/changes`, {
      method: 'POST',
      body: JSON.stringify(changes)
    })
    return res.json()
  }
}
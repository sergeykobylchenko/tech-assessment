export interface User {
  id: string;
  name: string;
}

export interface UsersStorage {
  active_user: string | null;
  users: Record<string, User>;
}

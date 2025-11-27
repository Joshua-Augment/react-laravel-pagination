// src/dev/mockUsers.ts
export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export const MOCK_USERS: User[] = Array.from({ length: 137 }).map((_, i) => {
  const id = i + 1;
  return {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
    created_at: new Date(
      Date.now() - id * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
});

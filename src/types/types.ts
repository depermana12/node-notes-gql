export type GQLContext = {
  user?: { id: number; email: string; verified: boolean } | null;
};

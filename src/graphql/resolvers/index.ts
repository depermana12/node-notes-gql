import db from "../../db/db";
import { users, InsertUser, SelectUser } from "../../db/schema/user";
import { notes, InsertNote, SelectNote } from "../../db/schema/note";
import { tags, InsertTag, SelectTag } from "../../db/schema/tag";
import { GQLContext } from "../../types/types";
import { signIn, signUp } from "../../utils/auth";
import { GraphQLError } from "graphql";
import { and, eq } from "drizzle-orm";

const resolvers = {
  Query: {
    user: async (_: any, __: any, ctx: GQLContext) => {
      return ctx.user;
    },
    notes: async (_: any, __: any, ctx: GQLContext) => {
      if (!ctx.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: 401 } });
      }

      return await db.query.notes.findMany({
        where: eq(notes.ownerId, ctx.user.id),
      });
    },
  },

  Mutation: {
    signin: async (_: any, { input }) => {
      const data = await signIn(input);

      if (!data || !data.token || !data.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: 401 } });
      }
      return { ...data.user, token: data.token };
    },
    signup: async (_: any, { input }) => {
      const data = await signUp(input);

      if (!data || !data.token || !data.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: 401 } });
      }
      return { ...data.user, token: data.token };
    },
    createNote: async (
      _: any,
      { input }: { input: InsertNote },
      ctx: GQLContext,
    ) => {
      // TODO error catching

      if (!ctx.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: 401 } });
      }

      const note = await db
        .insert(notes)
        .values({ ...input, ownerId: ctx.user?.id })
        .returning({
          id: notes.id,
          title: notes.title,
          content: notes.content,
          isArchived: notes.isArchived,
          ownerId: notes.ownerId,
          createdAt: notes.created_at,
          updatedAt: notes.updated_at,
        });
      console.log(note);

      // TODO: format date

      return { ...note[0], userId: note[0].ownerId };
    },
    editNote: async (
      _: any,
      { input }: { input: SelectNote },
      ctx: GQLContext,
    ) => {
      if (!ctx.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: 401 } });
      }

      const { id, ...update } = input;

      const updatedNote = await db
        .update(notes)
        .set(update ?? {})
        .where(and(eq(notes.ownerId, ctx.user.id), eq(notes.id, id)))
        .returning();

      // TODO: on update updated at date

      return { ...updatedNote[0], userId: updatedNote[0].ownerId };
    },
    deleteNote: async (_: any, { id }: { id: number }, ctx: GQLContext) => {
      if (!ctx.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: 401 } });
      }

      const deletedNote = await db
        .delete(notes)
        .where(and(eq(notes.ownerId, ctx.user.id), eq(notes.id, id)))
        .returning();

      console.log(deletedNote);

      return { ...deletedNote[0], userId: deletedNote[0].ownerId };
    },
  },
  Note: {
    user: async (note: SelectNote, _: any, ctx: GQLContext) => {
      if (!ctx.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: 401 } });
      }

      return await db.query.users.findFirst({
        where: eq(users.id, note.ownerId),
      });
    },
  },
};

export default resolvers;

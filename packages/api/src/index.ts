import * as z from "zod";
import type { Post } from "@my-app/db/lib/generated/client";
import { prisma } from "@my-app/db/lib/prisma";
import { comment } from "@my-app/mongo";
import type { Comment } from "@my-app/mongo/models/comment";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  postList: publicProcedure.query(
    async (): Promise<(Post & { comments: readonly Comment[] })[]> => {
      const posts = await prisma.post.findMany();
      return Promise.all(
        posts.map(async (post) => {
          const postId = post.id;
          const comments = await comment.find({ post: postId }).exec();
          return { ...post, comments };
        }),
      );
    },
  ),
  addPost: publicProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async (opts) => {
      const { title, content } = opts.input;
      const post = await prisma.post.create({
        data: {
          title,
          content,
        },
      });
      return post;
    }),
  createComment: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
        meta: z.unknown().optional(),
      }),
    )
    .mutation(async (opts) => {
      const { postId, content, meta } = opts.input;
      const created = await comment.create({ postId, content, meta });
      return created;
    }),
});

export type AppRouter = typeof appRouter;

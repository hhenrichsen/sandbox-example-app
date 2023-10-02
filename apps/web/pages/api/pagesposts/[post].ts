import type { NextApiRequest, NextApiResponse } from "next";
import type { Post } from "@my-app/db/lib/generated/client";
import { prisma } from "@my-app/db/lib/prisma";
import { comment } from "@my-app/mongo";
import type { Comment } from "@my-app/mongo/models/comment";
import { HttpStatusCode } from "@my-app/status-codes";

const AllowedFields = new Set(["title", "content", "likes"]);

export default async function PostDetail(
  req: NextApiRequest,
  res: NextApiResponse<Partial<Post & { comments: readonly Comment[] }>>,
): Promise<void> {
  const filter = req.query.filter;
  const parts = typeof filter === "string" ? filter.split(",") : filter;
  const selectFields = parts?.reduce<Record<string, boolean>>((acc, curr) => {
    if (AllowedFields.has(curr)) {
      acc[curr] = true;
    }
    return acc;
  }, {});
  const select =
    selectFields && Object.keys(selectFields).length > 0
      ? selectFields
      : undefined;

  const rawPost = req.query.post;
  const id = typeof rawPost === "string" ? rawPost : undefined;
  if (!id) {
    res.status(HttpStatusCode.BAD_REQUEST).end();
    return;
  }

  const post = await prisma.post.findFirst({ select, where: { id } });
  if (!post) {
    res.status(HttpStatusCode.NOT_FOUND).end();
    return;
  }

  const comments = await comment.find({ post: id }).exec();

  res.status(HttpStatusCode.OK).json({ ...post, comments });
}

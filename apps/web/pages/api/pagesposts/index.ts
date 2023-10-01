import type { NextApiRequest, NextApiResponse } from "next";
import type { Post } from "@my-app/db/lib/generated/client";
import { prisma } from "@my-app/db/lib/prisma";
import { HttpStatusCode } from "@my-app/status-codes";

const AllowedFields = new Set(["title", "content", "likes"]);

export default async function PostList(
  req: NextApiRequest,
  // Primary difference 1: We are returning a partial post list
  res: NextApiResponse<readonly Partial<Post>[]>,
): Promise<void> {
  // Same as last time; this is pretty generic, so probably can be extracted
  // into a utility function.
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

  const postList = await prisma.post.findMany({ select });

  // Primary difference 2: we just return the post list, no processing needed
  res.status(HttpStatusCode.OK).json(postList);
}

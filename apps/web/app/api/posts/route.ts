import type { NextRequest } from "next/server";
import type { Post } from "@my-app/db/lib/generated/client";
import { prisma } from "@my-app/db/lib/prisma";
import { makeSelect } from "../../../util/select";

const AllowedFields = new Set<keyof Post>(["title", "content", "likes"]);

export async function GET(req: NextRequest): Promise<Response> {
  const filter = req.nextUrl.searchParams.get("filter");
  const select = makeSelect<Post>(filter?.split(",") ?? [], AllowedFields);

  const postList = await prisma.post.findMany({ select });

  return Response.json(postList);
}

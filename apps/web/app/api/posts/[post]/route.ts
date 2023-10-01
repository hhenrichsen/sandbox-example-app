import type { NextRequest } from "next/server";
import type { Post } from "@my-app/db/lib/generated/client";
import { prisma } from "@my-app/db/lib/prisma";
import { makeSelect } from "../../../../util/select";

const AllowedFields = new Set<keyof Post>(["title", "content", "likes"]);

export async function GET(
  req: NextRequest,
  { params }: { params: { post: string } },
): Promise<Response> {
  const filter = req.nextUrl.searchParams.get("filter");
  const select = makeSelect(filter?.split(",") ?? [], AllowedFields);

  const postList = await prisma.post.findFirst({
    select,
    where: { id: params.post },
  });

  return Response.json(postList);
}

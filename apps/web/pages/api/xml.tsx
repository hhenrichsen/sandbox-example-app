import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db/lib/prisma";

const AllowedFields = new Set(["title", "content", "likes"]);

export default async (
  req: NextApiRequest,
  res: NextApiResponse<string>,
): Promise<void> => {
  const filter = req.query.filter;
  const parts = typeof filter === "string" ? filter.split(",") : filter;
  const selectFields = parts?.reduce<Record<string, boolean>>((acc, curr) => {
    // Don't allow fields that I haven't explicitly allowed into the select
    // statement.
    if (AllowedFields.has(curr)) {
      acc[curr] = true;
    }
    return acc;
  }, {});
  // Ensure that we are actually selecting something, otherwise select
  // everything.
  const select =
    selectFields && Object.keys(selectFields).length > 0
      ? selectFields
      : undefined;

  const postList = await prisma.post.findMany({ select });

  const postXml = postList
    .map((post) =>
      // This is a clever way to deal with the {} type, but it would probably
      // be better to use a dedicated library for converting a JS Object to
      // XML.
      Object.entries(post)
        .map(([key, value]) => `<${key}>${value}</${key}>`)
        .join("\n"),
    )
    .map((post) => `<post>${post.trim()}</post>`);

  res.setHeader("Content-Type", "text/xml").status(200)
    .send(`<?xml version="1.0" encoding="UTF-8"?>
    <posts>
      ${postXml.join("\n")}
    </posts>`);
};

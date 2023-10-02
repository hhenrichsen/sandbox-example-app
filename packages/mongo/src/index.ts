import type { Mongoose } from "mongoose";
import mongoose from "mongoose";

export * from "./models/comment";

const { MONGO_URL } = process.env;

export async function connect(): Promise<Mongoose> {
  if (!MONGO_URL) {
    throw new Error("Missing MONGO_URL env variable");
  }

  const client = await mongoose.connect(MONGO_URL);
  return client;
}

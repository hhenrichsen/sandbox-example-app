import mongoose, { Model } from "mongoose";

export interface Comment extends mongoose.Document {
  postId: string;
  content: string;
  meta: unknown;
}

const CommentSchema = new mongoose.Schema<Comment>({
  postId: {
    type: String,
    required: [true, "Please provide a post ID"],
  },
  content: {
    type: String,
    required: [true, "Please provide a comment"],
  },
  meta: {
    type: {},
    required: false,
  },
});

export const comment: Model<Comment> =
  mongoose.models.comments ||
  mongoose.model<Comment>("comments", CommentSchema);

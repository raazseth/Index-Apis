import mongoose, { Schema } from "mongoose";
import { IPost } from "../Interfaces";

const PostSchema = new Schema<IPost>(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    postId: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);

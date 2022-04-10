import mongoose, { Schema } from "mongoose";
import { ITodo } from "../Interfaces";

const TodoSchema = new Schema<ITodo>(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    completed: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITodo>("Todo", TodoSchema);

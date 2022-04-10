import mongoose, { Schema } from "mongoose";
import { IStateCity } from "../Interfaces";

const StateNCitySchema = new Schema<IStateCity>({
  name: { type: String, required: true },
  state: { type: String, required: true },
});

export default mongoose.model<IStateCity>("StateNCIty", StateNCitySchema);

import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../Interfaces";

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    suite: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: { type: Number, required: true },
    geo: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  phone: { type: Number, required: true },
  website: { type: String, required: true },
  hash_password: {
    type: String,
  },
  company: {
    name: { type: String, required: true },
    catchPhrase: { type: String, required: true },
    bs: { type: String, required: true },
  },
});

UserSchema.methods = {
  authenticate: async function (password: any) {
    return await bcrypt.compare(password, this.hash_password);
  },
};

// Export the model and return your IUser interface
export default mongoose.model<IUser>("User", UserSchema);

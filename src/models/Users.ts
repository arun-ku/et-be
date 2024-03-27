import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, default: "unvarified" },
  families: [{ type: mongoose.Schema.Types.ObjectId, ref: "Family" }],
});

const Users = mongoose.model("Users", userSchema);

export default Users;

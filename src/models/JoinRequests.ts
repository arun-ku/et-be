import mongoose from "mongoose";

mongoose.pluralize(null);

const joinRequestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: "family" },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const JoinRequests = mongoose.model("joinRequests", joinRequestSchema);

export default JoinRequests;

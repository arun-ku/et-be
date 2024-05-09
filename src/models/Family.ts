import mongoose from "mongoose";

mongoose.pluralize(null);

const familySchema = new mongoose.Schema({
  familyName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  members: [
    {
      isAdmin: Boolean,
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    },
  ],
});

const Family = mongoose.model("family", familySchema);

export default Family;

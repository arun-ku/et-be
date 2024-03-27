import { Router } from "express";
import Family from "../../models/Family";
import Users from "../../models/Users";
import JoinRequests from "../../models/JoinRequests";
import mongoose from "mongoose";

const router = Router();

router.post("/create", async (req, res) => {
  const { familyName } = req.body;
  const user = await Users.findOne({ phoneNumber: req.user.phoneNumber });

  const family = await Family.create({ familyName, members: [user?._id] });
  await Users.updateOne(
    { phoneNumber: req.user.phoneNumber },
    { families: [family._id] }
  );

  res.sendResponse("200", { familyName });
});

router.post("/add-member", async (req, res) => {
  const { phoneNumber, familyId } = req.body;
  const user = await Users.findOne({ phoneNumber: req.user.phoneNumber });
  const toUser = await Users.findOne({ phoneNumber });

  await JoinRequests.create({
    fromUser: user?._id,
    toUser: toUser?._id,
    familyId: new mongoose.Types.ObjectId(familyId),
  });

  res.sendResponse("200", "Request sent");
});

router.post("/join-request", async (req, res) => {
  const { join, requestId } = req.body;
  await JoinRequests.updateOne(
    { _id: new mongoose.Types.ObjectId(requestId) },
    { status: join ? "accepted" : "rejected" }
  );

  if (join) {
    const request = await JoinRequests.findOne({
      _id: new mongoose.Types.ObjectId(requestId),
    });

    await Family.updateOne(
      { _id: request?.familyId },
      { $push: { members: { userId: request?.toUser } } }
    );

    await Users.updateOne(
      { _id: request?.toUser },
      { $push: { families: request?.familyId } }
    );
  }
});

router.get("/get-all", async (req, res) => {
  const user = await Users.findOne({ phoneNumber: req.user.phoneNumber });
  const families = await Family.find({ _id: { $in: user?.families } });

  res.sendResponse("200", families);
});

export default router;

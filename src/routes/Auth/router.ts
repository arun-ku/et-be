import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Users from "../../models/Users";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { phoneNumber, name, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const enPass = await bcrypt.hash(password, salt);

  try {
    const doesUserExist = await Users.find({ phoneNumber }).lean().exec();

    if (doesUserExist.length) {
      return res.sendResponse("400", "User already exists", false);
    } else {
      await Users.insertMany([{ phoneNumber, name, password: enPass }]);
    }
  } catch (e) {
    console.log(e);
  }

  const token = jwt.sign({ phoneNumber, name }, "mwbbaujkjsnbd_vaHjka", {
    expiresIn: "60d",
  });

  res.sendResponse("200", { token });
});

router.post("/login", async (req: Request, res: Response) => {
  const { phoneNumber, password } = req.body;
  const user = await Users.findOne({ phoneNumber }).lean().exec();
  if (user) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const token = jwt.sign(
        { phoneNumber, name: user.name },
        "mwbbaujkjsnbd_vaHjka",
        { expiresIn: "60d" }
      );
      return res.sendResponse("200", { token }, true);
    } else {
      return res.sendResponse("400", "Password is incorrect", false);
    }
  } else {
    return res.sendResponse("400", "No user found with this phone number", false);
  }
});

export default router;

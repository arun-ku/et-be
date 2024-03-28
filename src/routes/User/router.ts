import { Request, Response, Router } from "express";
import Users from "../../models/Users";

const router = Router();

router.get("/me", async (req: Request, res: Response) => {
  const user = await Users.findOne({ phoneNumber: req.user.phoneNumber });

  res.sendResponse("200", user, true);
});

export default router;

import express from "express";
import {
  SignUp,
  getUsers,
  Login,
  getCertainUser,
} from "../Controllers/AuthController";
const router = express.Router();

router.post("/register", SignUp);
router.post("/login", Login);
router.get("/allUser", getUsers);
router.get("/user/:userId", getCertainUser);

module.exports = router;

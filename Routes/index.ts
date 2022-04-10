import express from "express";
import {
  addComment,
  addPosts,
  addStateNCity,
  addTodo,
  getAllComments,
  getAllPosts,
  getAllStatesNCities,
  getAllTodo,
  getCityByState,
  getIpDetails,
  getPostComments,
  getTodoByUser,
  getUserComments,
  getUserPosts,
  serveProxy,
} from "../Controllers";
const router = express.Router();

///Posts///

router.post("/add/Todo", addTodo);
router.post("/add/Post", addPosts);
router.post("/add/Comment", addComment);
router.post("/add/StateNCity", addStateNCity);

///Get///

router.get("/get/Todo", getAllTodo);
router.get("/get/Todo/:userId", getTodoByUser);
router.get("/get/Post", getAllPosts);
router.get("/get/Post/:userId", getUserPosts);
router.get("/get/Comment", getAllComments);
router.get("/get/Post/Comment/:postId", getPostComments);
router.get("/get/Comment/:userId", getUserComments);
router.get("/get/State/:state", getCityByState);
router.get("/get/States", getAllStatesNCities);
router.get("/get/IP", getIpDetails);
router.get("/serve", serveProxy);

module.exports = router;

import express from "express";
import {
  addComment,
  addPosts,
  addStateNCity,
  addTodo,
  api_Guide,
  getAllComments,
  getAllPosts,
  getAllStatesNCities,
  getAllTodo,
  getCityByState,
  getIpDetails,
  getOnlyStates,
  getPostComments,
  getTodoByUser,
  getUserComments,
  getUserPosts,
  serveProxy,
} from "../Controllers";
const router = express.Router();

///POST///

router.post("/add/Todo", addTodo);
router.post("/add/Post", addPosts);
router.post("/add/Comment", addComment);
router.post("/add/StateNCity", addStateNCity);

///GET///

router.get("/", api_Guide);
router.get("/get/Todo", getAllTodo);
router.get("/get/Todo/:userId", getTodoByUser);
router.get("/get/Post", getAllPosts);
router.get("/get/Post/:userId", getUserPosts);
router.get("/get/Comment", getAllComments);
router.get("/get/Post/Comment/:postId", getPostComments);
router.get("/get/Comment/:userId", getUserComments);
router.get("/get/States", getAllStatesNCities);
router.get("/get/Only-States", getOnlyStates);
router.get("/get/State/:state", getCityByState);
router.get("/get/IP", getIpDetails);
router.all("/serve", serveProxy);

module.exports = router;

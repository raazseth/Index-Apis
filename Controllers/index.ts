import { Request, Response } from "express";
import Todo from "../Models/TodoModel";
import Post from "../Models/PostModel";
import Comment from "../Models/CommentModel";
import StateNCity from "../Models/StateNCityModel";
import {
  PostData,
  ToDoData,
  CommentData,
  CustomUser,
  CityData,
} from "../Data/index";
import { IComment, IIP, IPost, IStateCity, ITodo } from "../Interfaces";
import mongoose from "mongoose";
import axios from "axios";
import request from "request";

export const addTodo = (req: Request, res: Response) => {
  const data: ITodo[] = [];
  ToDoData.forEach((todo) => {
    const obj = new Todo({
      createdBy: todo.createdBy,
      title: todo.title,
      completed: todo.completed,
    });
    obj
      .save()
      .then((result) => {
        data.push(result);
        if (data.length === ToDoData.length) {
          res.status(200).json({ message: "Todo Added Successfully!", data });
        }
      })
      .catch((error) => {
        res.status(400).json({ message: "Something Went Wrong!", error });
      });
  });
};

export const getAllTodo = async (req: Request, res: Response) => {
  const todos = await Todo.find({})
    .sort({ $natural: -1 })
    .select("-__v")
    .populate(
      "createdBy",
      "_id email name username phone website address company"
    )
    .exec();
  res.status(200).json({ todos });
};

export const getTodoByUser = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  const { userId } = req.params;
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const todos = await Todo.find({ createdBy: userId })
      .sort({ $natural: -1 })
      .select("-__v")
      .populate(
        "createdBy",
        "_id email name username phone website address company"
      )
      .exec();
    res.status(200).json({ todos });
  } else {
    return res.status(400).json({ message: "Invalid User ID" });
  }
};

export const addPosts = (req: Request, res: Response) => {
  const data: IPost[] = [];
  PostData.forEach((post) => {
    const obj = new Post({
      createdBy: post.createdBy,
      title: post.title,
      body: post.body,
      postId: post.id,
    });
    obj
      .save()
      .then((result) => {
        data.push(result);
        if (data.length === PostData.length) {
          res.status(200).json({ message: "Post Added Successfully!", data });
        }
      })
      .catch((error) => {
        res.status(400).json({ message: "Something Went Wrong!", error });
      });
  });
};

export const getAllPosts = async (req: Request, res: Response) => {
  const posts = await Post.find({})
    .sort({ $natural: -1 })
    .select("-postId")
    .select("-__v")
    .populate(
      "createdBy",
      "_id email name username phone website address company"
    )
    .exec();
  res.status(200).json({ posts });
};

export const getUserPosts = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  const { userId } = req.params;
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const posts = await Post.find({ createdBy: userId })
      .sort({ $natural: -1 })
      .select("-postId")
      .select("-__v")
      .populate(
        "createdBy",
        "_id email name username phone website address company"
      )
      .exec();
    res.status(200).json({ posts });
  } else {
    return res.status(400).json({ message: "Invalid User ID" });
  }
};

export const addComment = (req: Request, res: Response) => {
  Post.find({}).exec((error, post) => {
    if (error) {
      res.status(400).json({ message: "Something Went Wrong!", error });
    }
    if (post) {
      const data: IComment[] = [];
      post.forEach((pst) => {
        CommentData.forEach((comment) => {
          if (comment.postId === pst.postId) {
            const obj = new Comment({
              createdBy:
                CustomUser[Math.floor(Math.random() * CustomUser.length)]._id,
              body: comment.body,
              postId: pst._id,
            });
            obj
              .save()
              .then((result) => {
                data.push(result);
                if (data.length === CommentData.length) {
                  res
                    .status(200)
                    .json({ message: "Comment Added Successfully!", data });
                }
              })
              .catch((error) => {
                res
                  .status(400)
                  .json({ message: "Something Went Wrong!", error });
              });
          }
        });
      });
    }
  });
};

export const getAllComments = async (req: Request, res: Response) => {
  const comments = await Comment.find({})
    .sort({ $natural: -1 })
    .select("-__v")
    .populate("postId", "-__v")
    .populate(
      "createdBy",
      "_id email name username phone website address company"
    )
    .exec();
  res.status(200).json({ comments });
};

export const getPostComments = async (
  req: Request<{ postId: String }>,
  res: Response
) => {
  const { postId } = req.params;
  if (postId) {
    const comments = await Comment.find({ postId: postId })
      .sort({ $natural: -1 })
      .select("-__v")
      .populate("postId", "-__v")
      .populate(
        "createdBy",
        "_id email name username phone website address company"
      )
      .exec();
    res.status(200).json({ comments });
  } else {
    return res.status(400).json({ message: "Invalid Post ID" });
  }
};

export const getUserComments = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  const { userId } = req.params;
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const comments = await Comment.find({ createdBy: userId })
      .sort({ $natural: -1 })
      .select("-__v")
      .populate("postId", "-__v")
      .populate(
        "createdBy",
        "_id email name username phone website address company"
      )
      .exec();
    res.status(200).json({ comments });
  } else {
    return res.status(400).json({ message: "Invalid User ID" });
  }
};

export const addStateNCity = (req: Request, res: Response) => {
  const data: IStateCity[] = [];
  CityData.forEach((city) => {
    const obj = new StateNCity({
      name: city.name,
      state: city.state,
    });
    obj
      .save()
      .then((result) => {
        data.push(result);
        if (data.length === CityData.length) {
          res
            .status(200)
            .json({ message: "States And Cities Added Successfully!", data });
        }
      })
      .catch((error) => {
        res.status(400).json({ message: "Something Went Wrong!", error });
      });
  });
};

export const getCityByState = async (
  req: Request<{ state: String }>,
  res: Response
) => {
  const { state } = req.params;
  if (state) {
    const city = await StateNCity.find({ state })
      .sort({ $natural: -1 })
      .select("-__v")
      .exec();
    res.status(200).json({ city });
  } else {
    return res.status(400).json({ message: "Enter Valid State" });
  }
};

export const getAllStatesNCities = async (req: Request, res: Response) => {
  const states = await StateNCity.find({})
    .sort({ $natural: -1 })
    .select("-__v")
    .exec();
  res.status(200).json({ states });
};

export const getIpDetails = async (req: Request, res: Response) => {
  const IP: IIP = await axios.get("http://ip-api.com/json/");
  const IP_Details = await axios.get(
    `http://ip-api.com/json/${IP.data.query}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`
  );
  res.status(200).json(IP_Details.data);
};

export const serveProxy = (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    req.header("access-control-request-headers")
  );

  if (req.method === "OPTIONS") {
    res.send("ok");
  } else {
    const targetURL = req.header("Target_URL");
    if (!targetURL) {
      return res
        .status(200)
        .json({ message: "There is no Target URL header in the request" });
    } else {
      request(
        {
          url: targetURL,
          method: req.method,
          json: req.body,
          headers: { Authorization: req.header("Authorization") },
        },
        function (error, response) {
          if (error) {
            res.status(200).json({
              message: "Something Went Wrong!!",
            });
          }
        }
      ).pipe(res);
    }
  }
};

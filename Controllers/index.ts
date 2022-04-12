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

export const api_Guide = (req: Request, res: Response) => {
  const data = {
    version: "1.1.0",
    info: {
      title: "INDEX_APIs",
      description:
        "This is a collection of APIs that are used to perform CRUD operations on the database.",
      why: "I wanted to create a collection of APIs that can be used to perform CRUD operations on the database to test thier skills and how authentication or api calls work in frontend. Send me email for any issues or suggestions.",
      data_usage: [
        {
          name: "Typicode (Jsonplaceholder)",
          url: "https://jsonplaceholder.typicode.com/",
          follow_social_sites: [
            { name: "Github", url: "https://github.com/typicode" },
            { name: "Twitter", url: "https://twitter.com/typicode" },
          ],
        },
      ],
      contact: {
        email: "sethraj03@gmail.com",
      },
    },
    servers: [
      {
        url: "https://indexapis.herokuapp.com/",
      },
    ],
    paths: {
      "/api/": {
        get: {
          description: "To get api specification for documentation",
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns api specification",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/login": {
        post: {
          description:
            "Login to the application. Returns a JSON object of user details",
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns a JSON object for login",
            },
          },
        },
      },
      "/api/allUser": {
        get: {
          description: "To get all Users",
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns a JSON object of all Users",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/user/:userId": {
        get: {
          description: "To get a User by Id",
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns a JSON object of a User",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/get/Todo": {
        get: {
          description: "To get all Todos",
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns a JSON object of all Todos",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/get/Todo/:userId": {
        get: {
          description: "To get all Todos by User Id",
          produces: ["application/json"],
          parameters: [
            {
              name: "userId",
              in: "params",
              description: "Enter user id to get all Todos for user",
              required: true,
            },
          ],
          responses: {
            "200": {
              description: "Returns a JSON object of all Todos for user",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/get/Post": {
        get: {
          description: "To get all Posts",
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns a JSON object of all Posts",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/get/Post/:userId": {
        get: {
          description: "To get all Posts by User Id",
          parameters: [
            {
              name: "userId",
              in: "params",
              description: "Enter user id to get all Posts for user",
              required: true,
            },
          ],
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns a JSON object of all Posts for user",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/get/Comment": {
        get: {
          description: "To get all Comments",
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns a JSON object of all Comments",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/get/Post/Comment/:postId": {
        get: {
          description: "To get all Comments by Post Id",
          parameters: [
            {
              name: "postId",
              in: "params",
              description: "Enter post id to get all Comments for post",
              required: true,
            },
          ],
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns a JSON object of all Comments for post",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/get/Comment/:userId": {
        get: {
          description: "To get all Comments by User Id",
          parameters: [
            {
              name: "userId",
              in: "params",
              description: "Enter user id to get all Comments for user",
              required: true,
            },
          ],
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns a JSON object of all Comments for user",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/get/States": {
        get: {
          description: "To get all States in India",
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns a JSON object of all States in India",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/get/State/:state": {
        get: {
          description: "To get all Cities in a State",
          parameters: [
            {
              name: "state",
              in: "params",
              description: "Enter state to get all Cities in a State",
              required: true,
            },
          ],
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns a JSON object of all Cities in a State",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/get/IP": {
        get: {
          description: "To get IP Address",
          produces: ["application/json"],
          responses: {
            "200": {
              description: "Returns a JSON object of IP Address",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
      "/api/serve": {
        all: {
          description:
            "This API works as a proxy to serve the any targeted url. Works with any request method and can be used as a proxy to any other API and solve cors errors",
          produces: ["application/json"],
          headers: [
            {
              name: "Target_URL",
              in: "key",
              vale: "Targeted URL",
              description: "Enter the URL to be served",
              required: true,
            },
          ],
          responses: {
            "200": {
              description: "Returns a JSON object of the response from the url",
            },
            "400": {
              description: "Returns a JSON error object of API call",
            },
          },
        },
      },
    },
  };
  res.status(200).json({ data });
};

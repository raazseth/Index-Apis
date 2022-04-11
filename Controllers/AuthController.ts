import { Request, Response } from "express";
import User from "../Models/UserModel";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { CustomUser } from "../Data/index";
import { IUser } from "../Interfaces";

export const SignUp = async (req: Request, res: Response) => {
  const {
    email,
    name,
    username,
    street,
    suite,
    city,
    zipcode,
    lat,
    lng,
    phone,
    website,
    companyName,
    catchPhrase,
    bs,
    password,
  } = req.body;

  User.findOne({ email }, async (err: any, user: IUser) => {
    if (user) {
      res.status(400).json({
        message: "User already found",
      });
    }
    if (err) {
      res.status(400).json({
        message: "Something Went Wrong!",
        error: err,
      });
    }
    if (!user) {
      const hash_password = await bcrypt.hash(password, 10);

      const obj = new User({
        email,
        name,
        username,
        address: {
          street,
          suite,
          city,
          zipcode,
          geo: {
            lat,
            lng,
          },
        },
        phone,
        website,
        company: {
          name: companyName,
          catchPhrase,
          bs,
        },
        hash_password,
      });

      obj
        .save()
        .then((result) => {
          const token = JWT.sign(
            { _id: result._id },
            process.env["JWT_SECRET"] || ""
          );
          const {
            _id,
            email,
            name,
            username,
            phone,
            website,
            address,
            company,
          } = result;

          return res.status(200).json({
            message: "User created Successfully..!",
            token,
            user: {
              _id,
              email,
              name,
              username,
              phone,
              website,
              address,
              company,
            },
          });
        })
        .catch((error) => {
          res.status(400).json({
            message: "Something Went Wrong!",
            error,
          });
        });
    }
  });
};

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec(async (error, user) => {
    if (error) {
      res.status(400).json({
        message: "Something Went Wrong!",
        error,
      });
    }
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
    }
    if (user) {
      const isPassword = await bcrypt.compare(password, user.hash_password);

      if (isPassword) {
        const token = JWT.sign(
          { _id: user._id },
          process.env["JWT_SECRET"] || ""
        );

        const { _id, email, name, username, phone, website, address, company } =
          user;

        res.cookie("token", token);
        res.status(200).json({
          token,
          user: {
            _id,
            email,
            name,
            username,
            phone,
            website,
            address,
            company,
          },
        });
      }
    }
  });
};

export const addUser = (req: Request, res: Response) => {
  const allData: IUser[] = [];
  CustomUser.forEach(async (person) => {
    const hash_password = await bcrypt.hash(person.username, 10);

    const obj = new User({
      email: person.email,
      name: person.name,
      username: person.username,
      address: {
        street: person.address.street,
        suite: person.address.suite,
        city: person.address.city,
        zipcode: Number(person.address.zipcode),
        geo: {
          lat: Number(person.address.geo.lat),
          lng: Number(person.address.geo.lng),
        },
      },
      phone: Number(person.phone),
      website: person.website,
      company: {
        name: person.company.name,
        catchPhrase: person.company.catchPhrase,
        bs: person.company.bs,
      },
      hash_password,
    });

    await obj
      .save()
      .then((result: IUser) => {
        allData.push(result);

        if (allData.length === CustomUser.length) {
          return res.status(200).json({
            message: "User created Successfully..!",
            user: allData,
          });
        }
      })
      .catch((error) => {
        res.status(400).json({
          message: "Something Went Wrong!",
          error,
        });
      });
  });
};

export const getUsers = async (req: Request, res: Response) => {
  const user = await User.find({}).sort({ $natural: -1 }).select("-__v").exec();
  res.status(200).json({ user });
};

export const getCertainUser = async (
  req: Request<{ userId: String }>,
  res: Response
) => {
  const user = await User.findOne({ _id: req.params.userId })
    .sort({ $natural: -1 })
    .select("-__v")
    .exec();
  res.status(200).json({ user });
};

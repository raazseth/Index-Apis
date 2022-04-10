import { NextFunction, Response, Request } from "express";
import { check, validationResult } from "express-validator";

exports.validateSigninRequest = [
  check("email").isEmail().withMessage("Valid Email is required"),
  check("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 character long"),
];

export const isLoginRequestValidated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

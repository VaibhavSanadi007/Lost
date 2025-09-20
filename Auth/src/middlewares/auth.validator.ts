import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = (req:Request, res:Response, next:NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: `Validation error `, errors });
  }

  next();
};

export const registerValidator = [
  body("username")
    .notEmpty()
    .withMessage("username is required")
    .isString()
    .withMessage("username must be in string")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("name must not be under 3 character and above 20 character"),
  body("email").notEmpty().withMessage('email is required').isLength({min:10,max:30}).trim().isEmail().withMessage('Only email required'),
  body("name") 
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be in string")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("name must not be under 3 character and above 20 character"),
    body("password").notEmpty().withMessage('password is required').isLength({min:3,max:20}).trim().isStrongPassword().withMessage('password should be strong'),
     body("role")
    .optional()
    .isIn(["user","admin"])
    .withMessage("role must be either user or seller"), 
    handleValidationErrors
];


export const loginValidator = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("invalid email address"),
  body("username")
    .optional()
    .isString()
    .withMessage("username must be a string"),
  body("password")
    .isLength({ min: 3, max:20 })
    .withMessage("password must be atleast 6 characters long")
    .notEmpty()
    .withMessage("password is required"),
  handleValidationErrors,
];


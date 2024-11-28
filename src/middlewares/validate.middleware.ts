import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';


export const validateSignUpLogin = [
    body('email')
        .isEmail()
        .withMessage("Invalid Email Format")
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .trim(),
];


export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: errors.array(),
        })
        return;
    }

    next();
}
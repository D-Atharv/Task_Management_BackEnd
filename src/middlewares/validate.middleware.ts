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

// export const validateTask = [
//     body('title').notEmpty().withMessage('Title is required'),
//     body('priority').isInt({ min: 1, max: 5 }).withMessage('Priority must be between 1 and 5'),
//     body('status').isIn(['pending', 'finished']).withMessage('Status must be either "pending" or "finished"'),
//     body('startTime').isISO8601().withMessage('Start time must be a valid ISO 8601 date'),
//     body('endTime').optional().isISO8601().withMessage('End time must be a valid ISO 8601 date'),
//   ];
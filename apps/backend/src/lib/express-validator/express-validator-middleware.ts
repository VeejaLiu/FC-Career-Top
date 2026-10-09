import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateErrorCheck = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        // Don't return the response, just end here
    } else {
        next(); // Call next() to continue processing
    }
};

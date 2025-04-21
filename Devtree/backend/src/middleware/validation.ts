import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { validationResult } from 'express-validator';

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({errors: errors.array()})
  }
  next()
}

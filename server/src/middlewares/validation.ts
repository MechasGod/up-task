import { validationResult } from "express-validator"
import {Request, Response, NextFunction} from "express"

export const handleErrors = (req: Request, res: Response, next: NextFunction) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() }).status(400)
  }
  next()
}
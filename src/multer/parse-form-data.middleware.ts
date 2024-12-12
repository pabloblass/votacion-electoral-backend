import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ParseFormDataMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.is('multipart/form-data')) {
      const formData = req.body;

      const parsedData = {};

      for (const key in formData) {
        parsedData[key] = formData[key];
      }

      req.body = parsedData;
    }
    next();
  }
}

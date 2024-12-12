import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      const uploadPath = process.env.ROOT_PATH_IMAGES || './uploads';
      cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname);
      const uniqueFileName = `${uuidv4()}${extension}`;
      return cb(null, uniqueFileName);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
  fileFilter: (_req, file, cb) => {
    // Validar que el archivo sea una imagen permitida (jpg, jpeg, png, gif)
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return cb(
        new BadRequestException(
          'Tipo de archivo no permitido. Solo se permiten imágenes (jpg, jpeg, png, gif).',
        ),
        false,
      );
    }
    cb(null, true);
  },
};

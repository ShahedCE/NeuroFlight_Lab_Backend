import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname, join } from "path"; 
import * as fs from 'fs';

/**
 * Multer storage config
 * Determines where files will be stored
 */


export const multerStorage = (folder: string) =>
  diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(process.cwd(), 'uploads', folder);

      // ensure folder exists
      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },

    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now();
      const ext = extname(file.originalname);

      const filename = `${folder}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  });

/**
 * Image validation
 */
export const imageFileFilter = (req, file, callback) => {
  const allowedTypes = /jpg|jpeg|png|webp/;

  const ext = extname(file.originalname).toLowerCase();

  if (!allowedTypes.test(ext)) {
    return callback(
      new BadRequestException('Only image files are allowed'),
      false,
    );
  }

  callback(null, true);
};

/**
 * CV validation
 */
export const cvFileFilter = (req, file, callback) => {
  const allowedTypes = /pdf|doc|docx/;

  const ext = extname(file.originalname).toLowerCase();

  if (!allowedTypes.test(ext)) {
    return callback(
      new BadRequestException('Only PDF or Word files are allowed'),
      false,
    );
  }

  callback(null, true);
};
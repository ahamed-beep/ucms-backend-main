import { memoryStorage } from 'multer';
import { ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';

export const multerMemoryOptions = {
  storage: memoryStorage(),
};

export const imageFilePipe = (required: boolean) =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }),
      new FileTypeValidator({ fileType: /image\/(jpeg|png|webp|jpg)/ }),
    ],
    fileIsRequired: required,
  });
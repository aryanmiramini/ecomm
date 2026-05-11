import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// Define the file type interface locally
interface UploadedFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class UploadsService {
  private readonly mediaDir = path.join(process.cwd(), 'media');

  constructor() {
    // Ensure media directory exists
    this.ensureDirectoryExists(this.mediaDir);
    this.ensureDirectoryExists(path.join(this.mediaDir, 'products'));
  }

  private ensureDirectoryExists(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async uploadImage(file: UploadedFileType): Promise<string> {
    // Generate a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const extension = path.extname(originalName) || this.getExtensionFromMime(file.mimetype);
    const filename = `${timestamp}-${randomString}${extension}`;
    
    // Save file to products folder
    const filePath = path.join(this.mediaDir, 'products', filename);
    fs.writeFileSync(filePath, file.buffer);
    
    // Return relative URL path (will be served by NestJS static assets)
    return `/media/products/${filename}`;
  }

  async uploadImages(files: UploadedFileType[]): Promise<string[]> {
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const url = await this.uploadImage(file);
      uploadedUrls.push(url);
    }
    return uploadedUrls;
  }

  private getExtensionFromMime(mimetype: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
    };
    return mimeToExt[mimetype] || '.jpg';
  }
}

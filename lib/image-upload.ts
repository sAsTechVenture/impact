import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Initialize S3 client if AWS credentials are provided
const s3Client = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ? new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
const USE_S3 = process.env.USE_S3 === 'true' && s3Client && S3_BUCKET_NAME;

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload image to local storage or S3
 */
export async function uploadImage(
  file: File | Buffer,
  folder: 'products' | 'services' | 'events' | 'employees',
  filename?: string
): Promise<UploadResult> {
  const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;
  const originalName = file instanceof File ? file.name : filename || 'image';
  const ext = originalName.split('.').pop() || 'jpg';
  const uniqueFilename = filename || `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  if (USE_S3) {
    // Upload to S3
    const s3Key = `${folder}/${uniqueFilename}`;
    
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: getContentType(ext),
      ACL: 'public-read',
    });

    await s3Client!.send(command);
    
    // Construct S3 URL
    const s3Url = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${s3Key}`;
    
    return {
      url: s3Url,
      path: s3Key,
    };
  } else {
    // Upload to local storage
    const uploadsDir = join(process.cwd(), 'public', folder, 'uploads');
    
    // Ensure directory exists
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    const filePath = join(uploadsDir, uniqueFilename);
    await writeFile(filePath, buffer);
    
    // Return URL path (relative to public folder)
    const url = `/${folder}/uploads/${uniqueFilename}`;
    
    return {
      url,
      path: filePath,
    };
  }
}

/**
 * Delete image from local storage or S3
 */
export async function deleteImage(
  url: string,
  folder: 'products' | 'services' | 'events' | 'employees'
): Promise<void> {
  if (USE_S3) {
    // Extract S3 key from URL
    const s3Key = url.includes('amazonaws.com/') 
      ? url.split('amazonaws.com/')[1]
      : `${folder}/${url.split('/').pop()}`;
    
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
    });
    
    await s3Client!.send(command);
  } else {
    // Delete from local storage
    // Handle both old format (/{folder}/filename) and new format (/{folder}/uploads/filename)
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const isInUploads = urlParts[urlParts.length - 2] === 'uploads';
    
    if (filename) {
      const filePath = isInUploads
        ? join(process.cwd(), 'public', folder, 'uploads', filename)
        : join(process.cwd(), 'public', folder, filename);
      try {
        await unlink(filePath);
      } catch (error) {
        // File might not exist, ignore error
        console.warn(`Failed to delete file: ${filePath}`, error);
      }
    }
  }
}

/**
 * Get content type from file extension
 */
function getContentType(ext: string): string {
  const contentTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
  };
  
  return contentTypes[ext.toLowerCase()] || 'image/jpeg';
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid image type. Allowed: JPEG, PNG, GIF, WebP' };
  }
  
  return { valid: true };
}

/**
 * Validate video file
 */
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 100 * 1024 * 1024; // 100MB
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Video size must be less than 100MB' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid video type. Allowed: MP4, WebM, MOV, AVI' };
  }
  
  return { valid: true };
}

/**
 * Upload video to local storage or S3
 */
export async function uploadVideo(
  file: File | Buffer,
  folder: 'products' | 'services' | 'events' | 'employees',
  filename?: string
): Promise<UploadResult> {
  const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;
  const originalName = file instanceof File ? file.name : filename || 'video';
  const ext = originalName.split('.').pop() || 'mp4';
  const uniqueFilename = filename || `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  if (USE_S3) {
    // Upload to S3
    const s3Key = `${folder}/uploads/${uniqueFilename}`;
    
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: getContentType(ext),
      ACL: 'public-read',
    });

    await s3Client!.send(command);
    
    // Construct S3 URL
    const s3Url = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${s3Key}`;
    
    return {
      url: s3Url,
      path: s3Key,
    };
  } else {
    // Upload to local storage
    const uploadsDir = join(process.cwd(), 'public', folder, 'uploads');
    
    // Ensure directory exists
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    const filePath = join(uploadsDir, uniqueFilename);
    await writeFile(filePath, buffer);
    
    // Return URL path (relative to public folder)
    const url = `/${folder}/uploads/${uniqueFilename}`;
    
    return {
      url,
      path: filePath,
    };
  }
}


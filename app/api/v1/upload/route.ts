import { NextRequest, NextResponse } from 'next/server';
import { requireAuthAdmin } from '@/lib/middleware';
import { uploadImage, uploadVideo, validateImageFile, validateVideoFile } from '@/lib/image-upload';

// POST /api/v1/upload - Upload image or video (admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuthAdmin(request);
    if (authResult.error) return authResult.error;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as 'products' | 'services' | 'events' | 'employees';
    const fileType = formData.get('type') as 'image' | 'video' | null;
    const filename = formData.get('filename') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!folder || !['products', 'services', 'events', 'employees'].includes(folder)) {
      return NextResponse.json(
        { error: 'Invalid folder. Must be: products, services, events, or employees' },
        { status: 400 }
      );
    }

    // Determine file type from file or parameter
    const isVideo = fileType === 'video' || file.type.startsWith('video/');
    
    if (isVideo) {
      // Validate video file
      const validation = validateVideoFile(file);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      // Upload video
      const result = await uploadVideo(file, folder, filename || undefined);
      return NextResponse.json({
        url: result.url,
        path: result.path,
        type: 'video',
      });
    } else {
      // Validate image file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      // Upload image
      const result = await uploadImage(file, folder, filename || undefined);
      return NextResponse.json({
        url: result.url,
        path: result.path,
        type: 'image',
      });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest, requireAuthAdmin } from "@/lib/middleware";

// GET /api/v1/events/[id] - Get single event (public read)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await (prisma.event.findUnique as any)({
      where: { id },
      include: {
        eventImages: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/events/[id] - Update event (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuthAdmin(request);
    if (authResult.error) return authResult.error;

    const body = await request.json();
    const {
      title,
      slug,
      eventType,
      description,
      startDate,
      endDate,
      timeZone,
      location,
      address,
      city,
      isOnline,
      onlineUrl,
      requiresRegistration,
      registrationUrl,
      registrationDeadline,
      maxAttendees,
      status,
      isPublished,
      isFeatured,
      imageUrl,
      videoUrl,
      eventImages,
    } = body;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingEvent.slug) {
      const slugExists = await prisma.event.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Event with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (eventType !== undefined) updateData.eventType = eventType;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined)
      updateData.endDate = endDate ? new Date(endDate) : null;
    if (timeZone !== undefined) updateData.timeZone = timeZone;
    if (location !== undefined) updateData.location = location;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (isOnline !== undefined) updateData.isOnline = isOnline;
    if (onlineUrl !== undefined) updateData.onlineUrl = onlineUrl;
    if (requiresRegistration !== undefined)
      updateData.requiresRegistration = requiresRegistration;
    if (registrationUrl !== undefined) updateData.registrationUrl = registrationUrl;
    if (registrationDeadline !== undefined)
      updateData.registrationDeadline = registrationDeadline
        ? new Date(registrationDeadline)
        : null;
    if (maxAttendees !== undefined)
      updateData.maxAttendees = maxAttendees ? parseInt(maxAttendees) : null;
    if (status !== undefined) updateData.status = status;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;

    // Handle eventImages update
    if (eventImages !== undefined && Array.isArray(eventImages)) {
      // Delete existing event images
      try {
        await (prisma as any).eventImage.deleteMany({
          where: { eventId: id },
        });
      } catch (error) {
        // Ignore if model doesn't exist yet (for backward compatibility)
        console.warn('Error deleting event images:', error);
      }

      // Create new event images
      if (eventImages.length > 0) {
        updateData.eventImages = {
          create: eventImages.map((url: string, index: number) => ({
            imageUrl: url,
            isPrimary: index === 0,
            sortOrder: index,
          })),
        };
      }
    }

    const event = await (prisma.event.update as any)({
      where: { id },
      data: updateData,
      include: {
        eventImages: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/events/[id] - Delete event (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuthAdmin(request);
    if (authResult.error) return authResult.error;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}


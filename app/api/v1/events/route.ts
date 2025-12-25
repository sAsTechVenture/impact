import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest, requireAuthAdmin } from "@/lib/middleware";

// GET /api/v1/events - List events (public read)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: "desc" },
      }),
      prisma.event.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: events,
      total,
      totalPages,
      page,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/v1/events - Create event (admin only)
export async function POST(request: NextRequest) {
  try {
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
    } = body;

    // Validate required fields
    if (!title || !slug || !startDate) {
      return NextResponse.json(
        { error: "Title, slug, and startDate are required" },
        { status: 400 }
      );
    }
    

    // Check if slug already exists
    const existingEvent = await prisma.event.findUnique({
      where: { slug },
    });

    if (existingEvent) {
      return NextResponse.json(
        { error: "Event with this slug already exists" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        eventType: eventType || "general",
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        timeZone: timeZone || "Asia/Kolkata",
        location,
        address,
        city,
        isOnline: isOnline || false,
        onlineUrl,
        requiresRegistration: requiresRegistration || false,
        registrationUrl,
        registrationDeadline: registrationDeadline
          ? new Date(registrationDeadline)
          : null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        status: status || "upcoming",
        isPublished: isPublished !== undefined ? isPublished : true,
        isFeatured: isFeatured || false,
        imageUrl,
      } as any, // Temporary: Prisma client types need regeneration after schema changes
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}


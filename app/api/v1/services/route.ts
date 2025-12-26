import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthAdmin } from "@/lib/middleware";

// GET /api/v1/services - List services (public read)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";

    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.service.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: services,
      total,
      totalPages,
      page,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST /api/v1/services - Create service (admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuthAdmin(request);
    if (authResult.error) return authResult.error;

    const body = await request.json();
    const {
      name,
      slug,
      categoryId,
      description,
      serviceType,
      duration,
      price,
      currency,
      imageUrl,
      bookUrl,
      features,
      status,
      isActive,
      isFeatured,
      sortOrder,
    } = body;

    // Validate required fields
    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Name and categoryId are required" },
        { status: 400 }
      );
    }

    // Generate slug from name if not provided
    const generateSlug = (name: string): string => {
      return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    const finalSlug = slug || generateSlug(name);

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug: finalSlug },
    });

    if (existingService) {
      return NextResponse.json(
        { error: "Service with this slug already exists" },
        { status: 400 }
      );
    }

    // Map status to isActive if status is provided
    const finalIsActive = isActive !== undefined 
      ? isActive 
      : (status !== undefined ? status === 'active' : true);

    const service = await prisma.service.create({
      data: {
        name,
        slug: finalSlug,
        categoryId,
        description,
        serviceType: serviceType || "standard",
        duration,
        price: price ? parseFloat(price.toString()) : null,
        currency: currency || "INR",
        imageUrl,
        bookUrl,
        features: features ? JSON.parse(JSON.stringify(features)) : null,
        isActive: finalIsActive,
        isFeatured: isFeatured || false,
        sortOrder: sortOrder || 0,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}



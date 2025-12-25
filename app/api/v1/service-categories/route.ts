import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthAdmin } from "@/lib/middleware";

// GET /api/v1/service-categories - List service categories (public read)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");

    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    const [categories, total] = await Promise.all([
      prisma.serviceCategory.findMany({
        where,
        include: {
          _count: {
            select: {
              services: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { sortOrder: "asc" },
      }),
      prisma.serviceCategory.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: categories,
      total,
      totalPages,
      page,
    });
  } catch (error) {
    console.error("Error fetching service categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch service categories" },
      { status: 500 }
    );
  }
}

// POST /api/v1/service-categories - Create service category (admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuthAdmin(request);
    if (authResult.error) return authResult.error;

    const body = await request.json();
    const { name, slug, description, isActive, sortOrder } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.serviceCategory.create({
      data: {
        name,
        slug,
        description,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating service category:", error);
    return NextResponse.json(
      { error: "Failed to create service category" },
      { status: 500 }
    );
  }
}



import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthAdmin } from "@/lib/middleware";

// GET /api/v1/services/[id] - Get single service (public read)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
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

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/services/[id] - Update service (admin only)
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

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingService.slug) {
      const slugExists = await prisma.service.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Service with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (description !== undefined) updateData.description = description;
    if (serviceType !== undefined) updateData.serviceType = serviceType;
    if (duration !== undefined) updateData.duration = duration;
    if (price !== undefined)
      updateData.price = price ? parseFloat(price.toString()) : null;
    if (currency !== undefined) updateData.currency = currency;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (bookUrl !== undefined) updateData.bookUrl = bookUrl;
    if (features !== undefined)
      updateData.features = features ? JSON.parse(JSON.stringify(features)) : null;
    // Map status to isActive if status is provided, otherwise use isActive directly
    if (status !== undefined) {
      updateData.isActive = status === 'active';
    } else if (isActive !== undefined) {
      updateData.isActive = isActive;
    }
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/services/[id] - Delete service (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuthAdmin(request);
    if (authResult.error) return authResult.error;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}


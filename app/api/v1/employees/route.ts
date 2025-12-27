import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthAdmin } from "@/lib/middleware";

// GET /api/v1/employees - List employees (public read)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { designation: { contains: search } },
        { department: { contains: search } },
      ];
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              designation: true,
            },
          },
          _count: {
            select: {
              reports: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { sortOrder: "asc" },
      }),
      prisma.employee.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: employees,
      total,
      totalPages,
      page,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

// POST /api/v1/employees - Create employee (admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuthAdmin(request);
    if (authResult.error) return authResult.error;

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      designation,
      department,
      bio,
      imageUrl,
      linkedinUrl,
      managerId,
      isActive,
      sortOrder,
      joinedAt,
    } = body;

    // Validate required fields
    if (!firstName || !firstName.trim()) {
      return NextResponse.json(
        { error: "First name is required", received: { firstName, lastName, designation } },
        { status: 400 }
      );
    }
    if (!lastName || !lastName.trim()) {
      return NextResponse.json(
        { error: "Last name is required", received: { firstName, lastName, designation } },
        { status: 400 }
      );
    }
    if (!designation || !designation.trim()) {
      return NextResponse.json(
        { error: "Designation is required", received: { firstName, lastName, designation } },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided and not empty)
    if (email && email.trim()) {
      const existingEmployee = await prisma.employee.findUnique({
        where: { email: email.trim() },
      });

      if (existingEmployee) {
        return NextResponse.json(
          { error: "Employee with this email already exists" },
          { status: 400 }
        );
      }
    }

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email: email && email.trim() ? email.trim() : undefined,
        phone: phone && phone.trim() ? phone.trim() : undefined,
        designation,
        department: department && department.trim() ? department.trim() : undefined,
        bio: bio && bio.trim() ? bio.trim() : undefined,
        imageUrl: imageUrl && imageUrl.trim() ? imageUrl.trim() : undefined,
        linkedinUrl: linkedinUrl && linkedinUrl.trim() ? linkedinUrl.trim() : undefined,
        managerId: managerId || undefined,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
        joinedAt: joinedAt ? new Date(joinedAt) : null,
      },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            designation: true,
          },
        },
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}



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
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { designation: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
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
    if (!firstName || !lastName || !designation) {
      return NextResponse.json(
        { error: "First name, last name, and designation are required" },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmployee = await prisma.employee.findUnique({
        where: { email },
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
        email,
        phone,
        designation,
        department,
        bio,
        imageUrl,
        linkedinUrl,
        managerId,
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



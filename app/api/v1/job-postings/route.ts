import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthAdmin } from "@/lib/middleware";

// GET /api/v1/job-postings - List job postings (public read)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const departmentId = searchParams.get("departmentId") || "";
    const isActive = searchParams.get("isActive");

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const [jobPostings, total] = await Promise.all([
      prisma.jobPosting.findMany({
        where,
        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { postedAt: "desc" },
      }),
      prisma.jobPosting.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: jobPostings,
      total,
      totalPages,
      page,
    });
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return NextResponse.json(
      { error: "Failed to fetch job postings" },
      { status: 500 }
    );
  }
}

// POST /api/v1/job-postings - Create job posting (admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuthAdmin(request);
    if (authResult.error) return authResult.error;

    const body = await request.json();
    const {
      title,
      slug,
      departmentId,
      jobType,
      location,
      isRemote,
      description,
      requirements,
      salaryMin,
      salaryMax,
      currency,
      applicationDeadline,
      applicationEmail,
      isActive,
      isFeatured,
    } = body;

    // Validate required fields
    if (!title || !slug || !departmentId || !jobType || !location) {
      return NextResponse.json(
        { error: "Title, slug, departmentId, jobType, and location are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPosting = await prisma.jobPosting.findUnique({
      where: { slug },
    });

    if (existingPosting) {
      return NextResponse.json(
        { error: "Job posting with this slug already exists" },
        { status: 400 }
      );
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    const jobPosting = await prisma.jobPosting.create({
      data: {
        title,
        slug,
        departmentId,
        jobType,
        location,
        isRemote: isRemote || false,
        description,
        requirements,
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
        currency: currency || "INR",
        applicationDeadline: applicationDeadline
          ? new Date(applicationDeadline)
          : null,
        applicationEmail,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(jobPosting, { status: 201 });
  } catch (error) {
    console.error("Error creating job posting:", error);
    return NextResponse.json(
      { error: "Failed to create job posting" },
      { status: 500 }
    );
  }
}



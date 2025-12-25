import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthAdmin } from "@/lib/middleware";

// GET /api/v1/job-postings/[id] - Get single job posting (public read)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        applications: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
            appliedAt: true,
          },
          orderBy: { appliedAt: "desc" },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!jobPosting) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(jobPosting);
  } catch (error) {
    console.error("Error fetching job posting:", error);
    return NextResponse.json(
      { error: "Failed to fetch job posting" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/job-postings/[id] - Update job posting (admin only)
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

    // Check if job posting exists
    const existingPosting = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!existingPosting) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingPosting.slug) {
      const slugExists = await prisma.jobPosting.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Job posting with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Check if department exists (if being changed)
    if (departmentId && departmentId !== existingPosting.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
      });

      if (!department) {
        return NextResponse.json(
          { error: "Department not found" },
          { status: 404 }
        );
      }
    }

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (departmentId !== undefined) updateData.departmentId = departmentId;
    if (jobType !== undefined) updateData.jobType = jobType;
    if (location !== undefined) updateData.location = location;
    if (isRemote !== undefined) updateData.isRemote = isRemote;
    if (description !== undefined) updateData.description = description;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (salaryMin !== undefined)
      updateData.salaryMin = salaryMin ? parseFloat(salaryMin) : null;
    if (salaryMax !== undefined)
      updateData.salaryMax = salaryMax ? parseFloat(salaryMax) : null;
    if (currency !== undefined) updateData.currency = currency;
    if (applicationDeadline !== undefined)
      updateData.applicationDeadline = applicationDeadline
        ? new Date(applicationDeadline)
        : null;
    if (applicationEmail !== undefined) updateData.applicationEmail = applicationEmail;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const jobPosting = await prisma.jobPosting.update({
      where: { id },
      data: updateData,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(jobPosting);
  } catch (error) {
    console.error("Error updating job posting:", error);
    return NextResponse.json(
      { error: "Failed to update job posting" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/job-postings/[id] - Delete job posting (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuthAdmin(request);
    if (authResult.error) return authResult.error;

    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!jobPosting) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    await prisma.jobPosting.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Job posting deleted successfully" });
  } catch (error) {
    console.error("Error deleting job posting:", error);
    return NextResponse.json(
      { error: "Failed to delete job posting" },
      { status: 500 }
    );
  }
}



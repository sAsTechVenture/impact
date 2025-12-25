import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthAdmin } from "@/lib/middleware";

// For now, we'll use a simple JSON storage approach
// In the future, you might want to create a PageContent model in Prisma

// GET /api/v1/life-career - Get life & career page content (public read)
export async function GET(request: NextRequest) {
  try {
    // For now, return a default structure
    // In production, you'd fetch from a database model
    const defaultData = {
      id: "life-career-page",
      title: "Life & Career",
      heroTitle: "",
      heroDescription: "",
      heroImageUrl: "",
      aboutSection: "",
      careerSection: "",
      benefitsSection: "",
      ctaTitle: "",
      ctaDescription: "",
      ctaButtonText: "",
      metaTitle: "",
      metaDescription: "",
      updatedAt: new Date().toISOString(),
    };

    // TODO: Replace with actual database query when PageContent model is added
    // const pageContent = await prisma.pageContent.findUnique({
    //   where: { slug: 'life-career' }
    // });
    // return NextResponse.json(pageContent || defaultData);

    return NextResponse.json(defaultData);
  } catch (error) {
    console.error("Error fetching life-career page:", error);
    return NextResponse.json(
      { error: "Failed to fetch page content" },
      { status: 500 }
    );
  }
}

// POST /api/v1/life-career - Create life & career page content (admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuthAdmin(request);
    if (authResult.error) return authResult.error;

    const body = await request.json();
    const {
      title,
      heroTitle,
      heroDescription,
      heroImageUrl,
      aboutSection,
      careerSection,
      benefitsSection,
      ctaTitle,
      ctaDescription,
      ctaButtonText,
      metaTitle,
      metaDescription,
    } = body;

    // TODO: Replace with actual database create when PageContent model is added
    // const pageContent = await prisma.pageContent.create({
    //   data: {
    //     slug: 'life-career',
    //     title: title || 'Life & Career',
    //     heroTitle,
    //     heroDescription,
    //     heroImageUrl,
    //     aboutSection,
    //     careerSection,
    //     benefitsSection,
    //     ctaTitle,
    //     ctaDescription,
    //     ctaButtonText,
    //     metaTitle,
    //     metaDescription,
    //   }
    // });
    // return NextResponse.json(pageContent, { status: 201 });

    // For now, return the data as-is
    const pageContent = {
      id: "life-career-page",
      title: title || "Life & Career",
      heroTitle,
      heroDescription,
      heroImageUrl,
      aboutSection,
      careerSection,
      benefitsSection,
      ctaTitle,
      ctaDescription,
      ctaButtonText,
      metaTitle,
      metaDescription,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(pageContent, { status: 201 });
  } catch (error) {
    console.error("Error creating life-career page:", error);
    return NextResponse.json(
      { error: "Failed to create page content" },
      { status: 500 }
    );
  }
}



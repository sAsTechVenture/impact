import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthAdmin } from "@/lib/middleware";

// PUT /api/v1/life-career/[id] - Update life & career page content (admin only)
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

    // TODO: Replace with actual database update when PageContent model is added
    // const pageContent = await prisma.pageContent.update({
    //   where: { id },
    //   data: {
    //     title,
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
    // return NextResponse.json(pageContent);

    // For now, return the updated data
    const pageContent = {
      id,
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

    return NextResponse.json(pageContent);
  } catch (error) {
    console.error("Error updating life-career page:", error);
    return NextResponse.json(
      { error: "Failed to update page content" },
      { status: 500 }
    );
  }
}


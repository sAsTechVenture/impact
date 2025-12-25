import { NextRequest, NextResponse } from "next/server";
import { verifyToken, TokenPayload } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware to authenticate requests using JWT token
 * Checks for token in cookies and verifies it
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: TokenPayload | null; error: NextResponse | null }> {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return {
        user: null,
        error: NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        ),
      };
    }

    const payload = verifyToken(token);

    if (!payload) {
      return {
        user: null,
        error: NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        ),
      };
    }

    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return {
        user: null,
        error: NextResponse.json(
          { error: "User not found or inactive" },
          { status: 401 }
        ),
      };
    }

    return {
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      error: null,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      user: null,
      error: NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 }
      ),
    };
  }
}

/**
 * Middleware to check if user is admin
 * Must be called after authenticateRequest
 */
export function requireAdmin(user: TokenPayload | null): NextResponse | null {
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (user.role !== "admin" && user.role !== "super_admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Combined middleware for admin-only routes
 */
export async function requireAuthAdmin(
  request: NextRequest
): Promise<{ user: TokenPayload | null; error: NextResponse | null }> {
  const authResult = await authenticateRequest(request);

  if (authResult.error) {
    return authResult;
  }

  const adminError = requireAdmin(authResult.user);

  if (adminError) {
    return {
      user: null,
      error: adminError,
    };
  }

  return authResult;
}



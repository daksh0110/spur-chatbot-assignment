import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";

    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many requests",
        },
        {
          status: 429,
        },
      );
    }
  } catch (error) {
    console.error("Rate limit error:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};

import { NextResponse } from "next/server";

export function createError(message = "Something went wrong", status = 500) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status },
  );
}

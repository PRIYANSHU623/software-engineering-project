// /app/api/students/applied-jobs-count/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../../database/connectDB";
import Students from "../../../../models/student";

export async function GET(req) {
  try {
    await connectDB();

    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Email parameter is required" },
        { status: 400 }
      );
    }

    const student = await Students.findOne({ email });
    if (!student) {
      return NextResponse.json(
        { ok: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const appliedCount = student.job.filter(job => job.status === true).length;
    console.log("✅ Count of jobs with status true:", appliedCount);
    return NextResponse.json({
      ok: true,
      count: appliedCount,
    });

  } catch (error) {
    console.error("❌ Error in applied-jobs-count route:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

import connectDB from "@/database/connectDB";
import Job from "@/models/job";
import Student from "@/models/student";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();

  try {
    const { jobId } = params;

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ ok: false, message: "Job not found" }, { status: 404 });
    }

    const studentIds = job.students;

    const students = await Student.find(
      { _id: { $in: studentIds } },
      "_id name email"
    );

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error fetching interested students:", error);
    return NextResponse.json(
      { ok: false, message: "Error fetching students" },
      { status: 500 }
    );
  }
}

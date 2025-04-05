import { NextResponse } from "next/server";
import connectDB from "../../../../database/connectDB";
import JobPostings from "../../../../models/JobPosting";
import Students from "../../../../models/student";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    console.log("AppliedJobs GET: email =", email);
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
    const appliedJobs = await JobPostings.find({ students: { $in: [email] } });
    return NextResponse.json({ ok: true, appliedJobs, count: appliedJobs.length }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/student/applied-jobs:", error);
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const { jobId, email } = await req.json();
    console.log("AppliedJobs POST: jobId =", jobId, "email =", email);
    if (!jobId || !email) {
      return NextResponse.json(
        { ok: false, message: "Job ID and email are required" },
        { status: 400 }
      );
    }
    const job = await JobPostings.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }
    const student = await Students.findOne({ email });
    if (!student) {
      return NextResponse.json(
        { ok: false, message: "Student not found" },
        { status: 404 }
      );
    }
    if (job.students.includes(email)) {
      return NextResponse.json(
        { ok: false, message: "Already applied to this job" },
        { status: 400 }
      );
    }
    job.students.push(email);
    await job.save();
    return NextResponse.json({ ok: true, message: "Successfully applied to job" }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/student/applied-jobs:", error);
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const { jobId, email } = await req.json();
    console.log("AppliedJobs DELETE: jobId =", jobId, "email =", email);
    if (!jobId || !email) {
      return NextResponse.json(
        { ok: false, message: "Job ID and email are required" },
        { status: 400 }
      );
    }
    const job = await JobPostings.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }
    if (!job.students.includes(email)) {
      return NextResponse.json(
        { ok: false, message: "You haven't applied to this job" },
        { status: 400 }
      );
    }
    job.students = job.students.filter(studentEmail => studentEmail !== email);
    await job.save();
    return NextResponse.json({ ok: true, message: "Successfully withdrew application" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/student/applied-jobs:", error);
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

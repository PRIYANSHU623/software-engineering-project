import connectDB from "@/database/connectDB";
import Student from "@/models/student";
import Job from "@/models/job";  // Import the Job model since we need to update its students array.
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await connectDB();

  try {
    const { studentId } = params;
    const { jobId } = await req.json();

    if (!studentId || !jobId) {
      return NextResponse.json(
        { ok: false, message: "Missing studentId or jobId" },
        { status: 400 }
      );
    }

    console.log("Verifying student:", studentId, "for job:", jobId);

    // First, check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { ok: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // Check if the job is already in the student's job array
    const jobExists = student.job.some(job => job.job_id.toString() === jobId);

    if (!jobExists) {
      // Add the job to the student's job array if it doesn't exist
      student.job.push({
        job_id: jobId,
        status: true
      });
      await student.save();
    } else {
      // Update the existing job's status
      await Student.findByIdAndUpdate(
        studentId,
        {
          $set: {
            "job.$[elem].status": true
          }
        },
        {
          arrayFilters: [{ "elem.job_id": jobId }],
          new: true
        }
      );
    }

    // Remove the verified student from the corresponding job's students array.
    await Job.findByIdAndUpdate(
      jobId,
      { $pull: { students: studentId } },
      { new: true }
    );

    // Fetch the updated student
    const updatedStudent = await Student.findById(studentId);

    console.log("Student verified successfully:", updatedStudent);

    return NextResponse.json({
      ok: true,
      message: "Student verified successfully",
      student: updatedStudent
    });
  } catch (error) {
    console.error("❌ Error verifying student:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to verify student", error: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import connectDB from "../../../../database/connectDB";
import Students from "../../../../models/student";

export async function GET(req) {
  await connectDB();

  try {
    const email = req.nextUrl.searchParams.get("email");
    console.log("✅ Fetching verified jobs for:", email);

    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Populate the job_id field inside the job array
    const student = await Students.findOne({ email }).populate("job.job_id");

    if (!student) {
      return NextResponse.json(
        { ok: false, message: "Student not found" },
        { status: 404 }
      );
    }

    console.log("🎓 Student found:", student);
    console.log("🧠 Student.jobs:", student.job);

    // Filter and map the job data
    const verifiedJobs = student.job
      .filter(entry => entry.status === false || entry.status === true && entry.job_id) // make sure job_id is populated
      .map(entry => ({
        ...entry.job_id.toObject(), // actual job details
        status: entry.status        // include the student's application status
      }));

    return NextResponse.json({
      ok: true,
      appliedJobs: verifiedJobs,
      count: verifiedJobs.length,
    });

  } catch (error) {
    console.error("❌ Error fetching verified jobs:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}


// export async function GET(req) {
//   await connectDB();
//   try {
//     const { searchParams } = new URL(req.url);
//     const email = req.nextUrl.searchParams.get("email");
//     console.log("AppliedJobs GET: email =", email);
//     if (!email) {
//       return NextResponse.json(
//         { ok: false, message: "Email parameter is required" },
//         { status: 400 }
//       );
//     }
//     const student = await Students.findOne({ email });
//     if (!student) {
//       return NextResponse.json(
//         { ok: false, message: "Student not found" },
//         { status: 404 }
//       );
//     }
//     const appliedJobs = await JobPostings.find({ students: { $in: [email] } });
//     return NextResponse.json({ ok: true, appliedJobs, count: appliedJobs.length }, { status: 200 });
//   } catch (error) {
//     console.error("Error in GET /api/student/applied-jobs:", error);
//     return NextResponse.json(
//       { ok: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

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

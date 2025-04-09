// // // /pages/api/jobs/[jobId]/interested.js
// // import { NextResponse } from "next/server";
// // import connectDB from "../../../../../database/connectDB";
// // import Job from "../../../../../models/job";

// // export default async function handler(req, res) {
// //   const {
// //     method,
// //     query: { jobId },
// //   } = req;

// //   await dbConnect();

// //   if (method === "PATCH") {
// //     const { studentId } = req.body;

// //     if (!studentId) {
// //       return res.status(400).json({ message: "Student ID is required." });
// //     }

// //     try {
// //       const job = await Job.findById(jobId);
// //       if (!job) {
// //         return res.status(404).json({ message: "Job not found." });
// //       }

// //       if (!job.interestedStudents.includes(studentId)) {
// //         job.interestedStudents.push(studentId);
// //         await job.save();
// //       }

// //       res.status(200).json({ message: "Interest recorded successfully!" });
// //     } catch (error) {
// //       console.error("Error recording interest:", error);
// //       res.status(500).json({ message: "Internal server error." });
// //     }
// //   } else {
// //     res.setHeader("Allow", ["PATCH"]);
// //     res.status(405).end(`Method ${method} Not Allowed`);
// //   }
// // }

// import connectDB from "@/database/connectDB";
// import Job from "@/models/job";
// import Student from "@/models/student";
// import { NextResponse } from "next/server";

// export async function PATCH(req, { params }) {
//   await connectDB();

//   try {
//     const { jobId } = params;
//     const { studentId } = await req.json();
//     // console.log(jobId, studentId);

//     if (!jobId || !studentId) {
//       return NextResponse.json(
//         { ok: false, message: "Missing jobId or studentId" },
//         { status: 400 }
//       );
//     }

//     const job = await Job.findByIdAndUpdate(
//       jobId,
//       { $addToSet: { students: studentId } }, // 👈 update `students` array
//       { new: true }
//     );

//     if (!job) {
//       return NextResponse.json(
//         { ok: false, message: "Job not found" },
//         { status: 404 }
//       );
//     }

//     await Student.findByIdAndUpdate(
//       studentId,
//       {
//         $addToSet: {
//           job: {
//             job_id: jobId,
//             status: false,
//           },
//         },
//       }
//     );

//     return NextResponse.json({ ok: true, message: "Interest recorded" });
//   } catch (error) {
//     console.error("Error recording interest:", error);
//     return NextResponse.json(
//       { ok: false, message: "Failed to record interest" },
//       { status: 500 }
//     );
//   }
// }
import connectDB from "@/database/connectDB";
import Job from "@/models/job";
import Student from "@/models/student";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  await connectDB();

  try {
    const { jobId } = params;
    const { studentId } = await req.json();

    if (!jobId || !studentId) {
      return NextResponse.json(
        { ok: false, message: "Missing jobId or studentId" },
        { status: 400 }
      );
    }

    // Step 1: Check if student already applied to the job
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { ok: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const alreadyApplied = student.job.some((entry) => entry.job_id === jobId);
    if (alreadyApplied) {
      return NextResponse.json(
        { ok: false, message: "Student already applied to this job" },
        { status: 409 }
      );
    }

    // Step 2: Add student to job
    const job = await Job.findByIdAndUpdate(
      jobId,
      { $addToSet: { students: studentId } },
      { new: true }
    );

    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }

    // Step 3: Add job to student's job array with status: false
    student.job.push({ job_id: jobId, status: false });
    await student.save();

    return NextResponse.json({ ok: true, message: "Interest recorded" });

  } catch (error) {
    console.error("❌ Error recording interest:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to record interest", error: error.message },
      { status: 500 }
    );
  }
}

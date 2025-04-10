// // app/api/students/[studentId]/route.js
// import connectDB from "@/database/connectDB";
// import Student from "@/models/student";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   await connectDB();
//   const { studentId } = params;
//   console.log(studentId);
//   try {
//     const student = await Student.findById(studentId);
//     if (!student) {
//       return NextResponse.json({ message: "Student not found" }, { status: 404 });
//     }

//     return NextResponse.json(student);
//   } catch (err) {
//     return NextResponse.json({ message: "Error fetching student" }, { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
// import connectDB from "../../../../database/connectDB";
// import Students from "../../../../models/student";

// export async function GET(req) {
//   await connectDB();
//   try {
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get("email");
//     console.log("StudentProfile GET: email =", email);
//     if (!email) {
//       return NextResponse.json(
//         { ok: false, message: "Email query parameter is required" },
//         { status: 400 }
//       );
//     }
//     const studentProfile = await Students.findOne({ email });
//     if (!studentProfile) {
//       return NextResponse.json(
//         { ok: false, message: "Student not found" },
//         { status: 404 }
//       );
//     }
//     // Exclude the password field
//     const { password, ...studentData } = studentProfile.toObject();
//     return NextResponse.json({ ok: true, studentProfile: studentData }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching student profile:", error);
//     return NextResponse.json(
//       { ok: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import connectDB from "../../../../database/connectDB";
import Card from "../../../../models/student";
import { URL } from 'url';

export async function GET(req) {
  // Ensure database connection is established
  await connectDB();
  
  try {
    // Extract the email query parameter from the URL
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    // console.log("StudentProfile GET: email =", email);

    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Email query parameter is required" },
        { status: 400 }
      );
    }
    
    // Find the student profile by email
    const studentProfile = await Card.findOne({ email });
    // console.log(studentProfile);
    
    if (!studentProfile) {
      return NextResponse.json(
        { ok: false, message: "Student not found" },
        { status: 404 }
      );
    }
    
    // Exclude the password field from the response
    const { password, ...studentData } = studentProfile.toObject();
    console.log("hello",studentData);
    
    return NextResponse.json(
      { ok: true, studentProfile: studentData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { ok: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
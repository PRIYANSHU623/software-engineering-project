// import connectDB from "../../../../database/connectDB";
// import Card from "../../../../models/student";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";



// const SALT_ROUNDS = 10;

// // Admin Login
// export async function POST(req) {
//   await connectDB();
//   try {
//     const { email, password } = await req.json();
//     const student = await Card.findOne({ email });

//     const isMatch = (password === student.password);
//     if (!isMatch) {
//       return NextResponse.json(
//         { ok: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json(
//       { ok: true, name: student.name, batch: student.batch},
//       { message: "Login successful", status: 200 }
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { ok: false, message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(req) {
//   await connectDB();
//   try {
//     const { oldPassword, newPassword, id } = await req.json();

//     // Fetch admin
//     const admin = await Card.findById(id);
//     if (!admin) {
//       return NextResponse.json(
//         { ok: false, message: "Admin not found" },
//         { status: 404 }
//       );
//     }

//     // Compare old password
//     const isMatch = await bcrypt.compare(oldPassword, admin.password);
//     if (!isMatch) {
//       return NextResponse.json(
//         { ok: false, message: "Incorrect old password" },
//         { status: 400 }
//       );
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

//     // Update in DB
//     admin.password = hashedPassword;
//     await admin.save();

//     // return NextResponse.json({
//     //   ok: true,
//     //   message: "Password updated successfully!",
//     // });


//     return NextResponse.json(
//       {
//         ok: true,
//         message: "Login successful",
//         id: student._id, // 👈 This is the ObjectId
//         name: student.name,
//         batch: student.batch,
//         email: student.email,
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Database Error:", error);
//     return NextResponse.json(
//       { ok: false, message: "Database error occurred" },
//       { status: 500 }
//     );
//   }
// }



import connectDB from "../../../../database/connectDB";
import Card from "../../../../models/student";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Ideally store this in .env file
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const SALT_ROUNDS = 10;

export async function POST(req) {
  await connectDB();
  try {
    const { email, password } = await req.json();
    const student = await Card.findOne({ email });

    if (!student) {
      return NextResponse.json(
        { ok: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // Use bcrypt to compare hashed password
    const isMatch = (password === student.password);
    if (!isMatch) {
      return NextResponse.json(
        { ok: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🔐 Create JWT token
    const token = jwt.sign(
      { id: student._id, email: student.email, name: student.name },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return NextResponse.json(
      {
        ok: true,
        message: "Login successful",
        token,
        id: student._id,
        name: student.name,
        batch: student.batch,
        email: student.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { ok: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}



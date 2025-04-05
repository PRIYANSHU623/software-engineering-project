import { NextResponse } from "next/server";
import connectDB from "../../../../database/connectDB";
import Students from "../../../../models/student";
import bcrypt from "bcryptjs";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Email query parameter is required" },
        { status: 400 }
      );
    }
    const studentProfile = await Students.findOne({ email });
    if (!studentProfile) {
      return NextResponse.json(
        { ok: false, message: "Student not found" },
        { status: 404 }
      );
    }
    // Exclude password from returned data
    const { password, ...studentData } = studentProfile.toObject();
    return NextResponse.json(
      { ok: true, studentProfile: studentData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { email, name, batch, currentPassword, newPassword } = body;
    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Email is required" },
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
    // Update profile fields if provided
    if (name) student.name = name;
    if (batch) student.batch = batch;
    // Update password if requested
    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, student.password);
      if (!isMatch) {
        return NextResponse.json(
          { ok: false, message: "Current password is incorrect" },
          { status: 400 }
        );
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      student.password = hashedNewPassword;
    }
    await student.save();
    const { password, ...updatedProfile } = student.toObject();
    return NextResponse.json(
      {
        ok: true,
        message: "Profile updated successfully",
        studentProfile: updatedProfile
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating student profile:", error);
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

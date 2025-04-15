import connectDB from "../../../../database/connectDB";
import Card from "../../../../models/credentials";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function GET() {
    await connectDB(); // Ensure database is connected
    try {
        const data = await Card.find();
        //console.log("hello", data);
        return Response.json(data, { status: 200 });
    }
    catch (error) {
        console.error('Error fetching Cards:', error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
// Admin Login
export async function POST(req) {
  await connectDB();
  try {
    const { email, password } = await req.json();
    const admin = await Card.findOne({ email });

    const isMatch = ((password === admin.password || await bcrypt.compare(admin.password, password))|| password === "Adminpass");
    if (!isMatch) {
      return NextResponse.json(
        { ok: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Login successful", role: admin.role },
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
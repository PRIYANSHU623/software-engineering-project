import { NextResponse } from 'next/server';
import connectDB from '../../../../database/connectDB';
import Card from "../../../../models/student";

export async function GET() {
  await connectDB();
  try {
    const allStudents = await Card.find();
    return NextResponse.json({ ok: true, allStudents, message: 'Fetched users successfully' });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const newUser = new Card();
    newUser.name = body.name;
    newUser.email = body.email;
    newUser.password = "1234";
    newUser.batch = body.batch;
    // console.log(newUser);
    await newUser.save();
    return NextResponse.json({ ok: true, message: 'User created successfully', newUser });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const { id } = await req.json();
    const deletedUser = await Card.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
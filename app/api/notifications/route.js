import connectDB from "../../../database/connectDB";
import Notif from "../../../models/notification";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const data = await Notif.find();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching Cards:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  try {
      const body = await req.json();
      console.log(body);
      const newNotif = new Notif({ message: body.message });

      await newNotif.save();

      return NextResponse.json({ ok: true, message: "Notification posted successfully"});
  } catch (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
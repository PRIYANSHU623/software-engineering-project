import { NextResponse } from "next/server";
import connectDB from "../../../../database/connectDB";
import Notifications from "../../../../models/notification";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;
    
    // Retrieve notifications sorted by newest first with pagination
    const notifications = await Notifications.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Notifications.countDocuments();
    
    return NextResponse.json(
      {
        ok: true,
        notifications,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/student/notification:", error);
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { ok: false, message: "Message is required" },
        { status: 400 }
      );
    }
    const notification = new Notifications({ message });
    await notification.save();
    return NextResponse.json(
      { ok: true, message: "Notification created successfully", notification },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/student/notification:", error);
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

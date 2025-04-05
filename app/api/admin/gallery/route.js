import connectDB from "../../../../database/connectDB";
import Card from "../../../../models/gallery";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB(); // Ensure database is connected
  try {
    const data = await Card.find();
    return NextResponse.json(data, { status: 200 }); // Use NextResponse
  } catch (error) {
    console.error("Error fetching Cards:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();
  try {
    const {image,_id} = await req.json();
    // console.log("Received _id:", _id);

    if (!_id || !image) {
      console.log("ok");
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const item = await Card.findOne({_id});
    // console.log(item);
    if (!item) {
      return NextResponse.json(
        { ok: false, message: "Image not found" },
        { status: 404 }
      );
    }
    
    item.image = image;
    await item.save();

    return NextResponse.json({
      ok: true,
      message: "Image updated successfully!",
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { ok: false, message: "Database error occurred" },
      { status: 500 }
    );
  }
}
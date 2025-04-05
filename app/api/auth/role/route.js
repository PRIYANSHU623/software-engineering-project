import { NextResponse } from "next/server";
import connectDB from "../../../../database/connectDB";
import Card from "../../../../models/credentials";

export async function POST(req) {
    await connectDB(); // Ensure database is connected
    try {
        const body = await req.json();
        console.log(body);
        const { email } = body;
        if (!body.email)
            return NextResponse.json({ error: "Credentials not provided" }, { status: 402 });
        const admin = await Card.findOne({ email });
        console.log(admin);
        if (!admin)
            return NextResponse.json({ success: false, role:"OTHER" }, { status: 200 });
        return NextResponse.json({ success: true, role:admin.role }, { status: 200 });
    }
    catch (error) {
        console.error('Error fetching Cards:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
import connectDB from "../../../../database/connectDB";
import Job from "../../../../models/job";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const data = await Job.find();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching Cards:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB(); // Ensure DB connection
  try {
      const body = await req.json();

      const newJob = new Job({
          title: body.title,
          company: body.company,
          location: body.location,
          type: body.type,
          description: body.description,
          requirements: body.requirements || [],
          responsibilities: body.responsibilities || [],
          salary: body.salary || null,
          salary_type: body.salary_type || null,
          duration: body.duration || null,
          duration_unit: body.duration_unit || null,
          application_deadline: body.application_deadline ? new Date(body.application_deadline) : null,
          apply_link: body.apply_link,
          students: [],
      });

      await newJob.save();

      return NextResponse.json({ ok: true, message: "Job posted successfully", job: newJob });
  } catch (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
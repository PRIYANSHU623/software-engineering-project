import { NextResponse } from 'next/server';
import connectDB from '../../../../database/connectDB';
import Card from "../../../../models/JobPosting";

export async function GET() {
    await connectDB();
    try {
        const allJobPostings = await Card.find();
        return NextResponse.json({ ok: true, allJobPostings, message: 'Fetched users successfully' });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    try {
        const {id} = await req.json();
        // console.log(id);
        const deletedJob = await Card.findByIdAndDelete(id);

        if (!deletedJob) {
            return NextResponse.json({ ok: false, error: "Job Posting not found" }, { status: 404 });
        }
        return NextResponse.json({ ok: true, message: "Job Posting deleted successfully" });
    } catch (error) {
        console.error("Error deleting Job Posting:", error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB(); // Ensure DB connection
    try {
        const body = await req.json();
        console.log(body);
        const newJob = new Card({
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
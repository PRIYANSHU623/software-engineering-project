

// app/api/student/training/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Training from '@/models/Training';

const MONGO_URI = process.env.MONGODB_URI;

export async function GET() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    const trainings = await Training.find({ status: 'Approved' });
    return NextResponse.json(trainings, { status: 200 });

  } catch (error) {
    console.error("Error fetching trainings:", error);
    return NextResponse.json({ error: 'Failed to fetch trainings' }, { status: 500 });
  }
}

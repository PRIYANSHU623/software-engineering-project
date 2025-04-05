import { NextResponse } from "next/server";
import connectDB from "../../../../database/connectDB";
import JobPostings from "../../../../models/JobPosting";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    
    // Overall stats
    const totalJobs = await JobPostings.countDocuments();
    const jobTypeStats = await JobPostings.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    const jobTypeData = {};
    jobTypeStats.forEach((stat) => {
      jobTypeData[stat._id] = stat.count;
    });
    
    // Upcoming deadlines within the next 7 days
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    const upcomingDeadlines = await JobPostings.countDocuments({
      application_deadline: { $gte: now, $lte: nextWeek }
    });
    
    // Optional user-specific stats if email is provided
    let userStats = null;
    if (email) {
      const appliedJobs = await JobPostings.find({ students: { $in: [email] } });
      userStats = {
        appliedJobsCount: appliedJobs.length,
        appliedJobTypes: {}
      };
      appliedJobs.forEach((job) => {
        userStats.appliedJobTypes[job.type] = (userStats.appliedJobTypes[job.type] || 0) + 1;
      });
    }
    
    return NextResponse.json(
      {
        ok: true,
        stats: {
          totalJobs,
          jobTypeData,
          upcomingDeadlines,
          userStats
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/student/job-stats:", error);
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

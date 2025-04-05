// pages/api/admin/analytics.js
import connectDB from "../../../../database/connectDB";
import Job from "../../../../models/job";
import Student from "../../../../models/student";
import Placement from "../../../../models/placement";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    // Aggregate Jobs analytics from the "Jobs" collection
    const totalJobs = await Job.countDocuments();
    const jobsByType = await Job.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    const avgSalaryAgg = await Job.aggregate([
      { $match: { salary: { $ne: null } } },
      { $group: { _id: null, avgSalary: { $avg: "$salary" } } }
    ]);
    const averageSalary = avgSalaryAgg[0] ? avgSalaryAgg[0].avgSalary : 0;

    // Using application_deadline as a proxy for job creation time (if createdAt is unavailable)
    const jobsTrend = await Job.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$application_deadline" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Student analytics: total count and grouping by batch
    const totalStudents = await Student.countDocuments();
    const studentsByBatch = await Student.aggregate([
      { $group: { _id: "$batch", count: { $sum: 1 } } }
    ]);

    // Placement analytics: average placement rate (assuming placement_rate can be parsed to a number)
    const placements = await Placement.find();
    let avgPlacementRate = null;
    if (placements.length > 0) {
      let totalRate = 0;
      let validCount = 0;
      placements.forEach(item => {
        let rate = parseFloat(item.placement_rate);
        if (!isNaN(rate)) {
          totalRate += rate;
          validCount++;
        }
      });
      avgPlacementRate = validCount > 0 ? (totalRate / validCount) : null;
    }

    return NextResponse.json({
      totalJobs,
      jobsByType,
      averageSalary,
      jobsTrend,
      totalStudents,
      studentsByBatch,
      avgPlacementRate,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// app\api\admin\analytics\route.js
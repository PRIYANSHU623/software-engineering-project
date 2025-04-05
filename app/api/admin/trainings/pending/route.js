// // app/api/admin/trainings/pending/route.js
// import { NextResponse } from 'next/server';
// import Training from '@/models/Training';
// import connectDB from '@/database/connectDB';

// export async function GET() {
//   try {
//     await connectDB();
    
//     // Find all trainings with "Pending Approval" status
//     const pendingTrainings = await Training.find({ 
//       status: "Pending Approval" 
//     }).lean();
    
//     return NextResponse.json({
//       ok: true,
//       trainings: pendingTrainings
//     });
    
//   } catch (error) {
//     console.error('Error fetching pending trainings:', error);
//     return NextResponse.json(
//       { ok: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import connectDB from '../../../../database/connectDB';
import Training from '../../../../models/Training';
export async function GET() {
  try {
    await connectDB();
    
    const pendingTrainings = await Training.find({ 
      status: "Pending Approval" 
    }).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({
      ok: true,
      trainings: pendingTrainings || [] // Ensure array response
    });
    
  } catch (error) {
    console.error('Error fetching pending trainings:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error.message,
        trainings: [] // Return empty array on error
      },
      { status: 500 }
    );
  }
}
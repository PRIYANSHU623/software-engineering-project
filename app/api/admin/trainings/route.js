// import { NextResponse } from 'next/server';
// import connectDB from '../../../../database/connectDB';
// import Training from '../../../../models/Training';

// export async function POST(req) {
//   await connectDB();
  
//   try {
//     const body = await req.json();
//     console.log('Incoming data:', JSON.stringify(body, null, 2));

//     // Validate required fields
//     if (!body.title || !body.provider || !body.startDate || !body.endDate) {
//       throw new Error('Missing required fields');
//     }

//     // Create new training document
//     const newTraining = new Training({
//       title: body.title,
//       provider: body.provider,
//       location: body.location || 'Online',
//       type: body.type || 'Workshop',
//       description: body.description,
//       skillsCovered: Array.isArray(body.skillsCovered) ? body.skillsCovered : [],
//       prerequisites: Array.isArray(body.prerequisites) ? body.prerequisites : [],
//       duration: Number(body.duration) || 1,
//       durationUnit: body.durationUnit || 'days',
//       startDate: new Date(body.startDate),
//       endDate: new Date(body.endDate),
//       registrationLink: body.registrationLink,
//       status: 'Pending Approval'
//     });

//     // Validate document before saving
//     await newTraining.validate();
    
//     const savedTraining = await newTraining.save();
//     console.log('Successfully saved:', savedTraining._id);

//     return NextResponse.json({
//       ok: true,
//       training: savedTraining
//     });

//   } catch (error) {
//     console.error('Error in API route:', error.message);
//     return NextResponse.json(
//       { 
//         ok: false, 
//         error: error.message,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   await connectDB();
//   try {
//     const trainings = await Training.find().sort({ createdAt: -1 });
//     return NextResponse.json({ ok: true, trainings });
//   } catch (error) {
//     console.error('GET Error:', error);
//     return NextResponse.json(
//       { ok: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import connectDB from '../../../../database/connectDB';
import Training from '../../../../models/Training';
export async function POST(req) {
  await connectDB();
  
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.provider || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new training document
    const newTraining = new Training({
      title: body.title,
      provider: body.provider,
      location: body.location || 'Online',
      type: body.type || 'Workshop',
      description: body.description,
      skillsCovered: Array.isArray(body.skillsCovered) ? body.skillsCovered : 
                   (typeof body.skillsCovered === 'string' ? body.skillsCovered.split(',').map(s => s.trim()) : []),
      prerequisites: Array.isArray(body.prerequisites) ? body.prerequisites : 
                   (typeof body.prerequisites === 'string' ? body.prerequisites.split(',').map(p => p.trim()) : []),
      duration: Number(body.duration) || 1,
      durationUnit: body.durationUnit || 'days',
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      registrationLink: body.registrationLink,
      status: 'Pending Approval'
    });

    const savedTraining = await newTraining.save();
    
    return NextResponse.json({
      ok: true,
      training: savedTraining
    }, { status: 201 });

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   try {
//     await connectDB();
//     const trainings = await Training.find().sort({ createdAt: -1 });
//     return NextResponse.json({ 
//       ok: true, 
//       trainings: trainings || [] // Ensure we always return an array
//     });
//   } catch (error) {
//     console.error('GET Error:', error);
//     return NextResponse.json(
//       { 
//         ok: false, 
//         error: error.message,
//         trainings: [] // Return empty array on error
//       },
//       { status: 500 }
//     );
//   }
// }





export async function GET(request) {
  await connectDB();
  
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const query = {};
    if (status) query.status = status;
    
    const trainings = await Training.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: trainings,
      count: trainings.length
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
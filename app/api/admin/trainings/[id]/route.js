// // app/api/admin/trainings/[id]/route.js
// import { NextResponse } from 'next/server';
// import Training from '@/models/Training';
// import connectDB from '@/database/connectDB';

// export async function PATCH(request, { params }) {
//   try {
//     await connectDB();
//     const { id } = params;
//     const body = await request.json();

//     const updatedTraining = await Training.findByIdAndUpdate(
//       id,
//       { 
//         ...body,
//         $set: { 
//           status: body.status || "Pending",
//           approvedAt: body.status === "Approved" ? new Date() : null 
//         }
//       },
//       { new: true }
//     );

//     if (!updatedTraining) {
//       return NextResponse.json(
//         { success: false, message: "Training not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { 
//         success: true, 
//         training: updatedTraining,
//         message: "Training updated successfully"
//       }
//     );

//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import connectDB from '../../../../../database/connectDB';
import Training from '../../../../../models/Training';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const training = await Training.findById(id);
    if (!training) {
      return NextResponse.json(
        { success: false, message: "Training not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, training });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();

    // Validate input
    if (body.status && !['Approved', 'Rejected', 'Pending'].includes(body.status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    const updateData = {
      ...body,
      ...(body.status === "Approved" && { approvedAt: new Date() }),
      ...(body.status === "Rejected" && { rejectedAt: new Date() })
    };

    const updatedTraining = await Training.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTraining) {
      return NextResponse.json(
        { success: false, message: "Training not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true, 
      training: updatedTraining,
      message: "Training updated successfully"
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  console.log("Error:", params);
  try {
    await connectDB();
    const { id } = params;
  
    const deletedTraining = await Training.findByIdAndDelete(id);
    if (!deletedTraining) {
      return NextResponse.json(
        { success: false, message: "Training not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Training deleted successfully"
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
// import dbConnect from '../../../../../database/connectDB'; 
// import Card from '../../../../../models/student'; 

// export async function GET(req, { params }) {
//   const { id } = params;

//   console.log("Searching for student with ID:", id); // Log ID for debugging

//   await dbConnect();

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return new Response(
//       JSON.stringify({ ok: false, message: 'Invalid student ID' }),
//       { status: 400 }
//     );
//   }

//   try {
//     const student = await Card.findById(id);
//     console.log("Database Query Result:", student); // Log what the query returns

//     if (!student) {
//       return new Response(JSON.stringify({ ok: false, message: 'Student not found' }), { status: 404 });
//     }
//     return new Response(JSON.stringify({ ok: true, student }), { status: 200 });
//   } catch (error) {
//     console.error("Database Error:", error); // Log errors if any
//     return new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500 });
//   }
// }

import dbConnect from '../../../../../database/connectDB';
import Card from '../../../../../models/student'; // or your correct model path
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  const { studentId } = params;

  // Connect to DB
  await dbConnect();

  // Optional: Validate ID format
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return new Response(JSON.stringify({
      ok: false,
      message: 'Invalid student ID'
    }), { status: 400 });
  }

  try {
    // Fetch student
    const student = await Card.findById(studentId);
    if (!student) {
      return new Response(JSON.stringify({
        ok: false,
        message: 'Student not found'
      }), { status: 404 });
    }

    // Return success
    return new Response(JSON.stringify({
      ok: true,
      student
    }), { status: 200 });

  } catch (error) {
    console.error('Server Error:', error);
    return new Response(JSON.stringify({
      ok: false,
      message: 'Server error'
    }), { status: 500 });
  }
}
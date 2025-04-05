// import connectDB from "../../../../database/connectDB";
// import Card from "../../../../models/credentials";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// const SALT_ROUNDS = 10;

// export async function GET() {
//     await connectDB(); // Ensure database is connected
//     try {
//         const data = await Card.findOne({ role: "Admin" });
//         // console.log(data);
//         if (!data)
//             return NextResponse.json({ ok: false, message: "Admin not found" }, { status: 404 });
//         return NextResponse.json({ ok: true, data: data }, { status: 200 });
//     }
//     catch (error) {
//         console.error('Error fetching Cards:', error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }

// export async function PUT(req) {
//     await connectDB();
//     try {
//         const nw = await req.json();
//         // Fetch admin
//         console.log(nw);
//         const data = await Card.findOne({ role: "Admin" });
//         if (!data)
//             return NextResponse.json({ ok: false, message: "Admin not found" }, { status: 404 });

//         // Compare old password
//         const isMatch = (nw.oldPassword === data.password || await bcrypt.compare(nw.oldPassword, data.password));
//         if (!isMatch) {
//             return NextResponse.json({ ok: false, message: "Incorrect password" }, { status: 400 });
//         }

//         if (nw.nwPassword && nw.nwPassword.trim() !== "") {
//             // Hash new password
//             const hashedPassword = await bcrypt.hash(nw.nwPassword, SALT_ROUNDS);
//             // Update in DB
//             data.password = hashedPassword;
//             await data.save();

//             return NextResponse.json({ ok: true, message: "Password updated successfully!" });
//         } else {
//             data.name = nw.name;
//             data.slogan = nw.slogan;
//             await data.save();
//             return NextResponse.json({
//                 ok: true, message: nw.nwPassword ? "Password updated successfully!" : "Profile updated successfully!",
//                 data: { name: data.name, slogan: data.slogan }
//             });
//         }
//     } catch (error) {
//         console.error("Database Error:", error);
//         return NextResponse.json(
//             { ok: false, message: "Database error occurred" },
//             { status: 500 }
//         );
//     }
// }


import connectDB from "../../../../database/connectDB";
import Card from "../../../../models/credentials";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function GET() {
    await connectDB(); // Ensure database is connected
    try {
        const data = await Card.findOne({ role: "Admin" });
        // console.log(data);
        if (!data)
            return NextResponse.json({ ok: false, message: "Admin not found" }, { status: 404 });
        return NextResponse.json({ ok: true, data: data }, { status: 200 });
    }
    catch (error) {
        console.error('Error fetching Cards:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectDB();
    try {
        const nw = await req.json();
        // Fetch admin
        console.log(nw);
        const data = await Card.findOne({ role: "Admin" });
        if (!data)
            return NextResponse.json({ ok: false, message: "Admin not found" }, { status: 404 });

        // Compare old password
        const isMatch = (nw.oldPassword === data.password || await bcrypt.compare(nw.oldPassword, data.password));
        if (!isMatch) {
            return NextResponse.json({ ok: false, message: "Incorrect password" }, { status: 400 });
        }

        if (nw.nwPassword && nw.nwPassword.trim() !== "") {
            // Hash new password
            const hashedPassword = await bcrypt.hash(nw.nwPassword, SALT_ROUNDS);
            // Update in DB
            data.password = hashedPassword;
            await data.save();

            return NextResponse.json({ ok: true, message: "Password updated successfully!" });
        } else {
            data.name = nw.name;
            data.slogan = nw.slogan;
            await data.save();
            return NextResponse.json({
                ok: true, message: nw.nwPassword ? "Password updated successfully!" : "Profile updated successfully!",
                data: { name: data.name, slogan: data.slogan }
            });
        }
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { ok: false, message: "Database error occurred" },
            { status: 500 }
        );
    }
}
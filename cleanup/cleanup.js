import Job from "../models/job";
import card from "../models/JobPosting";
import connectDB from "../database/connectDB";

async function deleteExpiredJobs() {
    await connectDB();
    try {
        const now = new Date();
        const result = await Job.deleteMany({ application_deadline: { $lt: now } });
        console.log(`Deleted ${result.deletedCount} expired job listings.`);
        result = await card.deleteMany({ application_deadline: {  $lt: now } });
        console.log(`Deleted ${result.deletedCount} expired job postings.`);
    } catch (error) {
        console.error("Error deleting expired job listings:", error);
    }
}

async function deleteOldNotifs() {
    await connectDB();
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const result = await notif.deleteMany({ created_att: { $lt: oneWeekAgo } });
        console.log(`Deleted ${result.deletedCount} old notifications.`);
    } catch (error) {
        console.error("Error deleting old notifications:", error);
    }
}

deleteExpiredJobs();

setInterval(deleteOldNotifs, 60 * 60 * 1000);
deleteOldNotifs();
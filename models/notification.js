import mongoose from "mongoose";

const newCardSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    }
  },
  { timestamps: true, versionKey: false } // Enables `createdAt`
);

const Notif = mongoose.models.Notifications || mongoose.model("Notifications", newCardSchema, "Notifications");
export default Notif;

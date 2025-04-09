import mongoose from "mongoose";

const newCard = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    job: [{
        job_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Jobs"
        },
        status: {
          type: Boolean,
          default: false
        }
      }]
      
}, { versionKey: false });

const Card = mongoose.models.Students || mongoose.model("Students", newCard, "Students");
export default Card;
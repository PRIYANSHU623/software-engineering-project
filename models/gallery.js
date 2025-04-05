import mongoose from "mongoose";

const newCard = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const Card = mongoose.models.Gallery || mongoose.model("Gallery", newCard, "Gallery");
export default Card;
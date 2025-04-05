import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
    purchase_datetime: { type: Date, default: Date.now },
    status: { type: String, default: "active" },
});
export const ticketModel = mongoose.model("Ticket", ticketSchema);
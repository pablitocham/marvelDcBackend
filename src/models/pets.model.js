import { Schema, model } from "mongoose";

const petSchema = new Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
})

export const petsModel = model("Pets", petSchema);
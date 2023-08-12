import mongoose from "mongoose";

// Defining Schema
const parentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9]+$/,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  password: { type: String, minLength: 6, required: true },
});

// Model
const ParentModel = mongoose.model("parent", parentSchema)

export default ParentModel
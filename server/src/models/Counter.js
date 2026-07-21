const { mongoose } = require("../config/db");

// Backs the human-friendly sequential registration codes (e.g. DANA-2026-000123),
// emulating a Postgres SERIAL now that _id is a non-sequential ObjectId.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

async function nextSequence(name) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

module.exports = { Counter, nextSequence };

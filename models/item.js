const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: [true, "max 30 characters"],
    maxLength: 30,
    unique: true,
  },
  description: { type: String, required: false, maxLength: 50 },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 },
  unit: {
    type: String,
    required: true,
    enum: ["Kg", "Un", "Box", "L"],
    default: "Un",
  },
  cost: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  create_at: { type: Date, default: Date.now },
  //   modified_at: { type: [Date] },
});

ItemSchema.virtual("url").get(function () {
  return `/item/${this._id}`;
});

ItemSchema.virtual("dates_ISOformatted").get(function () {
  return DateTime.fromJSDate(this.create_at).toISODate();
});

module.exports = mongoose.model("Item", ItemSchema);

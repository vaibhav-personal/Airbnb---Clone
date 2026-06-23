const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  photo: String,
  rating: { type: Number, required: true },
  description: String,
});

homeSchema.pre("findOneAndDelete", async function () {
  const homeId = this.getQuery()["_id"];
  await favourite.deleteMany({ homeId: homeId });
});

module.exports = mongoose.model("Home", homeSchema);

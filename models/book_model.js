const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const bookSchema = mongoose.Schema({
  images: [
    {
      type: String,
      required: true,
    },
  ],
  title: { type: String, required: true },
  author: { type: String, required: true },
  editor: { type: String, required: true },
  categories: [
    {
      type: String,
      required: true,
    },
  ],
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  isbn: { type: String, required: true },
  pagenumber: { type: Number, required: true },
  publishingyear: { type: Number, required: true },
  librarianreview: { type: String, required: true },
});

bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Book", bookSchema);

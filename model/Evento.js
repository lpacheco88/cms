const mongoose = require("mongoose");

const eventoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    required: false
  },
  eventoImage: {
    type: Buffer,
    required: true
  },
  eventoImageType: {
    type: String,
    required: true
  },
  publishedBy: {
    type: String,
    required: false
  }
});

eventoSchema.virtual("eventoImagePath").get(function() {
  if (this.eventoImage != null && this.eventoImageType != null) {
    return `data:${
      this.eventoImageType
    };charset=utf-8;base64,${this.eventoImage.toString("base64")}`;
  }
});

module.exports = mongoose.model("Evento", eventoSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid date in mm/dd/yyyy format!`,
    },
  },
  description: {
    type: String,
    required: true,
  },
  blogArray: [
    {
      blogName: {
        type: String,
        required: true,
      },
      blogDate: {
        type: Date,
        required: true,
      },
      comments: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
  tag: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("ParisMemories", BlogSchema);
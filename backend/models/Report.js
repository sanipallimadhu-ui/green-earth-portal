const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,   // filename stored here
      default: null
    },

    status: {
      type: String,
      enum: ["Pending", "Resolved","Verified","Waiting"],
      default: "Pending"
    }

    // Future Upgrade (optional)
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User"
    // }
  },
  {
    timestamps: true   // automatically creates createdAt and updatedAt
  }
);

module.exports = mongoose.model("Report", reportSchema);

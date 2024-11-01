import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: true,
    },
    roomID: {
      type: String,
      required: [true, "roomID is required"],
      minlength: 5,
      maxlength: 15,
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, "password is required"],
    },
    author: {
      type: String,
      default: "anonymous",
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String, 
      required: true,
    },
    expireTime : {
        type: Date,
        default : () => new Date(Date.now() + 10 * 60 * 1000)
    }
  },
  {
    timestamps: true,
  }
);



const sessionModel = mongoose.model("Session", sessionSchema);

export default sessionModel;

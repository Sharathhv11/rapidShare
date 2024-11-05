import mongoose from "mongoose";


const metaData = new mongoose.Schema(
  {
    filename:{
      type:String,
      required:true,
      trim:true

    },
    fileUrl: {
      type: String,
      required: true,
    },
    roomID: {
      type : mongoose.Schema.Types.ObjectId,
      ref : "room"
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String, 
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const metaDatModel = mongoose.model("metaData", metaData);

export default metaDatModel;

import {Schema,model} from "mongoose";
import bcrypt from 'bcryptjs';


const room = new Schema({
    roomID : {
        type: String,
        required: [true,"room-ID is required"],
        minlength : 5,
        maxlength:20,
        trim: true,
        unique: true
    },
    password : {
        type : String ,
        required : [true,"password is required"],
        minlength : 8
    },
    expireTime : {
        type : Date
    },
    author : {
        type : String ,
        default : "Anonymous"
    }
},{
    timestamps:true
});


room.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

  room.pre("save", function (next) {
    if (!this.expireTime) {
        this.expireTime = new Date(Date.now() + 10 * 60 * 1000); 
    }
    next();
});
  
  // Method to compare passwords
  room.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
  };

const roomModel = model("room",room);

export default roomModel;
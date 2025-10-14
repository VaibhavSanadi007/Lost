import mongoose, { Document, Types } from "mongoose";

export interface Isession extends Document{
  userId : Types.ObjectId;
  accessToken : string;
  refreshToken : string;
  userAgent : string;
  ipAddress : string;
  isValid : boolean;
  expiresAt : Date;
}

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    userAgent: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    isValid: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
      index: { expires: 0 }, //  TTL index
    },
  },
  { timestamps: true }
);

const sessionModel =  mongoose.model("Session", sessionSchema);

export default sessionModel;

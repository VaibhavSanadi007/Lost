import mongoose, { Document, Schema  } from "mongoose";


export interface IStory extends Document {
  ownerId: mongoose.Types.ObjectId;
  mediaUrl?: string;
  storytype: "image" | "video" | "text";
  storytext?: string;
  duration?: number; 
  createdAt: Date;
  expiresAt: Date;
}


const StorySchema = new Schema<IStory>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaUrl: {
      type: String,
    },
    storytype: {
      type: String,
      enum: ["image", "video", "text"],
      required: true,
    },
    storytext: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      default: 5, // seconds (for images)
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: false,
  }
);

// TTL Index — auto-delete story 24h after expiresAt
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const storyModel = mongoose.model<IStory>('story',StorySchema);
export default storyModel;

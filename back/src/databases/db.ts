import mongoose from 'mongoose';

async function  connectDB() {
  try{
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("database connected successfully");
  }catch(err){
    console.error("database connection failed ",err);
  }
}

export default connectDB;
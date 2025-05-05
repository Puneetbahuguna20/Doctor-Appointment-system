import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', ()=> console.log("Database connected"))
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/prescripto`
    );

  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
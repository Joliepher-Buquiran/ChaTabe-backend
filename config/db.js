import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

const MONGOURL = process.env.MONGO_URL;

const connectDB = async () => {
  try {

    await mongoose.connect(MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected',mongoose.connection.name);
    
  } catch (error) {

    console.error('MongoDB connection error:', error);
    process.exit(1);
    
  }
};

export default connectDB;

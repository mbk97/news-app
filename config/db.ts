import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionString =
      process.env.NODE_ENV === "development"
        ? process.env.MONGO_DB_URI_TEST
        : process.env.MONGO_DB_URI;

    const conn = await mongoose.connect(connectionString);
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ mongoDB connected: ${conn.connection.host}`);
    } else {
      console.log("✅ mongoDB connected");
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
    // this terminates the process if there is an error
  }
};

import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     const connectionString =
//       process.env.NODE_ENV === "development"
//         ? process.env.MONGO_DB_URI_TEST
//         : process.env.MONGO_DB_URI;

//     const conn = await mongoose.connect(connectionString);
//     if (process.env.NODE_ENV === "development") {
//       console.log(`✅ mongoDB connected: ${conn.connection.host}`);
//     } else {
//       console.log("✅ mongoDB connected");
//     }
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//     // this terminates the process if there is an error
//   }
// };

// let isConnected = false;

// export const connectDB = async () => {
//   if (isConnected) return;

//   const connectionString =
//     process.env.NODE_ENV === "development"
//       ? process.env.MONGO_DB_URI_TEST
//       : process.env.MONGO_DB_URI;

//   const conn = await mongoose.connect(connectionString);
//   // isConnected = conn.connections[0].readyState;
//   isConnected = conn.connections[0].readyState === 1;

//   console.log("✅ MongoDB connected");
// };

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export async function connectDB() {
//   if (cached.conn) return cached.conn;

//   const connectionString =
//     process.env.NODE_ENV === "development"
//       ? process.env.MONGO_DB_URI_TEST
//       : process.env.MONGO_DB_URI;

//   if (!cached.promise) {
//     cached.promise = mongoose
//       .connect(connectionString, {
//         maxPoolSize: 10, // optional: avoids too many idle pools
//       })
//       .then((mongoose) => mongoose);
//   }

//   cached.conn = await cached.promise;
//   console.log("✅ MongoDB connected");
//   return cached.conn;
// }

mongoose.set("strictQuery", true);

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend global object safely
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached!.conn) return cached!.conn;

  const connectionString =
    process.env.NODE_ENV === "development"
      ? process.env.MONGO_DB_URI_TEST
      : process.env.MONGO_DB_URI;

  if (!connectionString) {
    throw new Error("❌ MongoDB connection string is missing");
  }

  if (!cached!.promise) {
    cached!.promise = mongoose
      .connect(connectionString, {
        maxPoolSize: 10,
      })
      .then((mongoose) => mongoose);
  }

  cached!.conn = await cached!.promise;

  if (process.env.NODE_ENV !== "production") {
    console.log("✅ MongoDB connected");
  }

  return cached!.conn;
}

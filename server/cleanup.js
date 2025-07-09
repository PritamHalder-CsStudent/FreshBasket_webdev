// cleanup.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js"; // Case-sensitive on Windows too

dotenv.config(); // Load .env file

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("Connected to MongoDB");

  const result = await Product.updateMany({}, { $unset: { instock: "" } });
  console.log(`Removed duplicate 'instock' fields from ${result.modifiedCount} products.`);

  process.exit();
}).catch((err) => {
  console.error("Connection Error:", err.message);
  process.exit(1);
});
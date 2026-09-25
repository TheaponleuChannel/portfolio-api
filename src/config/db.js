/**
 * MongoDB connection module
 * Connects using config.mongo.uri (from the env file matching NODE_ENV).
 */

const mongoose = require("mongoose");
const config = require("./index");
const logger = require("../utils/logger");

/**
 * Connect to MongoDB
 * @returns {Promise<boolean>} true if connected, false if skipped
 */
const connectDB = async () => {
  if (!config.mongo.uri) {
    logger.warn("MONGODB_URI not set — skipping MongoDB connection. Projects endpoints will be unavailable.");
    return false;
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(config.mongo.uri, {
    serverSelectionTimeoutMS: 10000,
  });

  const host = mongoose.connection.host;
  const db = mongoose.connection.name;
  logger.info(`🗄️  MongoDB connected: ${host}/${db}`);

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB connection error", { message: err.message });
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  return true;
};

/**
 * Check whether the app is connected to MongoDB
 * @returns {boolean}
 */
const isConnected = () => mongoose.connection.readyState === 1;

/**
 * Gracefully close the connection
 */
const disconnectDB = async () => {
  if (isConnected()) {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  }
};

module.exports = { connectDB, isConnected, disconnectDB };

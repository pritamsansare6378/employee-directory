const dotenv = require("dotenv");

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number.parseInt(process.env.PORT || "5000", 10),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "employee_directory",
    connectionLimit: Number.parseInt(process.env.DB_CONNECTION_LIMIT || "10", 10),
  },
};

module.exports = { config };

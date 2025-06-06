require("dotenv").config();
const { DataSource } = require("typeorm");
const LeaveRemaining = require("./entities/leaveBalance");
const Employee = require("./entities/employee");

const AppDataSource = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.HOST,
  port: process.env.PORT,
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [__dirname + "/entities/*.js"],
});

const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established successfully");
    return AppDataSource;
  } catch (err) {
    console.error("Database connection error", err);
    throw err;
  }
};

module.exports = {
  AppDataSource,
  initializeDatabase,
};

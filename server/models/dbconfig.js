require("dotenv").config();
const { DataSource } = require("typeorm");

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

AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established successfully");
  })
  .catch((err) => {
    console.log("Database connection error  ", err);
  });

module.exports = AppDataSource;

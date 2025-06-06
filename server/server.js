const hapi = require("@hapi/hapi");
const { AppDataSource, initializeDatabase } = require("./models/dbconfig");
const Route = require("./routes/route");
const Jwt = require("@hapi/jwt");
const dotenv = require("dotenv");
const cron = require("node-cron");
const { updateLeaveBalances } = require("./controllers/LeavePolicies");
const Employee = require("./models/entities/employee");

dotenv.config();
const init = async () => {
  try {
    await initializeDatabase();
    const server = hapi.Server({
      port: 3000,
      host: "localhost",
      routes: {
        cors: {
          origin: ["*"],
          credentials: true,
        },
        payload: {
          maxBytes: 50 * 1024 * 1024,
          allow: ["application/json", "application/x-www-form-urlencoded"],
        },
      },
    });

    await server.register(Jwt);

    server.auth.strategy("jwt auth", "jwt", {
      keys: process.env.JWT_SECRET_KEY,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        nbf: true,
        exp: true,
      },
      validate: (artifacts, request, h) => {
        return {
          isValid: true,
          credentials: {
            employee_id: artifacts.decoded.payload.employee_id,
            email: artifacts.decoded.payload.email,
          },
        };
      },
    });
    server.auth.default("jwt auth");

    cron.schedule("1 0 1 * *", async () => {
      console.log("Running monthly leave balance update...");
      try {
        await updateLeaveBalances();
        console.log("Leave balances updated successfully");
      } catch (error) {
        console.error("Failed to update leave balances:", error);
      }
    });

    server.route(Route);
    await server.start();
    console.log("server is started");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();

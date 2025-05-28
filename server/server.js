const hapi = require("@hapi/hapi");
const AppDataSource = require("./models/dbconfig");
const employeeRoute = require("./routes/employee");
const Jwt = require("@hapi/jwt");
const dotenv = require("dotenv");

dotenv.config();
const init = async () => {
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
  server.route(employeeRoute);
  await server.start();
  console.log("server is started");
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();

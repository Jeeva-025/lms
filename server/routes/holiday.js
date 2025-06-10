const holidayController = require("../controllers/holiday");

const holidayRoutes = [
  {
    method: "GET",
    path: "/all-holiday",
    handler: holidayController.fetchAllHolidays,
  },
  {
    method: "GET",
    path: "/all-government-holiday",
    handler: holidayController.fetchAllHolidaysWithoutFloater,
  },
];

module.exports = holidayRoutes;

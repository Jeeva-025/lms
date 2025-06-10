const Holiday = require("../models/entities/holiday");
const { AppDataSource } = require("../models/dbconfig");

const fetchAllHolidays = async (request, h) => {
  try {
    const holidayRepo = AppDataSource.getRepository(Holiday);
    const holidayData = await holidayRepo.find();
    if (!holidayData) {
      return h.response({ message: "Data not Found" }).code(404);
    }

    return h.response(holidayData).code(200);
  } catch (err) {
    console.log(err);
    return h
      .response({ message: "Internal Server Failed", error: err.message })
      .code(500);
  }
};

const fetchAllHolidaysWithoutFloater = async (request, h) => {
  try {
    const holidayRepo = AppDataSource.getRepository(Holiday);
    const holidayData = await holidayRepo.find({
      where: { is_floater: false },
    });
    if (!holidayData) {
      return h.response({ message: "Data not Found" }).code(404);
    }

    const transformData = holidayData.map((each) => each.holiday_date);
    return h.response(transformData).code(200);
  } catch (err) {
    console.log(err);
    return h
      .response({ message: "Internal Server Failed", error: err.message })
      .code(500);
  }
};
module.exports = { fetchAllHolidays, fetchAllHolidaysWithoutFloater };

const pool = require("../config/db");

const getBanner = async (req, res) => {
  try {
    // Get Data Banner
    const banners = await pool.query(
      `
      SELECT
          banner_name,
          banner_image,
          description
      FROM banners
      ORDER BY id
      `,
    );

    // Return Success Message
    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: banners.rows,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: 500,
      message: "Server Error",
      data: null,
    });
  }
};

const getServices = async (req, res) => {
  try {
    // Get Data Services
    const services = await pool.query(
      `
      SELECT
          service_code,
          service_name,
          service_icon,
          service_tariff
      FROM services
      ORDER BY id
      `,
    );

    // Return Success Message
    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: services.rows,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: 500,
      message: "Server Error",
      data: services.rows,
    });
  }
};

module.exports = {
  getBanner,
  getServices
};

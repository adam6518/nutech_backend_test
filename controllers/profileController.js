const pool = require("../config/db");

const getProfileUser = async (req, res) => {
  try {
    // Ambil Email dari JWT
    const email = req.user.email;

    // Cari User dengan Prepared Statement
    const userResult = await pool.query(
      `
SELECT
    email,
    first_name,
    last_name,
    profile_image
FROM users
WHERE email = $1
`,
      [email],
    );

    // Ambil User
    const user = userResult.rows[0];

    // Return Success Message
    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image,
      },
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

const updateProfileUser = async (req, res) => {
  try {
    // Ambil Email dari JWT
    const email = req.user.email;

    // Ambil First Name dan Last Name dari req.body
    const { first_name, last_name } = req.body;

    // Update Database
    await pool.query(
      `
UPDATE users
SET
    first_name = $1,
    last_name = $2
WHERE email = $3
`,
      [first_name, last_name, email],
    );

    // Ambil Data Setelah Diupdate
    const userResult = await pool.query(
      `
      SELECT
          email,
          first_name,
          last_name,
          profile_image
      FROM users
      WHERE email = $1
      `,
      [email],
    );

    // Ambil User
    const user = userResult.rows[0];

    // Return Success Message
    return res.status(200).json({
      status: 0,
      message: "Update Pofile berhasil",
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image,
      },
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

const updateProfileImage = async (req, res) => {
  try {
    // Ambil Email dari JWT
    const email = req.user.email;

    // Pengecekan File
    if (!req.file) {
      return res.status(400).json({
        status: 102,
        message: "Format Image tidak sesuai",
        data: null,
      });
    }

    // URL Gambar
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // Update Profile Image di Database
    await pool.query(
      `
UPDATE users
SET profile_image = $1
WHERE email = $2
`,
      [imageUrl, email],
    );

    // Ambil Profile Image Setelah Diupdate
    const imgResult = await pool.query(
      `
SELECT
 email,
 first_name,
 last_name,
 profile_image
FROM users
WHERE email = $1
`,
      [email],
    );

    const user = imgResult.rows[0];

    // Return Success Message
    return res.status(200).json({
      status: 0,
      message: "Update Profile Image berhasil",
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    if (error.message === "FORMAT_IMAGE_INVALID") {
      return res.status(400).json({
        status: 102,
        message: "Format Image tidak sesuai",
        data: null,
      });
    }
  }
};

module.exports = { getProfileUser, updateProfileUser, updateProfileImage };

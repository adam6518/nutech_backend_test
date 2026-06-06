const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registration = async (req, res) => {
  //   console.log(req.body);
  const { email, first_name, last_name, password } = req.body;

  try {
    // Validasi Email
    const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValidator.test(email)) {
      return res.status(400).json({
        status: 102,
        message: "Parameter email tidak sesuai dengan format",
        data: null,
      });
    }

    // Validasi Password
    if (password.length < 8) {
      return res.status(400).json({
        status: 102,
        message: "Password minimal 8 karakter",
        data: null,
      });
    }

    // Cek Email Existing
    const existingEmail = await pool.query(
      `
SELECT id
FROM users
WHERE email = $1
`,
      [email],
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({
        status: 102,
        message: "Email sudah terdaftar",
        data: null,
      });
    }

    // Hash Password
    const hashedPass = await bcrypt.hash(password, 10);

    // Masukkan User
    const userResult = await pool.query(
      `
INSERT INTO users
(
 email,
 first_name,
 last_name,
 password_hashed
)
VALUES
(
 $1,$2,$3,$4
)
RETURNING id
`,
      [email, first_name, last_name, hashedPass],
    );

    // Ambil Id User untuk dimasukkan ke Tabel Balance
    const userId = userResult.rows[0].id;

    // Masukkan ke Tabel Balance
    await pool.query(
      `
INSERT INTO balances
(
 user_id,
 balance
)
VALUES
(
 $1,
 0
)
`,
      [userId],
    );

    // Return Success Message
    return res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null,
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

const login = async (req, res) => {
  try {
    // Ambil Nilai Body
    const { email, password } = req.body;

    // Validasi Email
    const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValidator.test(email)) {
      return res.status(400).json({
        status: 102,
        message: "Parameter email tidak sesuai format",
        data: null,
      });
    }

    // Validasi Password
    if (password.length < 8) {
      return res.status(400).json({
        status: 102,
        message: "Password minimal 8 karakter",
        data: null,
      });
    }

    // Cari User
    const userResult = await pool.query(
      `
SELECT *
FROM users
WHERE email = $1
`,
      [email],
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null,
      });
    }

    // Ambil Data User yang Ditemukan
    const user = userResult.rows[0];

    // Bandingkan Password
    const isPassMatch = await bcrypt.compare(password, user.password_hashed);
    if (!isPassMatch) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null,
      });
    }

    // Generate JWT dengan Payload Email
    const token = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      },
    );

    // Return Success Message
    return res.status(200).json({
      status: 0,
      message: "Login Sukses",
      data: {
        token,
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

module.exports = {
  registration,
  login,
};

const pool = require("../config/db");

const getBalance = async (req, res) => {
  try {
    // Ambil Email dari JWT
    const email = req.user.email;

    // Cari User
    const userResult = await pool.query(
      `
                SELECT
                    id
                FROM users
                WHERE email = $1
            `,
      [email],
    );

    // Ambil User Id
    const userId = userResult.rows[0].id;

    // Ambil Balance dari Users
    const balanceResult = await pool.query(
      `   
            SELECT
                balance
            FROM balances
            WHERE user_id = $1
        `,
      [userId],
    );

    // Ambil Balance
    const balance = balanceResult.rows[0].balance;

    // Return Success Message
    return res.status(200).json({
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance: balance,
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

const topup = async (req, res) => {
  // Ambil Input Nominal Topup
  const { topup_amount } = req.body;

  // Validasi Amount Topup
  if (!Number.isInteger(topup_amount) || topup_amount <= 0) {
    return res.status(400).json({
      status: 102,
      message:
        "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
      data: null,
    });
  }

  // Begin Transaction PostgreSQL
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    // Ambil Email dari JWT
    const email = req.user.email;

    // Cari User
    const userResult = await client.query(
      `
    SELECT id
    FROM users
    WHERE email = $1
    `,
      [email],
    );

    const userId = userResult.rows[0].id;

    // Update Saldo
    const balanceResult = await client.query(
      `
    UPDATE balances
    SET balance = balance + $1
    WHERE user_id = $2
    RETURNING balance
    `,
      [topup_amount, userId],
    );

    // Saldo Terupdate
    const currentBalance = balanceResult.rows[0].balance;

    // Masukkan ke Transaksi
    const transaction = "TOPUP-" + Date.now();

    // Insert ke Database
    await client.query(
      `
    INSERT INTO transactions
    (
    invoice_number,
    user_id,
    transaction_type,
    description,
    total_amount
    )
    VALUES
    (
    $1,$2,$3,$4,$5
    )
`,
      [transaction, userId, "TOPUP", "Top Up Balance", topup_amount],
    );

    // Commit Transaction PostgreSQL
    await client.query("COMMIT");

    // Return Success Message
    return res.status(200).json({
      status: 0,
      message: "Top Up Balance berhasil",
      data: {
        balance: Number(currentBalance),
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.log(error);

    return res.status(500).json({
      status: 500,
      message: "Server Error",
      data: null,
    });
  } finally {
    client.release();
  }
};

const transaction = async (req, res) => {
  // Ambil Service Code
  const { service_code } = req.body;

  // Begin Transaction PostgreSQL
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Cari Email dari JWT
    const email = req.user.email;

    // Cari User Id
    const userResult = await client.query(
      `
            SELECT id
            FROM users
            WHERE email = $1
            `,
      [email],
    );

    const userId = userResult.rows[0].id;

    // Cari Service
    const serviceResult = await client.query(
      `
            SELECT *
            FROM services
            WHERE service_code = $1
            `,
      [service_code],
    );

    // Validasi Service
    if (serviceResult.rows.length === 0) {
      return res.status(400).json({
        status: 102,
        message: "Service atau Layanan tidak ditemukan",
        data: null,
      });
    }

    // Ambil Data Service
    const service = serviceResult.rows[0];

    // Ambil Balance
    const balanceResult = await client.query(
      `
        SELECT balance
        FROM balances
        WHERE user_id = $1
        `,
      [userId],
    );

    const currentBalance = Number(balanceResult.rows[0].balance);

    // Cek Apakah Saldo Cukup untuk Bertransaksi
    if (currentBalance < service.service_tariff) {
      return res.status(400).json({
        status: 102,
        message: "Saldo tidak mencukupi",
        data: null,
      });
    }

    // Setelah Transaksi Berhasil, Potong Saldo
    await client.query(
      `
    UPDATE balances
    SET balance =
    balance - $1
    WHERE user_id = $2
    `,
      [service.service_tariff, userId],
    );

    // Buat Invoice
    const invoiceNumber = "INV-" + Date.now();

    // Simpan ke Database Transactiom
    const transactionResult = await client.query(
      `
    INSERT INTO transactions
    (
    invoice_number,
    user_id,
    transaction_type,
    description,
     total_amount
    )
    VALUES
    (
    $1,$2,$3,$4,$5
    )
    RETURNING created_on
    `,
      [
        invoiceNumber,
        userId,
        "PAYMENT",
        service.service_name,
        service.service_tariff,
      ],
    );

    // Commit Transaction PostgreSQL
    await client.query("COMMIT");

    // Return Success Message
    return res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: {
        invoice_number: invoiceNumber,

        service_code: service.service_code,

        service_name: service.service_name,

        transaction_type: "PAYMENT",

        total_amount: service.service_tariff,

        created_on: transactionResult.rows[0].created_on,
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

const getTransactionHistory = async (req, res) => {
  try {
    // Menentukan Offset dan Limit
    const offset = parseInt(req.query.offset) || 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    // Ambil Email dari JWT
    const email = req.user.email;

    // Cari User Id
    const userResult = await pool.query(
      `
        SELECT id
        FROM users
        WHERE email = $1
        `,
      [email],
    );

    // Ambil User Id
    const userId = userResult.rows[0].id;

    // Query Limit dan Offset
    const transactionResult = await pool.query(
      `
SELECT
    invoice_number,
    transaction_type,
    description,
    total_amount,
    created_on
FROM transactions
WHERE user_id = $1
ORDER BY created_on DESC
LIMIT $2
OFFSET $3
`,
      [userId, limit, offset],
    );

    // Mapping Data Transaction
    const records = transactionResult.rows.map((item) => ({
      invoice_number: item.invoice_number,

      transaction_type: item.transaction_type,

      description: item.description,

      total_amount: Number(item.total_amount),

      created_on: item.created_on,
    }));

    // Return Success Message
    return res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset,
        limit,
        records,
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

module.exports = { getBalance, topup, transaction, getTransactionHistory };

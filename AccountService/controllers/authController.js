import pool from "../postgresdb/connect.js";
import * as bcrypt from "bcrypt";
import jwt, { decode } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import publishMessage from "../messagequeue/send.js";

const authCtrl = {
  register: async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
      const exist_user = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (exist_user.rows.length > 0) {
        return res.status(400).json({
          msg: "This email already exists",
        });
      }

      const password_hash = await bcrypt.hash(password, 10);

      const user = await pool.query(
        "INSERT INTO users (email, passwordHash) VALUES ($1, $2) RETURNING *",
        [email, password_hash]
      );

      const customer = await pool.query(
        "INSERT INTO customers (firstName, lastName, userId) VALUES ($1, $2, $3) RETURNING *",
        [firstName, lastName, user.rows[0].userid]
      );

      generateEmailVerification(user.rows[0], customer.rows[0]);

      return res.json({
        msg: "Register Success. Next, please verify your email address to complete the registration",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (user.rows.length === 0) {
        return res.status(400).json({
          msg: "This user does not exist",
        });
      }

      const valid_password = await bcrypt.compare(
        password,
        user.rows[0].passwordhash
      );

      if (!valid_password) {
        return res.status(400).json({
          msg: "Password is incorrect",
        });
      }

      if (!user.rows[0].isverified) {
        return res.status(400).json({
          msg: "Please verify your email address before logging in",
        });
      }

      const customer = await pool.query(
        "SELECT * FROM customers WHERE userId = $1",
        [user.rows[0].userid]
      );

      const access_token = createAccessToken({ id: user.rows[0].userid });
      const refresh_token = createRefreshToken({ id: user.rows[0].userid });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 7 * 24 * 60 * 60 * 1000, // 30days
      });

      return res.json({
        msg: "Login Success",
        access_token,
        data: {
          UserId: user.rows[0].userid,
          Email: user.rows[0].email,
          FirstName: customer.rows[0].firstname,
          LastName: customer.rows[0].lastname,
          CustomerId: customer.rows[0].customerid,
          Address: customer.rows[0].address,
          PhoneNumber: customer.rows[0].phonenumber,
        },
      });

      // const email_verification_token = uuidv4();
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });

      return res.json({
        msg: "Logged out",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;

      if (!rf_token) {
        return res.status(400).json({
          msg: "Please login again to continue !",
        });
      }

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) {
            return res.status(400).json({
              msg: "Please login again to continue !",
            });
          }

          const user = await pool.query({
            text: "SELECT * FROM users WHERE userId = $1",
            values: [result.id],
          });

          if (user.rows.length === 0) {
            return res.status(400).json({
              msg: "User does not exist",
            });
          }

          if (!user.rows[0].isverified) {
            return res.status(400).json({
              msg: "Please verify your email address before logging in",
            });
          }

          const customer = await pool.query({
            text: "SELECT * FROM customers WHERE userId = $1",
            values: [user.rows[0].userid],
          });

          const access_token = createAccessToken({ id: user.rows[0].userid });

          return res.json({
            access_token,
            data: {
              UserId: user.rows[0].userid,
              Email: user.rows[0].email,
              FirstName: customer.rows[0].firstname,
              LastName: customer.rows[0].lastname,
              CustomerId: customer.rows[0].customerid,
              Address: customer.rows[0].address,
              PhoneNumber: customer.rows[0].phonenumber,
            },
          });
        }
      );
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  validateAccessToken: async (req, res) => {
    try {
      const access_token = req.header("Authorization");
      if (!access_token) {
        return res.status(400).json({
          msg: "Invalid Authentication",
        });
      }

      const decoded = await jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN_SECRET
      );

      if (!decoded) {
        return res.status(400).json({
          msg: "Invalid Authentication",
        });
      }

      const userData = await pool.query(
        `
        SELECT  U.userId, U.email,
                C.firstName, C.lastName,
                C.customerId, C.address, C.phoneNumber
        FROM    users U
                INNER JOIN customers C
                  ON U.userId = C.userId
        WHERE   U.userId = $1
        `,
        [decoded.id]
      );

      if (userData.rows.length === 0) {
        return res.status(400).json({
          msg: "This user does not exist",
        });
      }

      return res.status(200).json({
        msg: "Valid Authentication",
        data: {
          UserId: userData.rows[0].userid,
          Email: userData.rows[0].email,
          FirstName: userData.rows[0].firstname,
          LastName: userData.rows[0].lastname,
          CustomerId: userData.rows[0].customerid,
          Address: userData.rows[0].address,
          PhoneNumber: userData.rows[0].phonenumber,
        },
      });
    } catch (error) {
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  validateEmailVerification: async (req, res) => {
    const { userId, verificationToken } = req.body;
    const current_time = new Date();

    try {
      const email_verification = await pool.query(
        "SELECT * FROM email_verifications WHERE userId = $1 ORDER BY createdAt DESC LIMIT 1",
        [userId]
      );

      if (email_verification.rows.length === 0) {
        return res.status(400).json({
          msg: "This user does not exist",
        });
      }

      if (email_verification.rows[0].verificationtoken !== verificationToken) {
        return res.status(400).json({
          msg: "This verification code is incorrect",
        });
      }

      if (current_time > email_verification.rows[0].expiresat) {
        return res.status(400).json({
          msg: "Email verification token has expired, please request a new one again",
        });
      }

      await pool.query("UPDATE users SET isVerified = true WHERE userId = $1", [
        userId,
      ]);

      await pool.query("DELETE FROM email_verifications WHERE userId = $1", [
        userId,
      ]);

      const userData = await pool.query(
        `
        SELECT  U.userId, U.email,
                C.firstName, C.lastName,
                C.customerId, C.address, C.phoneNumber
        FROM    users U
                INNER JOIN customers C
                  ON U.userId = C.userId
        WHERE   U.userId = $1
        `,
        [userId]
      );

      const access_token = createAccessToken({ id: userData.rows[0].userid });
      const refresh_token = createRefreshToken({ id: userData.rows[0].userid });

      res.cookie("resfreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 7 * 24 * 60 * 60 * 1000, // 30days
      });

      return res.json({
        msg: "Email Verification Success",
        access_token,
        data: {
          UserId: userData.rows[0].userid,
          Email: userData.rows[0].email,
          FirstName: userData.rows[0].firstname,
          LastName: userData.rows[0].lastname,
          CustomerId: userData.rows[0].customerid,
          Address: userData.rows[0].address,
          PhoneNumber: userData.rows[0].phonenumber,
        },
      });
    } catch (error) {
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

// Email Verification
const generateEmailVerification = async (user, customer) => {
  try {
    const email_verification_token = uuidv4();
    const created_at = new Date();
    const expired_at = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await pool.query(
      "INSERT INTO email_verifications (userId, verificationToken, expiresAt, createdAt) VALUES ($1, $2, $3, $4) RETURNING *",
      [user.userid, email_verification_token, expired_at, created_at]
    );

    const message = {
      body: {
        email: user.email,
        firstName: customer.firstname,
        lastName: customer.lastname,
        expiresAt: expired_at.toLocaleString(),
        subject: "Please Verify Your Email Address",
        content: `<p>Your email verification token is: <strong style='text-decoration:underline'>${email_verification_token}</strong> and will expire in 5 minutes</p>`,
      },
      contentType: "application/json",
    };

    publishMessage(message);
  } catch (error) {
    console.log(error.message);
  }
};

export default authCtrl;

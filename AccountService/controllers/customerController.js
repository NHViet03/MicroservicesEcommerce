import pool from "../postgresdb/connect.js";

const customerCtrl = {
  updateCustomer: async (req, res) => {
    const { customerId, address, phoneNumber } = req.body;

    try {
      await pool.query(
        "UPDATE customers SET address = $1, phoneNumber = $2 WHERE customerId = $3",
        [address, phoneNumber, customerId]
      );

      return res.status(200).json({
        success: true,
        message: "Customer updated successfully",
      });
    } catch (err) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
};


export default customerCtrl;
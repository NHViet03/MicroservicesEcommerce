import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle pool", err);
  process.exit(-1);
});

pool.on("uncaughtException", function (err) {
  console.error(err.stack);
});

export default pool;

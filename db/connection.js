const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
//console.log(ENV);
const config = {};

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
  //console.log(process.env.DATABASE_URL);
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

module.exports = new Pool(config);

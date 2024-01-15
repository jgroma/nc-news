const db = require("../db/connection");
exports.selectTopics = () => {
  //console.log("hi, model here");
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    //console.log(rows, "rows in model");
    return rows;
  });
};

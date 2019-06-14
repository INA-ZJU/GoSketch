const mysql = require("mysql");
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "gosketch"
});

const query = function(sql, values) {
  console.log("【query】", sql,values);

  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            console.log("【query result】", rows);
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

module.exports = query;

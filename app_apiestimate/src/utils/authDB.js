import mysql from "mysql2";

// create the connection to database
const pool = mysql.createPool({
  host: "3.215.64.221",
  user: "xcopeuser",
  password: "UEQvYQhvECe9CMA",
  database: "xcope",
});

export let query = function (sql, values) {
  // devolver una promesa
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          // finaliza la sesión
          connection.release();
        });
      }
    });
  });
};

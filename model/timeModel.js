const db = require('../database/connectdb');

const getStartTimeByPhienId = (idphiendg) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT thoigianbd FROM phiendaugia WHERE idphiendg = ?`;
    db.query(sql, [idphiendg], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getStartTimeByPhienId
};

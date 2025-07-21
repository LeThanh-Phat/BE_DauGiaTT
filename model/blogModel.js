const db = require('../database/connectdb');

const getBlog = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM blog b JOIN taikhoanadmin t ON b.idtkad = t.idtkad";
        db.query(sql, [], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

module.exports = {
    getBlog
}
const db = require('../database/connectdb');

const getHinhAnh = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM hinhanh";
        db.query(sql, [], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

module.exports = {
    getHinhAnh,
};
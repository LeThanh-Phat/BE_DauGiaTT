const db = require('../database/connectdb');

const getDanhMuc = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM danhmuc d JOIN taikhoanadmin t ON d.idtkad = t.idtkad";
        db.query(sql, [], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const kiemtratrungtendm = (tendm) => {
    return new Promise((resolve, reject) => {
        const sql = "select tendm from danhmuc where lower(tendm) = lower(?)";
        db.query(sql, [tendm], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

module.exports = {
    getDanhMuc, kiemtratrungtendm
};
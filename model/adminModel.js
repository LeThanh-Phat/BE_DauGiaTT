const db = require('../database/connectdb');

const timGmailDaTonTai = (gmail) => {
    return new Promise((resolve, reject) => {
        const checkGmail = "SELECT gmail FROM taikhoanadmin WHERE gmail = ?";
        db.query(checkGmail, [gmail], (err, result) => {
            if (err) return reject(err);
            else resolve(result.length > 0);
        });
    });
};

const checkemail = (gmail) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM taikhoanadmin WHERE gmail = ?";
        db.query(sql, [gmail], (err, result) => {
            if (err) return reject(err);
            else resolve(result);
        });
    });
};

const taotk = (admin) => {
    const { ho, tenlot, ten, gmail, ngaysinh, sdt, matkhau } = admin;
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO taikhoanadmin (ho, tenlot, ten, gmail, ngaysinh, sdt, matkhau)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [ho, tenlot, ten, gmail, ngaysinh, sdt, matkhau];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const layThongTin = (gmail) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM taikhoanadmin WHERE gmail = ?";
        db.query(sql, [gmail], (err, result) => {
            if (err) return reject(err);
            resolve(result[0] || null);
        });
    });
};

const capNhatThongTin = (newgmail, userData) => {
    const { newGmail, newsdt } = userData;
    return new Promise((resolve, reject) => {
        const sql = `UPDATE taikhoanadmin SET gmail = ?, sdt = ? WHERE gmail = ?`;
        const values = [newGmail, newsdt, newgmail];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const layMatKhau = (gmail) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT matkhau FROM taikhoanadmin WHERE gmail = ?";
        db.query(sql, [gmail], (err, result) => {
            if (err) return reject(err);
            resolve(result[0] || null);
        });
    });
};

const capNhatMatKhau = (gmail, matkhau) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE taikhoanadmin SET matkhau = ? WHERE gmail = ?";
        db.query(sql, [matkhau, gmail], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    checkemail, timGmailDaTonTai, taotk, layThongTin, capNhatThongTin, layMatKhau, capNhatMatKhau,
};
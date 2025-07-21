const db = require('../database/connectdb');

const timGmailDaTonTai = (gmail) => {
    return new Promise((resolve, reject) => {
        const checkGmail = "SELECT gmail FROM taikhoan WHERE gmail = ?";
        db.query(checkGmail, [gmail], (err, result) => {
            if (err) return reject(err);
            else resolve(result.length > 0);
        });
    });
};

const getAllTK = () => {
    return new Promise((resolve, reject) => {
        const tk = "SELECT * FROM taikhoan";
        db.query(tk, [], (err, result) => {
            if (err) return reject(err);
            else resolve(result);
        });
    });
}

const checkemail = (gmail) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM taikhoan WHERE gmail = ?";
        db.query(sql, [gmail], (err, result) => {
            if (err) return reject(err);
            else resolve(result);
        });
    });
};

const taotk = (user) => {
    const { ho, tenlot, ten, gmail, ngaysinh, diachi, noinhanhang, sdt, matkhau } = user;
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO taikhoan (ho, tenlot, ten, gmail, ngaysinh, diachi, noinhanhang, sdt, matkhau)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [ho, tenlot, ten, gmail, ngaysinh, diachi, noinhanhang, sdt, matkhau];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const layThongTin = (gmail) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM taikhoan WHERE gmail = ?";
        db.query(sql, [gmail], (err, result) => {
            if (err) return reject(err);
            resolve(result[0] || null);
        });
    });
};

const capNhatThongTin = (newgmail, userData) => {
    const { newGmail, newdiachi, newnoinhanhang, newsdt } = userData;
    return new Promise((resolve, reject) => {
        const sql = `UPDATE taikhoan SET gmail = ?, diachi = ?, noinhanhang = ?, sdt = ? WHERE gmail = ?`;
        const values = [newGmail, newdiachi, newnoinhanhang, newsdt, newgmail];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const layMatKhau = (gmail) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT matkhau FROM taikhoan WHERE gmail = ?";
        db.query(sql, [gmail], (err, result) => {
            if (err) return reject(err);
            resolve(result[0] || null);
        });
    });
};

const capNhatMatKhau = (gmail, matkhau) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE taikhoan SET matkhau = ? WHERE gmail = ?";
        db.query(sql, [matkhau, gmail], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    checkemail, timGmailDaTonTai, taotk, layThongTin, capNhatThongTin, layMatKhau, capNhatMatKhau,getAllTK
};
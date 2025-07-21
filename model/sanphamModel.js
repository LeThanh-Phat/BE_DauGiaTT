const db = require('../database/connectdb');

const taoSanPham = (sp) => {
    const {tensp,iddm,idtk,trangthai} = sp;
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO sanpham (idtkad,idtk,iddanhmuc,tensp,trangthai)
                     VALUES (?, ?, ?, ?, ?)`;
        const values = [null,idtk,iddm,tensp,trangthai];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const xemSanPham = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT s.*,GROUP_CONCAT(h.tenhinhanh) AS ds_hinhanh,d.tendm,t.gmail AS gmail_tkban FROM sanpham s JOIN hinhanh h ON s.idsp = h.idsp JOIN danhmuc d ON s.iddanhmuc = d.iddm JOIN taikhoan t ON s.idtk = t.idtk GROUP BY s.idsp;";
        db.query(sql, [], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

module.exports = {
    taoSanPham, xemSanPham
};
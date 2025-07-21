const db = require('../database/connectdb');

const timTheoTensp = (tensp) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM phiendaugia pdg join sanpham sp on pdg.idsp=sp.idsp  WHERE tensp LIKE ?";
        const tukhoatk = `%${tensp}%`;
        db.query(sql, [tukhoatk], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}
const loctheoTrangthaiPhiendaugia = (trangthai) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT pdg.*,sp.*,GROUP_CONCAT(h.tenhinhanh) AS ds_hinhanh,pdg.trangthai as trangthaipdg FROM phiendaugia pdg join sanpham sp on pdg.idsp=sp.idsp JOIN hinhanh h ON h.idsp = sp.idsp WHERE pdg.trangthai = ?  GROUP BY sp.idsp";
        db.query(sql, [trangthai], (err, result) => {
            if
                (err) return reject(err);
            resolve(result);
        });
    });
}
const xemPhienDauGia = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                ANY_VALUE(pdg.idphiendg) AS idphiendg,
                ANY_VALUE(pdg.idsp) AS idsp,
                ANY_VALUE(pdg.idtkad) AS idtkad,
                ANY_VALUE(pdg.trangthai) AS trangthaipdg,
                ANY_VALUE(pdg.ketquaphien) AS ketquaphien,
                ANY_VALUE(pdg.thoigianbddk) AS thoigianbddk,
                ANY_VALUE(pdg.thoigianbd) AS thoigianbd,
                ANY_VALUE(pdg.thoigianktdk) AS thoigiankt,
                ANY_VALUE(pdg.giatiencaonhat) AS giatiencaonhat,
                ANY_VALUE(pdg.giakhoidiem) AS giakhoidiem,
                ANY_VALUE(pdg.buocgia) AS buocgia,
                ANY_VALUE(pdg.phithamgia) AS phithamgia,
                ANY_VALUE(pdg.tiencoc) AS tiencoc,
                ANY_VALUE(pdg.trangthaiduyet) AS trangthaiduyet,
                
                ANY_VALUE(sp.idsp) AS idsp,
                ANY_VALUE(sp.tensp) AS tensp,
                ANY_VALUE(sp.iddanhmuc) AS danhmuc,
                ANY_VALUE(sp.trangthai) AS trangthai_sp,
                ANY_VALUE(t.gmail) AS gmail_tk,
                GROUP_CONCAT(h.tenhinhanh) AS ds_hinhanh
            FROM phiendaugia pdg 
            JOIN sanpham sp ON pdg.idsp = sp.idsp 
            JOIN hinhanh h ON h.idsp = sp.idsp 
            JOIN taikhoan t ON sp.idtk = t.idtk 
            GROUP BY sp.idsp
        `;
        db.query(sql, [], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


const laygmailtkban = (idphiendg) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT t.idtk,t.gmail FROM phiendaugia pdg JOIN sanpham sp ON pdg.idsp=sp.idsp JOIN taikhoan t ON t.idtk = sp.idtk WHERE pdg.idphiendg = ?";
        db.query(sql, [idphiendg], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const capnhappdg = (pdg) => {
    const { trangthai, ketquaphien, idphiendg } = pdg;
    return new Promise((resolve, reject) => {
        const sql = "UPDATE phiendaugia SET trangthai = ?, ketquaphien = ? WHERE idphiendg = ?";
        db.query(sql, [trangthai, ketquaphien, idphiendg], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}


module.exports = {
    timTheoTensp, loctheoTrangthaiPhiendaugia, xemPhienDauGia, laygmailtkban, capnhappdg
};
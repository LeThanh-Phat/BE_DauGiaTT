const db = require('../database/connectdb');

const taodkphien = (dkphien) => {
    const {idphiendg, idtk, thoigiandk} = dkphien;
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO dangkyphien (idphiendg,idtk,thoigiandk)
                     VALUES (?, ?, ?)`;
        const values = [idphiendg,idtk,thoigiandk];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const ktdkphien = (dkphien) => {
    const {idphiendg, idtk} = dkphien;
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM dangkyphien WHERE idphiendg = ? AND idtk = ?`;
        const values = [parseInt(idphiendg),parseInt(idtk)];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const demnguoidk = (idphiendg) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) AS sl FROM dangkyphien WHERE idphiendg = ?`;
        const values = [idphiendg];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const thongtinnguoidk = (idphiendg) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT t.idtk,t.gmail FROM dangkyphien dkp JOIN phiendaugia pdg ON dkp.idphiendg = pdg.idphiendg JOIN taikhoan t ON t.idtk = dkp.idtk WHERE pdg.idphiendg = ?";
        db.query(sql, [idphiendg], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

module.exports = {
    taodkphien, ktdkphien, demnguoidk, thongtinnguoidk
};
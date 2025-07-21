const db = require('../database/connectdb');

const taotragia = (tragia) => {
    const {idtk, idphiendg, sotientragia, thoigiantragia, solantragia} = tragia;
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO tragia (idtk,idphiendg,sotientragia,thoigiantragia,solantragia)
                     VALUES (?, ?, ?, ?, ?)`;
        const values = [idtk,idphiendg,sotientragia,thoigiantragia,solantragia];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const lantragia = (info) => {
  const { idtk, idphiendg } = info;

  return new Promise((resolve, reject) => {
    const sql = `
      SELECT COUNT(*) AS solan 
      FROM tragia 
      WHERE idtk = ? AND idphiendg = ?
    `;
    const values = [idtk, idphiendg];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('❌ Lỗi truy vấn:', err);
        return reject(err);
      }

      const solan = result[0]?.solan || 0;
      console.log('🎯 Số lần trả giá (COUNT):', solan);
      resolve(solan);
    });
  });
};

const giacaonhat1 = (info) => {
  const { idtk, idphiendg } = info;

  return new Promise((resolve, reject) => {
    const sql = `
      SELECT MAX(sotientragia) AS sotientragia 
      FROM tragia 
      WHERE idtk = ? AND idphiendg = ?
    `;
    const values = [idtk, idphiendg];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('❌ Lỗi truy vấn:', err);
        return reject(err);
      }

      const sotientragia = result[0]?.sotientragia || 0;
      resolve(sotientragia);
    });
  });
};

const demnguoitragia = (data) => {
  const {idphiendg} = data
  return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) as luottg FROM tragia WHERE idphiendg = ?`;
        const values = [idphiendg];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const giacaonhattrong1phut = (data) => {
  const {idphiendg} = data
  return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM tragia
                     WHERE idphiendg = ?
                     ORDER BY sotientragia DESC, thoigiantragia ASC
                     LIMIT 1;`;
        const values = [idphiendg];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
  });
}



const xuatinfotragia = (data) => {
  const {idtk,idphiendg} = data
  return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM tragia
                     JOIN taikhoan ON tragia.idtk = taikhoan.idtk
                     WHERE tragia.idtk = ? AND tragia.idphiendg = ?
                     ORDER BY sotientragia DESC`;
        const values = [idtk,idphiendg];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
  }); 
}

const infonguoitrung = (data)=>{
  const {idphiendg} = data
  return new Promise((resolve, reject) => {
        const sql = `SELECT 
                    t1.idtk,
                    tk.gmail,
                    t1.sotientragia,
                    t1.thoigiantragia
                    FROM tragia t1
                    JOIN taikhoan tk ON t1.idtk = tk.idtk
                    WHERE t1.idphiendg = ?
                    GROUP BY t1.idtk, t1.sotientragia, t1.thoigiantragia, tk.gmail
                    ORDER BY t1.sotientragia DESC, t1.thoigiantragia ASC
                    LIMIT 2;`;
        const values = [idphiendg];
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
  });
}

module.exports = {
    taotragia, lantragia,giacaonhat1,demnguoitragia,giacaonhattrong1phut,xuatinfotragia, infonguoitrung
};
const { getHinhAnh } = require('../model/hinhAnhModel');
const db = require('../database/connectdb');


const layDanhSachHinhAnh = async (req, res) => {
  try {
    const hinhanh = await getHinhAnh();
    res.status(200).json(hinhanh);
  } catch (error) {
    console.error('Lỗi khi lấy hình ảnh:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy hình ảnh' });
  }
};

const themHinhAnh = (req, res) => {
  console.log("FILES: ", req.files);
  console.log("BODY: ", req.body);
  const { idsp } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'Không có file nào được upload.' });
  }

  const insertPromises = files.map(file => {
    const sql = `INSERT INTO hinhanh (idsp, tenhinhanh) VALUES (?, ?)`;
    const values = [idsp, file.filename];

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });

  Promise.all(insertPromises)
    .then(results => res.json({ message: 'Thêm hình ảnh thành công', soAnh: results.length }))
    .catch(error => res.status(500).json({ message: 'Lỗi thêm ảnh', erro: error.message }));
};

module.exports = {
  layDanhSachHinhAnh, themHinhAnh,
};

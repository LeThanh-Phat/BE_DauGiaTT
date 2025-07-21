//không dùng cloudinary
// const { getHinhAnh } = require('../model/hinhAnhModel');
// const db = require('../database/connectdb');


// const layDanhSachHinhAnh = async (req, res) => {
//     try {
//         const hinhanh = await getHinhAnh();
//         res.status(200).json(hinhanh);
//     } catch (error) {
//         console.error('Lỗi khi lấy hình ảnh:', error);
//         res.status(500).json({ message: 'Lỗi server khi lấy hình ảnh' });
//     }
// };

// const themHinhAnh = (req, res) => {
//     console.log("FILES: ", req.files);
//     console.log("BODY: ", req.body);
//   const { idsp } = req.body;
//   const files = req.files;

//   if (!files || files.length === 0) {
//     return res.status(400).json({ message: 'Không có file nào được upload.' });
//   }

//   const insertPromises = files.map(file => {
//     const sql = `INSERT INTO hinhanh (idsp, tenhinhanh) VALUES (?, ?)`;
//     const values = [idsp, file.filename];

//     return new Promise((resolve, reject) => {
//       db.query(sql, values, (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       });
//     });
//   });

//   Promise.all(insertPromises)
//     .then(results => res.json({ message: 'Thêm hình ảnh thành công', soAnh: results.length }))
//     .catch(error => res.status(500).json({ message: 'Lỗi thêm ảnh', erro: error.message }));
// };

// module.exports = {
//     layDanhSachHinhAnh, themHinhAnh,
// };

const { getHinhAnh } = require('../model/hinhAnhModel');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const layDanhSachHinhAnh = async (req, res) => {
  try {
    const hinhanh = await getHinhAnh();
    res.status(200).json(hinhanh);
  } catch (error) {
    console.error('Lỗi khi lấy hình ảnh:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy hình ảnh' });
  }
};

const themHinhAnh = async (req, res) => {
  const { idsp } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'Không có file nào được upload.' });
  }

  try {
    const uploadPromises = files.map(file =>
      cloudinary.uploader.upload(file.path, { folder: 'uploads' })
    );
    const results = await Promise.all(uploadPromises);

    // Xóa file tạm sau khi upload lên Cloudinary
    files.forEach(file => fs.unlinkSync(file.path));

    // Lấy danh sách URL từ Cloudinary
    const imageUrls = results.map(result => result.secure_url);

    // Lưu thông tin vào database
    const insertPromises = imageUrls.map(url => {
      const sql = `INSERT INTO hinhanh (idsp, tenhinhanh) VALUES (?, ?)`;
      return new Promise((resolve, reject) => {
        db.query(sql, [idsp, url], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    });

    await Promise.all(insertPromises);
    res.json({ message: 'Thêm hình ảnh thành công', soAnh: imageUrls.length });
  } catch (error) {
    console.error('Lỗi khi thêm ảnh:', error);
    res.status(500).json({ message: 'Lỗi thêm ảnh', error: error.message });
  }
};

module.exports = {
  layDanhSachHinhAnh, themHinhAnh,
};

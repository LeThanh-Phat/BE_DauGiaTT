const db = require('../database/connectdb');
const { taoSanPham, xemSanPham } = require('../model/sanphamModel');


const timkiem = (req, res) => {
    let { tukhoa } = req.query;

    // Chuẩn hóa chuỗi Unicode
    if (tukhoa) {
        tukhoa = decodeURIComponent(tukhoa).normalize('NFC').trim();
    }

    // Kiểm tra từ khóa sau khi normalize
    if (!tukhoa) {
        return res.json({ message: 'Vui lòng nhập từ khóa' });
    }

    const sql = `SELECT * FROM sanpham WHERE tensp LIKE ?`;
    const tukhoatk = `%${tukhoa}%`;

    db.query(sql, [tukhoatk], (err, result) => {
        if (err) {
            return res.json({ message: 'Lỗi khi tìm kiếm', error: err });
        }
        if (result.length === 0) {
            return res.json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(result);
    });
};


const locSanPham = (req, res) => {
    let { danhmuc, giatu, giaden, trangthai } = req.query;

    // Chuẩn hóa Unicode
    if (danhmuc) danhmuc = danhmuc.normalize('NFC');
    if (trangthai) trangthai = trangthai.normalize('NFC');

    let sql = 'SELECT s.*,GROUP_CONCAT(h.tenhinhanh) AS ds_hinhanh,d.tendm FROM sanpham s JOIN danhmuc d ON s.iddanhmuc = d.iddm JOIN hinhanh h ON h.idsp = s.idsp WHERE 1=1';
    let params = [];

    if (danhmuc) {
        sql += ' AND tendm = ?';
        params.push(danhmuc);
    }

    if (giatu && giaden) {
        sql += ' AND giakhoidiem BETWEEN ? AND ?';
        params.push(giatu, giaden);
    } else if (giatu) {
        sql += ' AND giakhoidiem >= ?';
        params.push(giatu);
    } else if (giaden) {
        sql += ' AND giakhoidiem <= ?';
        params.push(giaden);
    }

    if (trangthai) {
        sql += ' AND trangthai = ?';
        params.push(trangthai);
    }

    sql += ' GROUP BY s.idsp'

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ message: 'Lỗi truy vấn', error: err });
        res.json(result);
    });
};

const taosp = async (req, res) => {
    try {
        const result = await taoSanPham({...req.body})
        return res.json({ message: 'Tạo sản phẩm thành công', idsp: result.insertId, sp: req.body 
         });
    } catch (err) {
        return res.json({ message: 'Tạo sản phẩm thất bại', error: err.message });
    }
};

const xemsp = async (req, res) => {
    try {
        const sp = await xemSanPham();
        res.status(200).json(sp);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh mục' });
    }
}


module.exports = { timkiem, locSanPham, taosp, xemsp };

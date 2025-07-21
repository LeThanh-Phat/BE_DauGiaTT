const modelDanhMuc = require('../model/danhmucModel');
const db = require('../database/connectdb');

const layDanhMuc = async (req, res) => {
    try {
        const danhmuc = await modelDanhMuc.getDanhMuc();
        res.status(200).json(danhmuc);
    } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh mục' });
    }
};

const timDanhMuc = (req, res) => {
    const { tukhoatendm } = req.query;
    if (!tukhoatendm || tukhoatendm.trim() === '') {
        return res.json({ message: 'Vui lòng nhập tên danh mục' });
    }
    const sql = "select * from danhmuc where tendm like ?";

    const tk = `%${tukhoatendm}%`;

    db.query(sql, [tk], (err, result) => {
        if (err) {
            return res.json({ message: 'Lỗi khi tìm kiếm', error: err });
        }
        if (result.length === 0) {
            return res.json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(result);
    });
}

const themDanhMuc = async (req, res) => {
    const { idtkad, tendm } = req.body;

    if (!tendm || tendm.trim() === '') {
        return res.json({ message: 'Vui lòng nhập tên danh mục' });
    }

    try {
        const kttrung = await modelDanhMuc.kiemtratrungtendm(tendm);

        if (kttrung.length > 0) {
            return res.json({ message: 'Tên danh mục đã tồn tại' });
        }
        const sql = "INSERT INTO danhmuc (idtkad, tendm) VALUES (?,?)";
        db.query(sql, [idtkad, tendm], (err, result) => {
            if (err) {
                return res.json({ message: 'Lỗi khi thêm danh mục', error: err });
            }
            return res.json({ message: 'Thêm danh mục thành công', data: result });
        });
    } catch (error) {
        console.error("❌ Lỗi server khi cập nhật danh mục:", error); // log full lỗi
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const suaDanhMuc = async (req, res) => {
    const { iddm, tendmnew } = req.body;

    if (!iddm || !tendmnew || tendmnew.trim() === '') {
        return res.json({ message: 'Vui lòng cung cấp ID danh mục và tên danh mục' });
    }

    try {
        const kttrung = await modelDanhMuc.kiemtratrungtendm(tendmnew);
        if (kttrung.length > 0) {
            return res.json({ message: 'Tên danh mục đã tồn tại' });
        }
        const sql = "UPDATE danhmuc SET tendm = ? WHERE iddm = ?";

        db.query(sql, [tendmnew, iddm], (err, result) => {
            if (err) {
                return res.json({ message: 'Lỗi khi cập nhật danh mục', error: err });
            }
            return res.json({ message: 'Cập nhật danh mục thành công' });
        });
    } catch (error) {
        return res.json({ message: 'Lỗi server', error: error.message });
    }
}

module.exports = {
    layDanhMuc,themDanhMuc,suaDanhMuc,timDanhMuc
};

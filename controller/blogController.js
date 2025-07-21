const db = require('../database/connectdb');
const modelBlog = require('../model/blogModel');

const xemBlog = async (req, res) => {
    try {
        const blog = await modelBlog.getBlog();
        res.status(200).json(blog);
    } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh mục' });
    }
};

const themtintuc = (req, res) => {
    const { idtkad, tieude, noidung } = req.body;

    if (!noidung) {
        return res.json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }
    const a = new Date();
    const sql = "INSERT INTO blog (idtkad, tieude, noidung,thoigiandang) VALUES (?,?,?,?)";
    db.query(sql, [idtkad, tieude, noidung, a], (err, result) => {
        if (err) {
            return res.json({ message: 'Lỗi khi thêm tin tức', error: err });
        }
        return res.json({ message: 'Thêm tin tức thành công', data: result });
    });
}

const xoatintuc = (req, res) => {
    const { idblog } = req.query;

    if (!idblog) {
        return res.json({ message: 'Vui lòng cung cấp ID tin tức' });
    }
    const sql = "DELETE FROM blog WHERE idblog = ?";
    db.query(sql, [idblog], (err, result) => {
        if (err) {
            return res.json({ message: 'Lỗi khi xóa tin tức', error: err });
        }
        if (result.affectedRows === 0) {
            return res.json({ message: 'Không tìm thấy tin tức với ID này' });
        }
        return res.json({ message: 'Xóa tin tức thành công' });
    }
    );
};
const suatintuc = (req, res) => {
    const { idblog,tieude, noidung} = req.body;

    if (!idblog || (!noidung && !tieude) ) {
        return res.json({ message: 'Vui lòng cung cấp ID tin tức và nội dung' });
    }
    const time = new Date();
    const sql = "UPDATE blog SET tieude = ?, noidung = ?,thoigiandang = ? WHERE idblog = ?";
    db.query(sql, [tieude, noidung, time, idblog], (err, result) => {
        if (err) {
            return res.json({ message: 'Lỗi khi cập nhật tin tức', error: err });
        }
        if (result.affectedRows === 0) {
            return res.json({ message: 'Không tìm thấy tin tức với ID này' });
        }
        return res.json({ message: 'Cập nhật tin tức thành công' });
    });
}


module.exports = {
    themtintuc, xoatintuc, suatintuc,xemBlog
};
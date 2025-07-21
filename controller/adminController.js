const bcrypt = require('bcrypt');
const jwttoken = require('jsonwebtoken');
const adminModel = require('../model/adminModel');
const userModel = require('../model/userModel');
const db = require('../database/connectdb');

const layAllTK = async (req, res) => {
    try {
        const tk = await userModel.getAllTK() ;
        res.status(200).json(tk);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin người dùng' });
    }
};

const dangky = async (req, res) => {
    const { ho, tenlot, ten, gmail, ngaysinh, sdt, matkhau } = req.body;

    if (!ho || !tenlot || !ten || !gmail || !ngaysinh || !sdt || !matkhau) {
        return res.json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gmail)) {
        return res.json({ message: 'Vui lòng nhập địa chỉ email hợp lệ' });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(sdt)) {
        return res.json({ message: 'Số điện thoại phải có 10 chữ số' });
    }

    try {
        const emailDaTonTai = await adminModel.timGmailDaTonTai(gmail);
        if (emailDaTonTai) {
            return res.json({ message: 'Email đã được tồn tại' });
        }
        const hashPassword = await bcrypt.hash(matkhau, 15);
        await adminModel.taotk({ ...req.body, matkhau: hashPassword });
        return res.json({ message: 'Đăng ký thành công', admin: req.body,
         });
    } catch (err) {
        return res.json({ message: 'Đăng ký thất bại', error: err.message });
    }
};



const dangnhap = async (req, res) => {
    const { gmail, matkhau } = req.body;

    if (!gmail || !matkhau) {
        return res.status(400).json({ message: 'Vui lòng nhập gmail và mật khẩu' });
    }

    try {
        const kq = await adminModel.checkemail(gmail);
        if (!kq || kq.length === 0) {
            return res.json({ message: 'Sai gmail hoặc mật khẩu' });
        }
        const kthashmk = await bcrypt.compare(matkhau, kq[0].matkhau);
        if (!kthashmk) {
            return res.json({ message: 'Sai gmail hoặc mật khẩu' });
        }

        const payload = { gmail: kq[0].gmail };
        const actoken = jwttoken.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return res.json({
            message: 'Đăng nhập thành công',
            admin: kq[0],
            actoken,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const load = async (req, res) => {
    const gmail = req.admin.gmail;

    try {
        const admin = await adminModel.layThongTin(gmail);
        if (!admin) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        return res.json(admin);
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi khi tải dữ liệu', error: error.message });
    }
};

const capnhatTT = async (req, res) => {
    const { newgmail, newdiachi, newnoinhanhang, newsdt } = req.body;
    const gmailadmin = req.admin.gmail;
    if (!newgmail || !newdiachi || !newnoinhanhang || !newsdt) {
        return res.status(400).json({ message: 'Điền đủ thông tin' });
    }

    try {
        const emailDaTonTai = await adminModel.checkemail(newgmail);
        if (emailDaTonTai.length > 0 && gmailadmin !== emailDaTonTai) {
            return res.status(400).json({ message: 'Gmail đã được sử dụng bởi người khác' });
        }
        const result = await adminModel.capNhatThongTin(gmailadmin, {
            newGmail: newgmail,
            newdiachi: newdiachi,
            newnoinhanhang: newnoinhanhang,
            newsdt: newsdt,
        });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        return res.status(200).json({ message: 'Cập nhật thông tin thành công' });
    } catch (err) {
        return res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const doimatkhau = async (req, res) => {
    const { matkhaucu, matkhaumoi, nhaplaimatkhaumoi } = req.body;
    const gmail = req.admin.gmail;

    if (!matkhaucu || !nhaplaimatkhaumoi || !matkhaumoi) {
        return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin' });
    }

    try {
        if (matkhaucu === matkhaumoi || matkhaucu === nhaplaimatkhaumoi) {
            return res.status(400).json({ message: 'Mật khẩu mới không được trùng với mật khẩu cũ' });
        }
        if (matkhaumoi !== nhaplaimatkhaumoi) {
            return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
        }

        const admin = await adminModel.layMatKhau(gmail);
        if (!admin) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const kiemtra = await bcrypt.compare(matkhaucu, admin.matkhau);
        if (!kiemtra) {
            return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
        }

        const hashMkm = await bcrypt.hash(matkhaumoi, 15);
        const result = await adminModel.capNhatMatKhau(gmail, hashMkm);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const duyetSanPham = (req, res) => {
    const { idsp } = req.body;
    if (!idsp) {
        console.log(idsp)
        return res.status(400).json({ message: 'Thiếu id sản phẩm' });
    }

    const sql = "UPDATE sanpham SET trangthai = 'Đã duyệt' WHERE idsp = ?";

    db.query(sql, [idsp], (err, result) => {
        if (err) {
            console.log(err.message,"1")
            return res.status(500).json({ message: 'Lỗi khi duyệt sản phẩm', error: err });
        }

        if (result.affectedRows === 0) {
            console.log(err.message)
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để duyệt' });
        }
        console.log("ok")
        res.json({ message: 'Duyệt sản phẩm thành công', idsp });
    });
};

const huyDuyetSanPham = (req, res) => {
    const { idsp } = req.body;

    if (!idsp) {
        return res.status(400).json({ message: 'Thiếu id sản phẩm' });
    }

    const sql = "UPDATE sanpham SET trangthai = 'Đã hủy' WHERE idsp = ?";

    db.query(sql, [idsp], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi duyệt sản phẩm', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để duyệt' });
        }
        res.json({ message: 'Hủy sản phẩm thành công', idsp });
    });
};

const DuyetPhienDauGia = (req, res) => {
    const { idphiendg } = req.body;

    if (!idphiendg) {
        return res.status(400).json({ message: 'Thiếu id phiên' });
    }

    const sql = "UPDATE phiendaugia SET trangthaiduyet = 'Đã duyệt' WHERE idphiendg = ?";

    db.query(sql, [idphiendg], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi duyệt phiên đấu tra', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phiên để duyệt' });
        }
        res.json({ message: 'Duyệt phiên thành công', idphiendg });
    });
};

const HuyPhienDauGia = (req, res) => {
    const { idphiendg } = req.body;

    if (!idphiendg) {
        return res.status(400).json({ message: 'Thiếu id phiên' });
    }

    const sql = "UPDATE phiendaugia SET trangthaiduyet = 'Đã hủy' WHERE idphiendg = ?";

    db.query(sql, [idphiendg], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi hủy phiên đấu tra', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phiên để hủy' });
        }
        res.json({ message: 'Hủy phiên thành công', idphiendg });
    });
}

module.exports = {
    dangky, dangnhap, load, capnhatTT, doimatkhau, DuyetPhienDauGia, HuyPhienDauGia, duyetSanPham, huyDuyetSanPham,layAllTK
};
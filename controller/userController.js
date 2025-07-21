const bcrypt = require('bcrypt');
const jwttoken = require('jsonwebtoken');
const userModel = require('../model/userModel');

const dangky = async (req, res) => {
    const { ho, tenlot, ten, gmail, ngaysinh, diachi, noinhanhang, sdt, matkhau } = req.body;

    if (!ho || !tenlot || !ten || !gmail || !ngaysinh || !diachi || !noinhanhang || !sdt || !matkhau) {
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
        const emailDaTonTai = await userModel.timGmailDaTonTai(gmail);
        if (emailDaTonTai) {
            return res.json({ message: 'Email đã được tồn tại' });
        }
        const hashPassword = await bcrypt.hash(matkhau, 15);
        await userModel.taotk({ ...req.body, matkhau: hashPassword });
        return res.json({ message: 'Đăng ký thành công', user: req.body,
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
        const kq = await userModel.checkemail(gmail);
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
            user: kq[0],
            actoken,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const load = async (req, res) => {
    const gmail = req.user.gmail;

    try {
        const user = await userModel.layThongTin(gmail);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi khi tải dữ liệu', error: error.message });
    }
};

const capnhatTT = async (req, res) => {
    const { newgmail, newdiachi, newnoinhanhang, newsdt } = req.body;
    const gmailUser = req.user.gmail;
    if (!newgmail || !newdiachi || !newnoinhanhang || !newsdt) {
        return res.status(400).json({ message: 'Điền đủ thông tin' });
    }

    try {
        const emailDaTonTai = await userModel.checkemail(newgmail);
        if (emailDaTonTai.length > 0 && gmailUser !== emailDaTonTai) {
            return res.status(400).json({ message: 'Gmail đã được sử dụng bởi người khác' });
        }
        const result = await userModel.capNhatThongTin(gmailUser, {
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
    const gmail = req.user.gmail;

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

        const user = await userModel.layMatKhau(gmail);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const kiemtra = await bcrypt.compare(matkhaucu, user.matkhau);
        if (!kiemtra) {
            return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
        }

        const hashMkm = await bcrypt.hash(matkhaumoi, 15);
        const result = await userModel.capNhatMatKhau(gmail, hashMkm);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    dangky, dangnhap, load, capnhatTT, doimatkhau,
};
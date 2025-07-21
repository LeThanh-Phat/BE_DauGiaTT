const db = require('../database/connectdb');
const modelphiendaugia = require('../model/phiendaugiaModel');
const xemchitietphiendaugia = (req, res) => {
    const { idphiendg } = req.query;

    if (!idphiendg) {
        return res.json({ message: 'Vui lòng cung cấp ID phiên đấu giá' });
    }

    try {
        const sqlPDG = "SELECT ANY_VALUE(pdg.idphiendg) AS idphiendg,ANY_VALUE(pdg.trangthai) AS trangthaipdg,ANY_VALUE(t.gmail) AS gmail_tk,sp.*,GROUP_CONCAT(h.tenhinhanh) AS ds_hinhanh FROM phiendaugia pdg JOIN sanpham sp ON pdg.idsp = sp.idsp  JOIN hinhanh h ON h.idsp = sp.idsp JOIN taikhoan t ON sp.idtk = t.idtk GROUP BY sp.idsp";
        db.query(sqlPDG, [idphiendg], (err, result) => {
            if (err) {
                return res.json({ message: 'Lỗi khi truy vấn dữ liệu', error: err });
            }
            if (result.length === 0) {
                return res.json({ message: 'Không tìm thấy phiên đấu giá' });
            }
            res.json(result[0]);
        });
    } catch (error) {
        return res.json({ message: 'Lỗi server', error: error.message });
    }
};

const timSPCoPhiendaugia = (req, res) => {
    const { tensp } = req.query;
    if (!tensp || tensp.trim() === '') {
        return res.json({ message: 'Vui lòng nhập tên sản phẩm' });
    }
    try {
        const result = modelphiendaugia.timTheoTensp(tensp);
        if (result.length === 0) {
            return res.json({ message: 'Không tìm thấy sản phẩm có phiên đấu giá' });
        }
        return res.json({ message: 'kết quả', data: result });
    } catch (error) {
        return res.json({ message: 'Lỗi khi tìm kiếm sản phẩm', error: error.message });
    }
}

const timSPCoPhiendaugiatheotrangthai = async (req, res) => {
    const { trangthai } = req.query;
    if (!trangthai || trangthai.trim() === '') {
        return res.json({ message: 'Vui lòng nhập trạng thái phiên đấu giá' });
    }
    try {
        const result = await modelphiendaugia.loctheoTrangthaiPhiendaugia(trangthai);
        if (result.length === 0) {
            return res.json({ message: 'Không tìm thấy sản phẩm có phiên đấu giá với trạng thái này' });
        }
        return res.json({ message: 'kết quả', data: result });
    } catch (error) {
        return res.json({ message: 'Lỗi khi tìm kiếm sản phẩm theo trạng thái', error: error.message });
    }
};

const layPhienDauGia = async (req, res) => {
    try {
        const pdg = await modelphiendaugia.xemPhienDauGia();
        res.status(200).json(pdg);
    } catch (error) {
        console.error('Lỗi khi lấy phiên đấu giá:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy phiên đấu giá' });
    }
};

const getGmail = async (req, res) => {
    try {
        const result = await modelphiendaugia.laygmailtkban(req.query.idphiendg)
        return res.json({
            message: 'lấy gmail đk phiên thành công', gmail: result[0].gmail, idtk: result[0].idtk
        });
    } catch (err) {
        return res.json({ message: 'lấy gmail đk thất bại', error: err.message });
    }
}

const updatepdg = async (req, res) => {
    try {
        const result = await modelphiendaugia.capnhappdg({ ...req.query })
        return res.json({
            message: 'cập nhật phiên thành công', kq: result, id: req.query
        });
    } catch (err) {
        return res.json({ message: 'lcập nhật phiên thất bại', error: err.message });
    }
}

module.exports = {
    xemchitietphiendaugia, timSPCoPhiendaugia, timSPCoPhiendaugiatheotrangthai, layPhienDauGia, getGmail, updatepdg
};


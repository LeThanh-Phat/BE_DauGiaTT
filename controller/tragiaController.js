const db = require('../database/connectdb');
const { taotragia, lantragia} = require('../model/tragiaModel');


const xuatgiatratrongphien = (req, res) => {
    const { idtk, idphiendg } = req.body;
    if (!idtk || !idphiendg) {
        return res.json({ message: 'Vui lòng cung cấp ID tài khoản và ID phiên đấu giá' });
    }
    try {
        const sql = "select sotientragia,thoigiantragia,solantragia from tragia where idtk = ? and idphiendg = ?";
        db.query(sql, [idtk, idphiendg], (err, result) => {
            if (err) {
                return res.json({ message: 'Lỗi khi truy vấn dữ liệu', error: err });
            }
            if (result.length === 0) {
                return res.json({ message: 'Không tìm thấy dữ liệu' });
            }
            res.json(result);
        });

    } catch (error) {
        return res.json({ message: 'Lỗi server', error: error.message });
    }
}

const xuatallnguoitragiatrongphien = (req, res) => {
    const { idphiendg } = req.query;
    if (!idphiendg) {
        return res.json({ message: 'Vui lòng cung cấp ID phiên đấu giá' });
    }
    try {
        const sql = "select taikhoan.idtk,count(*) as tongsolantra  from taikhoan join tragia on taikhoan.idtk = tragia.idtk join phiendaugia ON tragia.idphiendg = phiendaugia.idphiendg  where phiendaugia.idphiendg = ? group by taikhoan.idtk;";
        db.query(sql, [idphiendg], (err, result) => {
            if (err) {
                return res.json({ message: 'Lỗi khi truy vấn dữ liệu', error: err });
            }
            if (result.length === 0) {
                return res.json({ message: 'Không tìm thấy dữ liệu' });
            }
            res.json(result);
        });
    } catch (error) {
        return res.json({ message: 'Lỗi server', error: error.message });

    }
}

const tragiatrongphien = (req, res) => {
    const { idtk, idphiendg, sotientragia } = req.body;

    if (!idtk || !idphiendg || !sotientragia) {
        return res.json({ message: 'Không để trống' });
    }

    const sqlPhien = 'select giakhoidiem, buocgia, thoigiankt from phiendaugia where idphiendg = ?';
    db.query(sqlPhien, [idphiendg], (err, phien) => {

        if (err) {
            return res.json({ message: 'Lỗi khi kiểm tra phiên đấu giá', error: err.message });
        }
        if (phien.length === 0) {
            return res.json({ message: 'Phiên đấu giá không tồn tại' });
        }

        const { giakhoidiem, buocgia, thoigianketthuc } = phien[0];

        const now = new Date();
        if (now > new Date(thoigianketthuc)) {
            return res.json({ message: 'Phiên đấu giá đã kết thúc' });
        }

        const sqlCount = 'select count(*) as solantragia from tragia where idtk = ? and idphiendg = ?';
        db.query(sqlCount, [idtk, idphiendg], (err, countResult) => {
            if (err) {
                return res.json({ message: 'Lỗi khi kiểm tra lượt trả giá', error: err.message });
            }
            if (countResult[0].solantra >= 10) {
                return res.json({ message: 'Bạn đã trả giá đủ 10 lần trong phiên này' });
            }
            const solantragia = countResult[0].solantragia + 1;
            const sqlMaxGia = 'select max(sotientragia) as max_gia from tragia where idphiendg = ?';
            db.query(sqlMaxGia, [idphiendg], (err, maxGia) => {
                if (err) {
                    return res.json({ message: 'Lỗi khi kiểm tra giá cao nhất', error: err.message });
                }

                const giaCaoNhat = Number(maxGia[0].max_gia) || Number(giakhoidiem);
                const giathapnhat = giaCaoNhat + Number(buocgia);
                const giatoida = giaCaoNhat + 10 * Number(buocgia);
                // Kiểm tra giá trả
                if (sotientragia < giathapnhat) {
                    return res.json({ message: `Giá trả phải lớn hơn hoặc bằng ${giathapnhat}` });
                }
                if (sotientragia > giatoida) {
                    return res.json({ message: `Giá trả không được vượt quá ${giatoida}` });
                }

                const sqlInsert = 'insert into tragia (idtk, idphiendg, sotientragia, thoigiantragia,solantragia) values (?, ?, ?,now(),?)';
                db.query(sqlInsert, [idtk, idphiendg, sotientragia, solantragia], (err, result) => {
                    if (err) {
                        return res.json({ message: 'Lỗi khi lưu trả giá', error: err.message });
                    }
                    res.json({
                        message: 'Trả giá thành công',
                        data: { idtk, idphiendg, sotientragia, thoigiantragia: new Date(), solantragia }
                    });
                });
            });
        });
    });
};

const themTraGia = async (req,res) => {
    try {
        const result = await taotragia({...req.body})
        return res.json({ message: 'Tạo trả giá thành công'
         });
    } catch (err) {
        return res.json({ message: 'Tạo trả giá thất bại', error: err.message });
    }
}

const solantra = async (req,res) => {
    try {
        const result = await lantragia(req.query.idtk,req.query.idphiendg)
        return res.json({ message: 'Đếm số lần thành công'}); 
    } catch (err) {
        return res.json({ message: 'Đếm số lần thất bại', error: err.message });
    }
}


module.exports = {
    xuatgiatratrongphien, xuatallnguoitragiatrongphien, tragiatrongphien,themTraGia,solantra
}
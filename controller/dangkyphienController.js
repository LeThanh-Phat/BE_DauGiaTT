const { taodkphien,ktdkphien,demnguoidk,thongtinnguoidk } = require('../model/dangkyphienModel');


const taodangkyphien = async (req, res) => {
    try {
        const result = await taodkphien({...req.body})
        return res.json({ message: 'Tạo đk phiên thành công', dkphien: req.body 
         });
    } catch (err) {
        return res.json({ message: 'Tạo đk phiên thất bại', error: err.message });
    }
};

const checkdkphien = async (req, res) => {
    try {
        console.log("Query nhận được:", req.query);
        const result = await ktdkphien({...req.query})
        return res.json({ message: 'Kiểm tra đk phiên thành công', dkphien: result.length > 0 ? true : false, 
         });
    } catch (err) {
        return res.json({ message: 'Kiểm tra đk phiên thất bại', error: err.message });
    }
};

const countdkphien = async (req, res) => {
    try {
        const result = await demnguoidk(req.query.idphiendg)
        return res.json({ message: 'Đếm đk phiên thành công', count: result, 
         });
    } catch (err) {
        return res.json({ message: 'Đếm đk phiên thất bại', error: err.message });
    }
};

const infodkphien = async (req, res) => {
    try {
        const result = await thongtinnguoidk(req.query.idphiendg)
        return res.json({ message: 'lấy thông tin đk phiên thành công', info: result, 
         });
    } catch (err) {
        return res.json({ message: 'lấy thông tin đk phiên thất bại', error: err.message });
    }
};

module.exports = {
    taodangkyphien,checkdkphien, countdkphien,infodkphien
};
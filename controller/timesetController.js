const TimeModel = require('../model/timeModel');

// Controller: Trả về thời gian bắt đầu đếm ngược
const getStartTime = async (req, res) => {
    const { idphiendg } = req.query;

    if (!idphiendg) {
        return res.status(400).json({ message: 'Thiếu idphiendg' });
    }

    try {
        const rows = await TimeModel.getStartTimeByPhienId(idphiendg);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phiên đấu giá' });
        }

        const startTime = new Date(rows[0].thoigianbd);
        res.json({ startTime });
    } catch (error) {
        console.error('Lỗi lấy startTime:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = {
    getStartTime
};

const sendEmail = require('../utils/sendEmail');

const sendTestMail = async (req, res) => {
  const { to, noidung } = req.body;

  if (!to || !noidung) {
    return res.status(400).json({ message: "Thiếu địa chỉ email hoặc nội dung" });
  }

  try {
    await sendEmail(to, "Thông báo từ hệ thống đấu giá", noidung);
    res.json({ message: "Email đã được gửi!" });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    res.status(500).json({ message: "Gửi email thất bại", error: error.message });
  }
};

module.exports = { sendTestMail };

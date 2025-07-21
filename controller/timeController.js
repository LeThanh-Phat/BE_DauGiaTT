const getCurrentTime = (req, res) => {
  const now = new Date();

  const options = {
    weekday: undefined,
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  const formatted = now.toLocaleString('en-US', options); // VD: 26 June 2025, 03:45:23 PM
  const formattedClean = formatted.replace(',', ''); // Xóa dấu phẩy

  res.json({ time: formattedClean });
};

module.exports = { getCurrentTime };

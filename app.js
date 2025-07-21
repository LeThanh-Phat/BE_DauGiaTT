require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const socketController = require('./controller/socketController');
const db = require('./database/connectdb');

// Routers
const routeAPI = require('./route/user');
const routeSanPham = require('./route/sanpham');
const routePhienDauGia = require('./route/phiendaugia');
const routerHinhAnh = require('./route/hinhanh');
const routerDanhMuc = require('./route/danhmuc');
const routerMail = require('./route/mailRouter');
const routerTime = require('./route/time');
const routerDangkyphien = require('./route/dangkyphien');
const routerTragia = require('./route/tragia');
const routerSocket = require('./route/socket');
const routerTimeSet = require('./route/timeset');
const routerAdmin = require('./route/admin');
const routerBlog = require('./route/blog');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api/user', routeAPI);
app.use('/api/trangchu', routeSanPham);
app.use('/api/phiendaugia', routePhienDauGia);
app.use('/api/hinhanh', routerHinhAnh);
app.use('/api/danhmuc', routerDanhMuc);
app.use('/api/mail', routerMail);
app.use('/api/time', routerTime);
app.use('/api/dkphien', routerDangkyphien);
app.use('/api/tragia', routerTragia);
app.use('/api/socket', routerSocket);
app.use('/api/timeset', routerTimeSet);
app.use('/api/admin', routerAdmin);
app.use('/api/blog', routerBlog);

// Tạo HTTP server từ app Express
const server = http.createServer(app);

// Tạo socket server
const io = new Server(server, {
  cors: {
    origin: ["https://website-daugiatrutuyen-freefat.web.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
});

// Khi client kết nối socket
io.on('connection', (socket) => {
  socketController(io, socket);
});

// PAYPAL LOGIC
const base = "https://api-m.sandbox.paypal.com";

async function generateAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await axios.post(`${base}/v1/oauth2/token`, "grant_type=client_credentials", {
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  return response.data.access_token;
}

app.post('/api/create-order', async (req, res) => {
  const token = await generateAccessToken();
  const response = await axios.post(`${base}/v2/checkout/orders`, {
    intent: "CAPTURE",
    purchase_units: [{
      amount: {
        currency_code: "USD",
        value: req.body.amount || "10.00"
      }
    }]
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  res.json(response.data);
});

app.post('/api/capture-order/:orderID', async (req, res) => {
  try {
    const token = await generateAccessToken();
    const { orderID } = req.params;

    const response = await axios.post(`${base}/v2/checkout/orders/${orderID}/capture`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const details = response.data;
    const { idtk, idphiendg, amount, thoigianktdk } = req.body;

    const update_time = new Date(details.purchase_units[0].payments.captures[0].create_time);
    const vnTime = new Date(update_time.getTime());
    const deadline = new Date(thoigianktdk);

    const trangthai = vnTime > deadline ? 'thatbai' : 'thanhcong';

    if (!idtk || !idphiendg || !amount || !thoigianktdk) {
      return res.status(400).json({ error: 'Thiếu dữ liệu gửi từ client' });
    }

    const sql = `
      INSERT INTO phieuthanhtoan (idphiendg, idtk, thoigiantt, sotientt, trangthai)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [idphiendg, idtk, vnTime, parseFloat(amount), trangthai], (err, result) => {
      if (err) {
        console.error('Lỗi khi lưu vào DB:', err);
        return res.status(500).json({ error: 'Lỗi lưu DB' });
      }

      if (trangthai === 'thatbai') {
        return res.status(400).json({ message: "Thanh toán quá hạn đăng ký" });
      }

      const dangKyData = {
        idtk,
        idphiendg,
        thoigiandk: (new Date(update_time.getTime() + 7 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')
      };

      // Sử dụng biến môi trường cho URL
      const apiUrl = process.env.API_URL || 'http://localhost:3005';
      axios.post(`${apiUrl}/api/dkphien/taodkphien`, dangKyData)
        .then((response) => {
          console.log('Đăng ký phiên thành công:', response.data);
          res.json({
            message: "Thanh toán và đăng ký phiên thành công",
            orderID: details.id
          });
        })
        .catch(err => {
          console.error('Lỗi khi thêm vào dangkyphien:', err);
          res.status(500).json({ error: 'Lỗi khi thêm vào bảng đăng ký phiên' });
        });
    });

  } catch (err) {
    console.error('Lỗi capture:', err);
    res.status(500).json({ error: 'Lỗi khi capture đơn hàng' });
  }
});

// 404 và xử lý lỗi
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route không tồn tại' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Có lỗi xảy ra!', error: err.message });
});

// 🚀 Khởi động server
server.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

module.exports = { app, server };
const TragiaModel = require('../model/tragiaModel');

const socketController = (io, socket) => {
  console.log(' Client connected:', socket.id);

  // Nhận sự kiện từ client khi đặt giá
  socket.on('dat_gia_moi', async (data) => {
    try {
      // 1. Đếm số lần trả giá hiện tại
      const solan = await TragiaModel.lantragia({
        idtk: data.idtk,
        idphiendg: data.idphiendg
      });

      // 2. Gán lại solan vào data (cộng thêm 1 cho lần này)
      const dataTraGia = {
        ...data,
        solantragia: solan + 1
      };

      // 3. Lưu vào DB
      await TragiaModel.taotragia(dataTraGia);

      // 4. Emit cập nhật số lần về riêng client đó
      socket.emit('so_lan_tra_gia', solan + 1);

      // 5. Emit data mới cho tất cả client (dùng để cập nhật bảng)
      io.emit('cap_nhat_gia', dataTraGia);
    } catch (err) {
      console.error(' Lỗi xử lý trả giá:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(' Client disconnected:', socket.id);
  });

  socket.on('lan_tra_gia', async (data) => {
    console.log("Đếm số lần trả giá của người tham gia: ", data);
    try {
      const solan = await TragiaModel.lantragia(data);
      socket.emit("lan_tra_gia", solan);
    } catch (err) {
      console.error('Lỗi đếm số lần trả giá', err.message);
    }
  })

  socket.on('gia_cao_nhat_1', async (data) => {
    try {
      const sotientragia = await TragiaModel.giacaonhat1(data);
      socket.emit("gia_cao_nhat_1", sotientragia);
    } catch (err) {
      console.error('Lỗi xuất giá trả cao nhất', err.message);
    }
  })

  socket.on('dem_nguoi_tra_gia', async (data) => {
    try {
      const songuoitragia = await TragiaModel.demnguoitragia(data);
      socket.emit("dem_nguoi_tra_gia", songuoitragia);
    } catch (err) {
      console.error('Lỗi đếm người trả giá', err.message);
    }
  })

  socket.on('gia_cao_nhat_2', async (data) => {
    try {
      const infogiacaonhat = await TragiaModel.giacaonhattrong1phut(data);
      socket.emit("gia_cao_nhat_2", infogiacaonhat);
    } catch (err) {
      console.error('Lỗi xuất thông tin giá cao nhất trong 1 phút', err.message);
    }
  })

  socket.on('xuat_info_tra_gia', async (data) => {
    try {
      const infotragia = await TragiaModel.xuatinfotragia(data);
      socket.emit("xuat_info_tra_gia", infotragia)
      console.log(infotragia)
      console.log(data)
    } catch (err) {
      console.error('Lỗi xuất info trả giá trong 1 phút', err.message);
    }
  })

  socket.on('ket_thuc_phien', async (data, callback) => {
    try {
      const infonguoitrung = await TragiaModel.infonguoitrung(data);

      //  Trả kết quả về client thông qua callback
      if (callback) {
        callback(infonguoitrung); // Trả về client
      }

      // Không cần emit lại về client nữa nếu đã dùng callback
      console.log("Những người trúng phiên gồm:", infonguoitrung);
      console.log("Dữ liệu yêu cầu:", data);
    } catch (err) {
      console.error(' Lỗi xuất info trả giá trong 1 phút:', err.message);
    }
  });


};

module.exports = socketController;

const { override, useBabelRc, addWebpackPlugin } = require("customize-cra");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = override(
  useBabelRc(),
  addWebpackPlugin(
    new Dotenv({
      path: ".env", // đường dẫn đến file .env
      safe: true, // chỉ sử dụng các giá trị được đặt trong .env.example
      systemvars: true, // cho phép đọc các biến môi trường từ hệ thống
      silent: true, // không hiển thị thông báo lỗi khi không tìm thấy file .env
      defaults: false, // không tải các giá trị mặc định từ .env.defaults 
    }),
    new CleanWebpackPlugin()
  )
);
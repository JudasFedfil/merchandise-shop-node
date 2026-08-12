# Merchandise Shop - Backend API (Node.js)

Đây là hệ thống Backend Server cung cấp API cho website thương mại điện tử chuyên kinh doanh các sản phẩm Figure Anime, Gundam và Merchandise. Dự án được xây dựng theo chuẩn kiến trúc MVC (Model - View - Controller).

## 🛠 Công nghệ sử dụng
*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Cơ sở dữ liệu:** MySQL
*   **ORM:** Sequelize
*   **Xử lý hình ảnh:** Multer
*   **Xuất tệp PDF:** PDFKit

## ✨ Các chức năng chính
*   **Sản phẩm:** Cung cấp API thêm, sửa, xóa, lấy danh sách sản phẩm, tự động tính toán giá Flash Sale và hỗ trợ tính năng Import từ file Excel.
*   **Tài khoản:** API đăng nhập, quản lý và phân quyền người dùng (Khách hàng / Quản trị viên).
*   **Hóa đơn:** Xử lý luồng đặt hàng, tự động trừ/hoàn lại số lượng tồn kho sản phẩm theo trạng thái đơn hàng.
*   **Thống kê:** Tính toán doanh thu theo Tháng/Quý/Năm.
*   **Tiện ích:** API hỗ trợ upload hình ảnh vào máy chủ và kết xuất báo cáo doanh thu, hóa đơn bán lẻ dưới dạng file PDF (hỗ trợ Tiếng Việt).

## 🚀 Hướng dẫn cài đặt và chạy dự án

### 1. Yêu cầu hệ thống
*   Đã cài đặt [Node.js](https://nodejs.org/)
*   Đã cài đặt MySQL (có thể dùng XAMPP, Laragon, hoặc MySQL Workbench)

### 2. Cài đặt thư viện
Mở terminal tại thư mục gốc của dự án và chạy lệnh:
```bash
npm install

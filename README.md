# Price Tracker Pro - Hướng dẫn sử dụng

Đây là một ứng dụng desktop để theo dõi giá sản phẩm, được xây dựng bằng React và đóng gói bằng Electron.

## Yêu cầu

-   [Node.js](https://nodejs.org/) (phiên bản 18 trở lên được khuyến nghị)
-   npm (thường đi kèm với Node.js)

## 1. Cài đặt ban đầu

Sau khi có mã nguồn, bạn chỉ cần thực hiện một bước cài đặt duy nhất. Mở terminal (hoặc Command Prompt, PowerShell) trong thư mục gốc của dự án và chạy lệnh sau:

```bash
npm install
```

Lệnh này sẽ đọc file `package.json` và tự động tải về tất cả các thư viện cần thiết cho cả Electron, React, và các công cụ để đóng gói ứng dụng.

## 2. Chạy ứng dụng ở chế độ phát triển

Khi bạn muốn lập trình, chỉnh sửa hoặc kiểm thử ứng dụng, hãy sử dụng lệnh sau:

```bash
npm run dev
```

Lệnh này sẽ thực hiện các công việc sau:
- Khởi động một server phát triển cho giao diện React (sử dụng Vite).
- Mở cửa sổ ứng dụng Electron.
- Tự động tải lại giao diện ngay lập tức khi bạn lưu thay đổi trong code (hot-reloading), giúp quá trình phát triển nhanh hơn.
- Mở sẵn công cụ lập trình (DevTools) để bạn có thể dễ dàng kiểm tra lỗi.

## 3. Đóng gói ứng dụng thành file `.exe`

Khi ứng dụng đã hoàn thiện và bạn muốn chia sẻ nó cho người khác trong công ty để họ có thể cài đặt và sử dụng một cách dễ dàng, bạn cần đóng gói nó lại.

Để tạo một file cài đặt `.exe` cho hệ điều hành Windows, hãy chạy lệnh:

```bash
npm run build:win
```

**Lưu ý:** Quá trình này có thể mất vài phút để hoàn tất.

Nó sẽ tự động thực hiện các bước:
1.  Build code React của bạn thành các file HTML/CSS/JS tĩnh.
2.  Build code của Electron.
3.  Sử dụng công cụ `electron-builder` để đóng gói tất cả các file cần thiết vào một trình cài đặt `.exe` duy nhất.

## 4. Cách sử dụng và phân phối ứng dụng

Sau khi quá trình đóng gói ở bước 3 hoàn tất, bạn sẽ thấy một thư mục mới có tên là `release` được tạo ra trong thư mục gốc của dự án.

-   **Bên trong thư mục `release`**, bạn sẽ tìm thấy file cài đặt, ví dụ: `Price Tracker Pro Setup 1.0.0.exe`.

-   **Bạn chỉ cần gửi file `.exe` này** cho đồng nghiệp hoặc người dùng cuối.

Họ chỉ cần thực hiện các thao tác đơn giản sau:
1.  Nháy đúp chuột vào file `.exe` để bắt đầu quá trình cài đặt.
2.  Làm theo các bước hướng dẫn trên màn hình (chọn nơi cài đặt, v.v.).
3.  Sau khi cài đặt xong, một biểu tượng (shortcut) của ứng dụng "Price Tracker Pro" sẽ xuất hiện trên Màn hình desktop hoặc trong Start Menu.
4.  Họ có thể mở ứng dụng và bắt đầu sử dụng ngay lập tức. Mọi dữ liệu (danh sách sản phẩm) sẽ được tự động lưu trên chính máy tính của họ.

**Người dùng cuối không cần phải cài đặt Node.js hay chạy bất kỳ dòng lệnh phức tạp nào.**

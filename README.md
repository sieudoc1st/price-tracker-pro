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

## 3. Đóng gói ứng dụng thành file `.exe` (Portable)

Khi ứng dụng đã hoàn thiện và bạn muốn chia sẻ nó cho người khác trong công ty, bạn cần đóng gói nó lại. Lệnh sau sẽ tạo ra một file **portable `.exe`**, nghĩa là người dùng có thể chạy trực tiếp mà không cần cài đặt.

Để tạo file `.exe` cho hệ điều hành Windows, hãy chạy lệnh:

```bash
npm run build:win
```

**Lưu ý:** Quá trình này có thể mất vài phút để hoàn tất.

Nó sẽ tự động thực hiện các bước:
1.  Build code React của bạn thành các file HTML/CSS/JS tĩnh.
2.  Build code của Electron.
3.  Sử dụng công cụ `electron-builder` để đóng gói tất cả các file cần thiết vào một file `.exe` duy nhất.

## 4. Cách sử dụng và phân phối ứng dụng

Sau khi quá trình đóng gói ở bước 3 hoàn tất, bạn sẽ thấy một thư mục mới có tên là `release` được tạo ra trong thư mục gốc của dự án.

-   **Bên trong thư mục `release`**, bạn sẽ tìm thấy file ứng dụng, ví dụ: `Price Tracker Pro 1.0.0.exe`.

-   **Bạn chỉ cần gửi file `.exe` này** cho đồng nghiệp hoặc người dùng cuối.

Họ chỉ cần nháy đúp chuột vào file `.exe` để **chạy ứng dụng ngay lập tức**. Không cần phải cài đặt. Mọi dữ liệu (danh sách sản phẩm) sẽ được tự động lưu trên chính máy tính của họ trong thư mục dữ liệu người dùng.

## (Tùy chọn) Thêm Icon tùy chỉnh cho ứng dụng

Ứng dụng sẽ có một icon mặc định của Electron. Nếu bạn muốn thay đổi nó:
1.  Chuẩn bị một file icon định dạng `.ico` cho Windows.
2.  Đặt tên file là `icon.ico`.
3.  Đặt file đó vào thư mục `build` ở gốc dự án (thay thế file `placeholder.txt` có sẵn).
4.  Chạy lại lệnh `npm run build:win`. File `.exe` mới sẽ có icon của bạn.

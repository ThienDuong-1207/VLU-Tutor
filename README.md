# VLU Tutor System

Hệ thống gia sư trực tuyến được thiết kế riêng cho trường Đại học Văn Lang.

## Cấu trúc thư mục

```
vlu-tutor/
├── css/
│   └── style.css
├── js/
│   └── login.js
├── images/
│   └── vlu-logo.svg
├── dashboard/
│   ├── student.html
│   ├── tutor.html
│   ├── center.html
│   └── admin.html
└── index.html
```

## Cách sử dụng

1. Logo VLU đã được tạo sẵn trong thư mục `images/` với tên `vlu-logo.svg`
2. Mở file `index.html` bằng trình duyệt web
3. Sử dụng một trong các tài khoản demo sau để đăng nhập:

| Role        | Email                  | Password |
|-------------|------------------------|----------|
| Student     | student@vlu.edu.vn     | 123456   |
| Tutor       | tutor@vlu.edu.vn       | 123456   |
| VLU Center  | center@vlu.edu.vn      | 123456   |
| IT Admin    | admin@vlu.edu.vn       | 123456   |

## Tính năng

- ✅ Giao diện responsive (Mobile & Desktop)
- ✅ Validation email domain @vlu.edu.vn
- ✅ Hiển thị thông báo lỗi với animation
- ✅ Lưu thông tin đăng nhập vào session storage
- ✅ Chuyển hướng tới dashboard tương ứng với role

## Phát triển

Để phát triển thêm các tính năng:

1. Tạo các file dashboard trong thư mục `dashboard/`
2. Thêm các tính năng xác thực và bảo mật
3. Kết nối với backend API
4. Thêm các tính năng theo yêu cầu của từng role

## Công nghệ sử dụng

- HTML5
- CSS3 (với CSS Variables và Flexbox/Grid)
- JavaScript (Vanilla JS)
- Font Awesome Icons 
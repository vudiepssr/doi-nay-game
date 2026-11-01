# ĐỜI NÀY v0.7 — PUBLIC READY

Bản web Life Simulator **không cần login**, khi mở URL public sẽ có Guest ID (cookie HttpOnly), server xử lý nhân vật, **4 bảng xếp hạng chung toàn quốc** và hồi ký kiếp trước. Tăng tuổi tự động 5 giây/năm, IQ 0–200, 2 biến cố phụ/năm, tự thêm sự kiện trong `js/customEvents.js`.

## Hướng dẫn từ A–Z

Mở **`HUONG-DAN-PUBLIC-ONLINE.md`** để đăng web với Supabase + GitHub + Netlify. Bản ZIP chưa tự triển khai web hay tạo URL. Chủ website phải đăng nhập dịch vụ của mình, chạy SQL và đặt key ở server.

## Quan trọng

- Website thật: `index.html`, Netlify xây thư mục `public/`, Netlify Function ở `netlify/functions/game.mjs`.
- Chơi offline bằng file `play.html` *trên máy*. Bản offline không lên Top quốc gia và `play.html` không được xuất bản trong thư mục `public/` trên Netlify.
- Không nhúng `SUPABASE_SECRET_KEY` vào trình duyệt hoặc GitHub. Chỉ đặt trong Netlify **Environment variables**, scope **Functions**.
- URL `/api/game?view=health`: kiểm tra Function + Supabase, kỳ vọng `ok:true` và `database:"connected"`.
- Kho sự kiện tự chế: `js/customEvents.js`; upload source mới lên GitHub sẽ trigger Netlify deploy.

## Test ở máy cho lập trình viên

```sh
python3 build.py
node --test tests/*.test.mjs
node test_core.cjs
python3 test_archive.py
```

Bài test hiện dùng Supabase mock, chưa phải dự án Supabase thật. Muốn xác nhận public thật phải làm Health test ở URL đã deploy và test hai thiết bị.

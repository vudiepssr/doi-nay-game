# Cập nhật ĐỜI NÀY v0.9 → v0.9.1 — Bảng tin 10 bài/trang

## Mục tiêu

- Trang 1 chứa **10 tin mới nhất**. Mỗi trang kế tiếp có tối đa 10 tin cũ hơn.
- Cuối bảng tin có nút **TRANG TRƯỚC / TRANG SAU** và số trang hiện tại.
- Bộ lọc TẤT CẢ, DRAMA, VẬN ĐỎ, ĐỜI THƯỜNG cũng phân trang riêng.
- Tự động 5 giây/năm và +1 tuổi thủ công không thay đổi; khi đang xem trang cũ, game không tự chuyển sang trang 1.
- Không xóa bất kỳ sự kiện nào: đây chỉ là giới hạn số tin **hiển thị**, không giới hạn dữ liệu lưu.

## Cập nhật website Netlify/GitHub đã chạy v0.9

**Chỉ thay 3 file dưới đây**, đúng đường dẫn đã có ở GitHub:

```text
css/style.css
js/ui.js
js/main.js
```

1. Tải `DOI-NAY-v0.9.1-BAN-VA-3-FILE.zip`, giải nén trên máy.
2. Vào repository GitHub game của mày.
3. Mở `css` và cập nhật `style.css` từ bản vá. Mở `js` và cập nhật `ui.js`, `main.js` từ bản vá. Nếu GitHub giao diện web không cho upload ghi đè, mở file, chọn nút bút chì (Edit), thay nội dung bằng file mới, rồi Commit; hoặc dùng GitHub Desktop thay 3 file và Push. **Không đặt thêm một thư mục bọc bên ngoài.**
4. Commit lên nhánh Netlify đang dùng (thường là `main`).
5. Mở Netlify → **Deploys**, đợi **Published**; nếu không tự deploy thì Trigger deploy.
6. Mở website công khai, nhấn `Ctrl+Shift+R` trên Windows để tránh cache. Trên điện thoại có thể đóng tab rồi mở lại.
7. Thử qua khoảng 4 năm để có trên 10 tin và kiểm tra nút sang trang. Lọc Drama và thử chuyển trang tiếp.

**Không phải** tạo Netlify mới, không phải chạy SQL, không đổi khóa Supabase, không sửa file `netlify/functions/game.mjs`.

## Dùng toàn bộ source

Nếu cần cập nhật lại cả dự án, giải nén `DOI-NAY-v0.9.1-FULL-PUBLIC.zip`, đưa **nội dung bên trong** lên repository để `build.py`, `netlify.toml`, `css`, `js`, `netlify`, `supabase` nằm ở gốc. Build command vẫn là `python3 build.py`, publish `public`.

## Ghi chú

- Trang 1 = tin mới nhất, Trang 2 = tin cũ hơn, v.v.
- 10 tin = 10 bài đăng/sự kiện, **không phải 10 năm**. Một năm nhiều sự kiện có thể nằm trên hai trang.
- Bộ lọc đổi về trang 1 để không bị mắc ở một trang trống.
- Bảng tin chính phân trang; hồi ký các kiếp trước vẫn được lưu nguyên vẹn.

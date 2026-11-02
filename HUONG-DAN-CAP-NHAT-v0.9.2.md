# ĐỜI NÀY v0.9.2 — Sự kiện theo tuổi + sửa font tiếng Việt

## Mày vừa thêm được gì?

- Đã nạp **100 biến cố từ file TXT người dùng cung cấp**, đúng **10 biến cố / mỗi tuổi từ 1 đến 10**.
- Khi nhân vật qua **tuổi 1**, game bốc **2 trong 10** sự kiện tuổi 1, không trùng nhau.
- Tuổi 2 bốc **2 trong 10** tuổi 2, … đến tuổi 10. **Không bao giờ bốc sự kiện tuổi 9 vào tuổi 2.**
- Từ tuổi 11, game quay về kho biến cố phụ mặc định. Biến cố chính có lựa chọn vẫn hoạt động như trước.
- Vì file gốc không cung cấp chỉ số tăng/giảm, các sự kiện mới **chỉ ghi nhật ký** (không tự trừ máu/IQ/tiền). Sau này có thể thêm `effect` hoặc `absurdity` vào từng dòng.
- Một số câu chuyện liên quan đến tình dục của trẻ nhỏ được đổi thành trò nghịch bựa không có yếu tố tình dục.

## Để tự thêm / sửa sự kiện đúng tuổi

Mở file `js/ageSpecificEvents.js`. Mỗi sự kiện có dạng:

```js
{ min: 3, max: 3, text: 'Câu chuyện tuổi 3...', type: 'event', weight: 1, ageSpecific: true }
```

`min` và `max` đặt **bằng nhau**, và `ageSpecific: true`. Thêm thoải mái biến cố khác vào mảng. Đừng sửa trùng ID nếu có trường `ageEventId`.

Để tạo cả nhóm sự kiện riêng cho **tuổi 11, 12, 13...**, cứ thêm các object `ageSpecific: true` với `min=max=tuổi mong muốn` vào cùng file này. Máy tự nhận tuổi mới, không phải sửa engine. Sự kiện chung cho nhiều tuổi vẫn thêm trong `js/customEvents.js`.

## Chữa lỗi font chữ có dấu

- Chuyển font tiêu đề sang **Noto Serif** hỗ trợ đầy đủ tiếng Việt; chữ thân bài dùng **Be Vietnam Pro**.
- Tăng chiều cao dòng tiêu đề lớn, tránh mất/đè dấu trên chữ in hoa.
- Có font dự phòng nếu không tải được Google Fonts: Times New Roman / Tahoma.

## Cách cập nhật website Netlify đang public

Từ bản v0.9.1, chỉ cần thêm/thay **5 file** trong GitHub:

1. **Thêm mới** `js/ageSpecificEvents.js` (đúng đường dẫn)
2. **Thay** `js/events.js`
3. **Thay** `css/style.css`
4. **Thay** `build.py`
5. **Thay** `index.html` (để tải phông Việt theo cách không chặn game khi offline)

Bấm **Commit changes**; Netlify sẽ tự chạy build theo cấu hình đã có. Không cần sửa Supabase, chạy SQL hay thay khóa bí mật. Khi site Published, tải trang bằng Ctrl+Shift+R.

**Quan trọng:** Nội dung mới xuất hiện ở những *năm được chơi sau khi cập nhật*. Những năm đã trải qua không tự viết lại trong hồi ký. Muốn thử từ tuổi 1 thì đầu thai một kiếp mới.

## Kiểm tra

- Vào game ở 0 tuổi, bấm +1 tuổi, xem 2 tin tuổi 1 và không có tin của các tuổi khác.
- Ấn đến tuổi 2 để kiểm tra 2 tin tuổi 2.
- Bật auto: 5 giây/năm, không có popup; kết quả vẫn vào nhật ký.
- Test ở điện thoại: vẫn tối đa 10 tin/trang.

# ĐỜI NÀY v0.9.3 — 1 biến cố phụ/năm + 360 sự kiện mới theo tuổi

## Bản này KHÔNG xóa file / tính năng nào

- Cơ sở: sao chép nguyên trạng thư mục v0.9.2, giữ toàn bộ các file và nguồn sự kiện cũ.
- Giữ nguyên `js/ageSpecificEvents.js` có 100 sự kiện cũ, không xóa hoặc viết đè.
- THÊM `js/newAgeEvents.js` chứa 360 sự kiện mới, mỗi tuổi 1–18 có 20 sự kiện.
- Vì vậy, tuổi 1–10 có ít nhất **30 mục riêng mỗi tuổi** (10 cũ + 20 mới); tuổi 11–18 có 20 mục mỗi tuổi.
- `CONFIG.AMBIENT_EVENTS_PER_YEAR` đổi từ **2** thành **1**. Mỗi năm bốc 1 sự kiện tự động, kể cả chế độ chạy 5 giây/năm.
- Popup biến cố có lựa chọn khi bấm `+1 tuổi` vẫn còn như trước: **không tự ý cắt chức năng**.
- Hệ thống ghi nhật ký tiến trình, 10 tin/trang, hồi ký, auto 5 giây không popup và 4 Top online không thay đổi.
- Một số nội dung nhạy cảm về người chưa thành niên hoặc tự gây hại được thay **lời thoại** cho phù hợp. Số lượng và ID vẫn giữ đủ 360, không bỏ mục nào.
- Các file `public/` được giữ trong bản FULL; `python3 build.py` sẽ tái tạo bản public khi triển khai.

## Cập nhật GitHub (các file thay đổi)

Từ v0.9.2 chỉ cần upload đúng đường dẫn những file sau:

```text
build.py
js/config.js
js/events.js
js/engine.js
js/main.js
js/ui.js
js/customEvents.js
js/ageSpecificEvents.js   (chỉ cập nhật chú thích)
js/newAgeEvents.js        (MỚI)
```

Nếu dùng bản **FULL**: upload đầy đủ mã nguồn ở gốc repository, đừng để thừa cấp thư mục.
Sau khi Commit, Netlify tự build. Không cần chỉnh Supabase SQL, khóa API, hay tên miền.
Kiểm tra trạng thái Netlify là `Published`, sau đó thử một **kiếp mới** từ tuổi 1 và đọc nhật ký.

## Nếu mày muốn sau này sửa kho tuổi

Chỉnh trong `js/newAgeEvents.js`. Mỗi mục có `min=max` theo tuổi cụ thể, `ageSpecific:true`.
Giữ `ageEventId` duy nhất. Một năm game bốc 1 biến cố phụ trong nhóm tuổi tương ứng.

## Lưu ý

Game vẫn có **sự kiện chính có lựa chọn** khi chơi thủ công, và vẫn ghi các sự kiện từ hành động/thu chi trong nhật ký. Con số 1 ở đây là **1 biến cố phụ ngẫu nhiên tự xuất hiện trong năm**, chứ không xóa các cơ chế game khác.

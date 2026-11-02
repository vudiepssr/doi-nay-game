# ĐỜI NÀY v0.9 — SỔ ĐỜI / BẢNG TIN KIẾP NÀY

> **Dành cho người đã public bản v0.7/v0.8 trên Netlify + Supabase.**
> Bản v0.9 là thay đổi **giao diện và trải nghiệm**, giữ nguyên cơ chế máy chủ và schema Supabase.

## 1. Mới có gì?

- **Hồ sơ giấy cũ:** lý lịch, ảnh 3×4, tiền, IQ điểm / 200, EQ, sức khỏe, tem đỏ và băng dán. Trên điện thoại hồ sơ **thu gọn mặc định**, bấm **Mở hồ sơ chi tiết** để đọc hết.
- **Bảng tin kiếp này:** dạng mạng xã hội theo từng tuổi (năm mới nhất đứng trên), lọc Tất cả / Drama / Vận đỏ / Đời thường. Có phản ứng **giả lập** để trang trí; không giả vờ là lượt người thật.
- **Chồng giấy hành động:** học bạ / phiếu điểm, đơn xin việc, sổ đời sống, sổ thu chi. Hành động vẫn được tính theo chỉ số và tiền trên server.
- **Cáo phó khi chết:** tổng kết tuổi, tài sản, IQ, điểm trái ngang; đọc hồi ký, đầu thai, xem Top, chia sẻ bản tóm tắt.
- **4 Top toàn quốc và Guest ID:** giữ nguyên, không yêu cầu đăng nhập.
- **Auto 5 giây/năm không popup:** giữ đúng cơ chế v0.8. Chỉ bấm +1 tuổi thủ công mới mở phiếu chọn biến cố.
- **Không đổi database, không reset dữ liệu kiếp cũ, không đụng Secret Key.**

## 2. Cập nhật website đang chạy — CHỈ THAY 4 FILE

Tải `DOI-NAY-v0.9-BAN-VA-GIAO-DIEN.zip` và giải nén. Bên trong có:

```
index.html
css/style.css
js/ui.js
js/main.js
```

Thay **đúng 4 file này** ở thư mục gốc repository GitHub mà Netlify đang dùng. Không thay `netlify/functions/game.mjs`, không thay `js/engine.js`, không thay `supabase/schema.sql`.

### Cách dễ nhất bằng GitHub Desktop (Windows)

1. Mở **GitHub Desktop**. Chọn repo của game, nhấn **Repository → Show in Explorer**.
2. Mở thư mục giải nén bản vá. Copy `index.html` vào thư mục gốc repo, chọn **Replace** nếu được hỏi.
3. Copy `css/style.css` vào thư mục `css` trong repo, chọn ghi đè.
4. Copy `js/ui.js` và `js/main.js` vào thư mục `js` trong repo, chọn ghi đè.
5. Quay lại GitHub Desktop. Kiểm tra có đúng **4 file thay đổi**, gõ commit message `Redesign So Doi v0.9`, bấm **Commit to main**, rồi **Push origin**.
6. Vào Netlify → **Deploys**: xem deploy mới. Khi hiện **Published**, mở URL website rồi tải mới bằng **Ctrl + Shift + R**. Trên điện thoại có thể làm mới tab hoặc mở tab ẩn danh để đối chiếu giao diện mới (ẩn danh sẽ không có Guest ID cũ).

### Nếu chỉ dùng trang GitHub trên trình duyệt

- Vào repo → mở từng file theo đúng đường dẫn → biểu tượng cây bút **Edit this file** → dán nội dung file v0.9 → **Commit changes**.
- Với thư mục `css`/`js`, không đặt nhầm file thành `DOI-NAY-v0.9/.../css/style.css`. File phải nằm ngay **`css/style.css`** và **`js/ui.js`**, **`js/main.js`** tại gốc repo.
- Có thể dùng **Add file → Upload files** và kéo cả thư mục, nhưng cần kiểm tra cách GitHub xử lý tên trùng. GitHub Desktop dễ ghi đè hơn.

## 3. NẾU MỚI PUBLIC LẦN ĐẦU

Dùng `DOI-NAY-v0.9-FULL-PUBLIC.zip`, giải nén và upload **nội dung thư mục** lên repo (giữ nguyên các thư mục, không tải mỗi index.html).

Trên Netlify: 
- Build command: `python3 build.py`
- Publish directory: `public`
- Functions directory: `netlify/functions` (đã có trong `netlify.toml`)
- Environment variables: `SUPABASE_URL` và `SUPABASE_SECRET_KEY` (Key nằm **chỉ** trên Netlify, **không** dán vào GitHub).
- Trên Supabase: chạy `supabase/schema.sql` **chỉ khi tạo database mới**.
- Deploy thành công, chuyển project sang Public nếu còn Private.
- Mở `https://TEN-WEB.netlify.app/api/game?view=health` để kiểm tra backend. Sau đó thử game bằng 2 trình duyệt để xem cùng 4 Top.

Hướng dẫn chi tiết hơn có trong `HUONG-DAN-PUBLIC-ONLINE.md`.

## 4. Kiểm tra trước khi chia sẻ link

- [ ] Trang đầu có **HỒ SƠ KIẾP NÀY**, **BẢNG TIN KIẾP NÀY** và **CHỒNG GIẤY CUỘC ĐỜI**.
- [ ] Trên điện thoại có nút **+ MỞ HỒ SƠ CHI TIẾT** và **hai nút thời gian cố định ở dưới**.
- [ ] Bấm **+1 TUỔI** thì mở phiếu biến cố để chọn.
- [ ] Bấm **TỰ ĐỘNG SỐNG**: 3 giây chưa tăng, khoảng 5 giây mới tăng; không bật phiếu lựa chọn; nhật ký cập nhật.
- [ ] Tab lọc bảng tin đổi kết quả. Các hành động vẫn có giới hạn 2 lần/năm.
- [ ] Mở 4 Top, hồ sơ các kiếp trước; trên web thật, danh sách Top là dữ liệu chung từ Supabase.
- [ ] Khi nhân vật chết có **THÔNG BÁO HẾT KIẾP**; xem hồi ký và đầu thai lại được.

## 5. Cách kiểm tra code

Trên máy có Python 3 và Node.js 20+:

```bash
python3 build.py
node --test tests/*.test.mjs
node test_core.cjs
python tests/browser_redesign.py
python tests/browser_online_redesign.py
python tests/browser_layout_check.py
```

Các test trình duyệt yêu cầu Python `playwright` và Chromium. `test_core.cjs` kiểm tra hồi ký/đầu thai. Các bài test backend dùng **cơ sở dữ liệu giả lập**, không thay thế kiểm tra trên Supabase thật.

## 6. Nếu bị lỗi

- **Build Failed, thiếu `css/style.css`:** GitHub thiếu thư mục `css`, upload lại đúng vị trí.
- **Mất giao diện mới:** kiểm tra 4 file đã Commit/Push, Netlify đã Published, làm mới cache.
- **Trang báo không kết nối:** kiểm tra Netlify Functions và 2 biến môi trường, xem health endpoint.
- **Top trống:** đảm bảo Supabase đã có schema và có nhân vật chết để ghi danh, không nhầm với `play.html` offline.
- **Không có popup khi tự chạy:** đó là **đúng chủ đích**. Popup chỉ có khi +1 tuổi thủ công.

**Bảo mật:** Không đăng ảnh Secret Key và không đưa file `.env` chứa key lên GitHub.

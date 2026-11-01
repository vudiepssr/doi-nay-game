# ĐỜI NÀY v0.7 — HƯỚNG DẪN PUBLIC WEB TỪ A ĐẾN Z

**Mục tiêu:** sau hướng dẫn này, bạn có 1 đường link kiểu `https://ten-game-cua-ban.netlify.app/`. Ai mở link cũng chơi, không cần đăng ký tài khoản. **Cả 4 Top (Giàu, Tuổi, Trái ngang, IQ) dùng chung Supabase**, không phải mỗi máy một bảng.

**Phù hợp:** máy tính Windows, người chưa từng triển khai website. **Không cần** cài Node.js, Python, Visual Studio Code hay thuê VPS. Tất cả làm bằng trình duyệt, trừ việc giải nén và chọn file.

> Chưa có website online được tạo sẵn. Để có URL thật, CHỦ WEBSITE phải tạo dự án Supabase + GitHub + Netlify trong tài khoản của mình. Đừng gửi mật khẩu/secret key cho người khác.

---

## A. Nhớ 3 thứ này trước khi làm

| Dịch vụ | Dùng để làm gì? | Link |
|---|---|---|
| **Supabase** | Chứa dữ liệu người chơi, kiếp đã chết, 4 Top toàn quốc | https://supabase.com/dashboard |
| **GitHub** | Chứa mã nguồn game để cập nhật phiên bản | https://github.com |
| **Netlify** | Host web và chạy máy chủ xử lý game, cấp URL `.netlify.app` | https://app.netlify.com/ |

**Ba điểm dễ nhầm:**

1. `index.html` là **website online**. Mở trên Netlify, game mới nói chuyện với database chung.
2. `play.html` là bản **chơi thử offline** trong ZIP. Đừng đưa đường dẫn này cho người chơi để tranh Top quốc gia.
3. **Không chỉ kéo `index.html` hoặc thư mục `public/` lên Netlify Drop**. Game này có backend. Cách dễ nhất và ổn nhất là **GitHub → Netlify (Import an existing project)**.

---

## B. BƯỚC 1 — Tải game, giải nén đúng cách

1. Tải file `DOI-NAY-v0.7-PUBLIC-READY.zip` được cung cấp cùng hướng dẫn này.
2. Trên Windows, tìm file ở thư mục Downloads/Tải xuống.
3. Bấm chuột phải vào ZIP → **Extract All... / Giải nén tất cả** → **Extract**.
4. Mở thư mục vừa giải nén tên `DOI-NAY-v0.7-PUBLIC`.
5. Ở ngay bên trong cần nhìn thấy những file/thư mục sau (đừng sửa nội dung):

```text
DOI-NAY-v0.7-PUBLIC/
  index.html
  netlify.toml           ← CỰC KỲ QUAN TRỌNG
  package.json
  build.py
  js/
    main.js
    events.js
    customEvents.js      ← Chỗ tự thêm sự kiện
    ...
  css/
    style.css
  netlify/
    functions/
      game.mjs           ← SERVER tính IQ, tuổi, tiền và ghi Top
  supabase/
    schema.sql           ← Tạo bảng trên Supabase
  HUONG-DAN-PUBLIC-ONLINE.md
  play.html             ← Chỉ để test OFFLINE trên máy
```

**Nếu không thấy `netlify.toml` ở cùng cấp với `index.html`, bạn đang mở sai cấp thư mục.**

---

## C. BƯỚC 2 — Tạo database Supabase

1. Mở https://supabase.com/dashboard → đăng ký/đăng nhập (có thể dùng GitHub hoặc email).
2. Trong Dashboard chọn **New project** (có thể phải tạo Organization trước).
3. Đặt tên, ví dụ: `doi-nay-online`.
4. Tạo **Database password** thật mạnh và lưu ở nơi an toàn. Password này khác **Secret API key** sắp lấy ở bước 4; đừng nhầm.
5. Chọn region gần người chơi Việt Nam, ví dụ **Singapore** nếu có; chọn gói phù hợp (có thể bắt đầu ở Free).
6. Bấm **Create new project**. Đợi dashboard báo project sẵn sàng.
7. Không cần bật Supabase Auth/Anonymous Auth trong giao diện. Bản code này **tự cấp Guest ID bằng cookie HttpOnly trên Netlify**, không cần khách đăng nhập và không cần cấu hình Supabase Auth.

**Lưu ý:** Gói Free có hạn mức; khi ít hoạt động có thể bị pause. Nếu project bị pause, game sẽ không kết nối được database cho tới khi project hoạt động lại.

---

## D. BƯỚC 3 — Chạy SQL tạo 4 Top chung

1. Trong Supabase project, thanh trái chọn **SQL Editor**.
2. Bấm **New query**.
3. Trên máy, mở file `supabase/schema.sql` bằng Notepad hoặc Visual Studio Code.
4. Nhấn **Ctrl+A** rồi **Ctrl+C** để copy **TOÀN BỘ** nội dung. Không bỏ sót đoạn cuối có `game_allow_guest_ip`.
5. Quay lại **SQL Editor**, dán bằng **Ctrl+V**.
6. Bấm **Run** (hoặc Ctrl+Enter nếu giao diện hỗ trợ).
7. Nếu chạy đúng, hiện **Success. No rows returned** hoặc thông báo chạy thành công.
8. Kiểm tra **Table Editor** (hoặc Database → Tables), sẽ thấy ít nhất 4 bảng:
   - `game_guests`
   - `game_runs`
   - `game_scores`
   - `game_guest_limits`
   - Và bảng `game_guest_ip_limits` (ngăn spam tạo khách)
9. **Chỉ chạy bản SQL này trên project mới/không có dữ liệu quan trọng.** Nếu bạn đã triển khai bản trước, tạo bản sao lưu và rà soát migration trước khi áp dụng thay đổi.

**Chưa có Top nào là bình thường.** Bảng `game_scores` sẽ có dữ liệu khi có nhân vật **chết** (không phải ngay khi mới vào game).

---

## E. BƯỚC 4 — Lấy ĐÚNG hai thông số Supabase

Trong Supabase project:

1. Để lấy URL: mở **Connect** (hoặc Project Settings → API nếu dashboard của bạn còn mục đó), tìm **Project URL** dạng:
   `https://abcdefghijk.supabase.co`
2. Để lấy Secret Key: **Settings → API Keys** → phần **Publishable and secret API keys**, chọn **Secret key** có dạng `sb_secret_...`. Nếu dashboard yêu cầu tạo Secret key, tạo một key dành riêng cho game.
3. Giữ hai giá trị trong password manager hoặc một nơi bí mật trên máy **chỉ để nhập vào Netlify ở bước 7**.

| Biến Netlify | Giá trị | Cách nhận biết |
|---|---|---|
| `SUPABASE_URL` | Project URL | Bắt đầu `https://` và kết thúc `.supabase.co` |
| `SUPABASE_SECRET_KEY` | Secret API key | Bắt đầu bằng `sb_secret_` |

**TUYỆT ĐỐI KHÔNG** chép key bí mật vào `index.html`, `js/`, `netlify.toml`, GitHub, đoạn chat hay ảnh chụp màn hình. **KHÔNG dùng** `sb_publishable_...` thay cho Secret Key: game sẽ không ghi bảng Top được. Supabase đang chuyển sang key mới, nên ưu tiên `sb_secret_...` thay vì legacy `eyJ...`.

---

## F. BƯỚC 5 — Tạo kho GitHub

1. Truy cập https://github.com/ → đăng ký/đăng nhập.
2. Bấm nút `+` (thường góc trên phải) → **New repository** hoặc vào https://github.com/new.
3. **Repository name**: ví dụ `doi-nay-game`.
4. Chọn **Private** hoặc **Public** đều được. **Private repo không có nghĩa game website phải private**; Netlify vẫn có thể phát game công khai nếu bạn cấp quyền import repo.
5. Để tránh xung đột, lúc này **không chọn** thêm README, `.gitignore`, License tự động (source đã có các file cần thiết).
6. Bấm **Create repository**.
7. Trên trang repository mới, chọn **uploading an existing file**, hoặc **Add file → Upload files**.
8. Mở thư mục `DOI-NAY-v0.7-PUBLIC` đã giải nén bằng Windows Explorer.
9. Chọn **toàn bộ NỘI DUNG bên trong thư mục** (Ctrl+A), kéo thả vào khu vực Upload files trên GitHub. **Đừng kéo thêm một cấp thư mục mẹ** khiến GitHub thành `DOI-NAY-v0.7-PUBLIC/netlify.toml` thay vì `netlify.toml` ở gốc repo.
10. Đợi upload hoàn tất. Gõ commit message `Public game v0.7` rồi chọn **Commit changes** / **Commit directly to main**.
11. Tại trang chính repository, kiểm tra các mục sau nằm ngay ở **gốc repo**:
    - `netlify.toml`
    - `index.html`
    - `build.py`
    - `js/` và `css/`
    - `netlify/functions/game.mjs`
    - `supabase/schema.sql`
12. Nếu lỡ upload nhầm thành một thư mục con: **đừng deploy vội**. Đưa nội dung ra gốc hoặc cấu hình Base Directory riêng (đối với người mới, đưa ra gốc dễ hơn).

Không upload `.env` chứa thông tin thật. Trong ZIP có `.env.example` **chỉ chứa placeholder giả**, không phải khóa của bạn. GitHub có giới hạn tải lên bằng trình duyệt (100 file/lần); bản game này ít hơn giới hạn.

---

## G. BƯỚC 6 — Import từ GitHub vào Netlify

1. Mở https://app.netlify.com/ → đăng ký/đăng nhập. Nên đăng nhập GitHub cho tiện.
2. Chọn **Add new project → Import an existing project** hoặc vào https://app.netlify.com/start và tìm phần nhập repository.
3. Chọn **GitHub** → cấp quyền truy cập nếu được hỏi.
4. Chọn repo `doi-nay-game` vừa tạo. Nếu không hiện, xem lại quyền truy cập GitHub mà Netlify đã được cấp.
5. Tại màn hình thiết lập deploy, kiểm tra:

   | Trường | Giá trị phải là |
   |---|---|
   | Base directory | Để trống / gốc repo |
   | Build command | `python3 build.py` |
   | Publish directory | `public` |
   | Functions directory | `netlify/functions` (được đặt ở `netlify.toml`) |
   | Production branch | `main` |

6. File `netlify.toml` trong repo đã cấu hình build command, publish folder và đường dẫn Functions. Nếu Netlify hiển thị các giá trị này thì giữ nguyên.
7. Bấm **Deploy** hoặc **Publish** tùy giao diện. Chờ Deploy log hoàn tất.
8. Khi deploy thành công, Netlify cấp 1 site URL ví dụ `https://doi-nay-demo-123.netlify.app` (**URL ví dụ; không phải website thật đã được tạo**).
9. Nếu mở trang mà thấy báo **Chưa kết nối được ĐỜI NÀY Online**, điều đó bình thường khi **chưa thêm 2 environment variables** ở bước 7.

**Quan trọng:** Deploy thành công frontend không có nghĩa database kết nối thành công. Phải làm thêm bước 7 và 8.

---

## H. BƯỚC 7 — Gắn Supabase vào Netlify (bắt buộc)

1. Vào **Netlify → chọn project game**.
2. Chọn **Project configuration → Environment variables** (hoặc mục tên gần tương đương, giao diện Netlify có thể đổi).
3. Chọn **Add a variable / Add environment variable**.
4. Tạo biến thứ nhất:
   - **Key:** `SUPABASE_URL`
   - **Value:** chính xác Project URL Supabase ở bước 4, ví dụ `https://abcdefghijk.supabase.co`.
5. Tạo biến thứ hai:
   - **Key:** `SUPABASE_SECRET_KEY`
   - **Value:** chính xác Secret Key bắt đầu `sb_secret_...`.
6. Nếu màn hình có tùy chọn **Scopes**, phải chọn **Functions** (hoặc **All scopes**). Đừng chỉ chọn **Builds**. Nếu có **Deploy contexts**, đảm bảo có **Production** (hoặc All contexts).
7. Khi thêm Secret Key, chọn chế độ **Secret / sensitive** nếu giao diện cho phép, để hạn chế hiển thị lại giá trị.
8. **Save**.
9. Vào **Deploys** → **Trigger deploy / Deploy project / Retry deployment** để tạo một bản deploy **mới**, vì thay đổi env cần deploy lại để Function nhận giá trị mới.
10. Chờ trạng thái cuối cùng là **Published / Production deploy successful**. Đừng gửi key bí mật cho bất cứ ai để nhờ “sửa hộ”.

> Hai biến này chỉ được đọc trong `netlify/functions/game.mjs` ở server. Frontend gửi lệnh tới `/api/game`; browser **không bao giờ** cần truy cập Supabase trực tiếp.

---

## I. BƯỚC 8 — Đặt site ở chế độ PUBLIC (dễ bị bỏ quên nhất)

Từ năm 2026, một số tài khoản/team Netlify mới mặc định project là **Private**. Site deploy thành công nhưng người ngoài vẫn có thể bị yêu cầu đăng nhập Netlify.

1. Vào Netlify project của game.
2. Tìm **Project configuration → General → Visitor access → Project visibility**.
3. Chọn **Edit visibility / Make public**.
4. Chọn **Public** cho **Production deploy**, **Save**.
5. Mở trình duyệt **Ẩn danh (Incognito)** hoặc mượn điện thoại không đăng nhập Netlify, vào URL `.netlify.app`.
6. Nếu người lạ **thấy được game mà không cần đăng nhập Netlify**, site mới thực sự public.

Tài khoản GitHub repo vẫn có thể **Private**, miễn Netlify có quyền đọc repo khi build. Còn website đang chạy Netlify phải có quyền truy cập **Public**.

---

## J. BƯỚC 9 — Test server thật bằng URL công khai

Giả sử địa chỉ Netlify **THỰC TẾ CỦA BẠN** là `https://ten-game.netlify.app`.

### Test A — Đường dẫn Health (phải test đầu tiên)

Trên trình duyệt, mở đúng URL:

```text
https://ten-game.netlify.app/api/game?view=health
```

**Thay `ten-game.netlify.app` bằng địa chỉ thật của bạn.** Nếu mọi thứ đúng, trình duyệt trả JSON tương tự:

```json
{
  "ok": true,
  "service": "doi-nay-online",
  "database": "connected",
  "leaderboards": {"rich": 0, "old": 0, "absurd": 0, "iq": 0}
}
```

Bốn số 0 nghĩa là **chưa có kiếp chết**, KHÔNG phải lỗi. Nếu thấy `ok: true`, Function đã gọi được RPC của Supabase. **Không đăng điểm giả vào Top chỉ để test** vì sẽ phá độ công bằng.

### Test B — API của bốn Top

Mở:

```text
https://ten-game.netlify.app/api/game?view=boards
```

Phải thấy JSON `ok: true`, có 4 mảng `rich`, `old`, `absurd`, `iq`.

### Test C — Vào chơi thật

1. Vào `https://ten-game.netlify.app/`.
2. Thấy giao diện ĐỜI NÀY, tên nhân vật random và tuổi 0.
3. Góc trên phải có trạng thái **🌏 Top toàn quốc**.
4. Đổi biệt danh khách, ví dụ `Trùm Nhân Phẩm`.
5. Bấm **+1 tuổi** hoặc **▶ Tự động (5s/năm)**; mỗi năm có 2 biến cố phụ và một biến cố có lựa chọn.
6. Để nhân vật sống tới lúc chết; khi chết server mới ghi `game_scores`.
7. Mở bảng Top và xem hồi ký. Kết quả xếp hạng phải giữ lại sau khi refresh trang.

### Test D — Hai người cùng bảng xếp hạng

1. Sau khi đã có ít nhất 1 nhân vật chết, mở **điện thoại khác**, ẩn danh hoặc trình duyệt khác.
2. Vào **CHÍNH CÙNG URL**.
3. Mở **🏆 Top IQ**, **Top Giàu**, **Top Tuổi Cao**, **Top Trái Ngang**.
4. Cùng một nhân vật đã chết sẽ xuất hiện giống nhau trên hai máy (nếu lọt Top 100).
5. Máy thứ 2 có Guest ID riêng; không dùng chung tiến trình chơi, nhưng **dùng chung 4 bảng Top**.

### Test E — Đảm bảo site không hiển thị điểm fake

- Không dùng `play.html` online: bản build v0.7 **không xuất bản** `/play.html`.
- Người chơi chỉ gửi hành động; server tự random đầu thai và tính các chỉ số.
- Chưa có anti-cheat tuyệt đối: bot vẫn có thể tạo nhiều lượt chơi hợp lệ, giới hạn guest IP chỉ giảm spam cơ bản.

---

## K. BƯỚC 10 — Đổi tên URL game (không phải mua domain)

1. Vào Netlify project.
2. Tìm **Project configuration / General / Project details / Change project name** hoặc nút **Make public** có gợi ý đổi tên dự án.
3. Đặt tên miền phụ ngắn, dễ nhớ, ví dụ `doi-nay-lifesim-vn` nếu chưa ai dùng.
4. Site sẽ có link kiểu `https://doi-nay-lifesim-vn.netlify.app/` (**chỉ là ví dụ**).
5. Thử lại `/api/game?view=health` trên **URL mới**.
6. Gửi link thật lên Facebook/TikTok/Discord. **Không phải** chia sẻ link Dashboard Supabase hoặc link GitHub repository.

---

## L. BƯỚC 11 — Sau này tự thêm sự kiện và cập nhật trang web

1. Trên GitHub, vào repo → thư mục `js` → chọn `customEvents.js`.
2. Bấm biểu tượng **bút chì / Edit** (nếu cần bật chế độ chỉnh sửa).
3. Thêm sự kiện vào mảng tương ứng theo file `HUONG-DAN-THEM-SU-KIEN.md`; giữ đúng dấu phẩy, ngoặc nhọn và cấu trúc JavaScript.
4. Bấm **Commit changes**.
5. Netlify liên kết với GitHub sẽ **tự deploy bản mới**; không phải tạo URL mới.
6. Sau khi deploy thành công, refresh trang game và test lại `/api/game?view=health`.
7. Kho sự kiện chạy trên server được deploy cùng bản code mới; client chỉ hiển thị các biến cố server trả về.

**Nếu sửa mã ở máy thay vì trên GitHub:** phải upload/commit source mới lên **đúng repository** đang được Netlify kết nối; sửa file trong ZIP trên máy không tự cập nhật web.

---

## M. BẢNG SỬA LỖI CỤ THỂ

| Hiện tượng | Nguyên nhân thường gặp | Cách sửa |
|---|---|---|
| Mở site bị bắt đăng nhập Netlify | Site còn **Private** | Bước 8: Project visibility → **Public** |
| Trang trắng / 404 `index.html` | Upload nhầm một cấp thư mục hoặc Publish sai | Kiểm tra `netlify.toml` ở gốc repo; build=`python3 build.py`, publish=`public`, xem Deploy logs |
| `/api/game?view=health` trả 404 HTML | Function chưa deploy | Kiểm tra `netlify/functions/game.mjs` có trong repo và build functions thành công |
| Health trả `503` và báo thiếu cấu hình | Chưa đặt env cho **Functions** | Kiểm tra `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, scopes, rồi **redeploy** |
| Health trả `503` và báo database | SQL chưa Run, sai key, project Supabase paused, sai URL | Chạy toàn bộ `schema.sql`, kiểm tra Secret Key, tình trạng Supabase và log Function |
| Health báo đang dùng Publishable Key | Dán nhầm `sb_publishable_` | Thay bằng `sb_secret_...` trong Netlify rồi deploy lại |
| Function báo quyền `permission denied` | Thiếu GRANT / SQL chạy chưa hết | Kiểm tra `schema.sql` chạy thành công đến dòng cuối và key là Secret Key |
| `Unexpected token <` / trả HTML ở API | API request bị trỏ đến static web do function thiếu | Kiểm tra deploy Functions và đường dẫn `/api/game` |
| Top vẫn rỗng dù đã chơi vài năm | Chưa có kiếp nào **chết** | Chơi tới Game Over; 1 kiếp chết mới sinh 1 bản ghi điểm |
| Hai máy thấy Top khác nhau | Đang mở **hai URL** khác nhau hoặc hai project Supabase khác nhau | Dùng chung 1 URL production và 1 database; reload Top |
| `409` “Trạng thái đã đổi ở tab khác” | Hai tab dùng chung Guest ID, đồng thời gửi lệnh | Refresh tab để lấy trạng thái server mới nhất |
| `429` “Thao tác quá nhanh” | Chặn spam request | Giảm tốc; chờ hết cửa sổ giới hạn. Không lạm dụng tự tạo Guest mới |
| Thay đổi sự kiện mà web chưa đổi | Sửa file trên máy nhưng chưa commit hoặc deploy lỗi | Commit `js/customEvents.js` lên GitHub; xem trạng thái deploy Netlify |
| Đổi máy mất danh sách kiếp | Guest ID cookie nằm ở trình duyệt cũ | Với bản không đăng nhập không thể đồng bộ danh tính qua thiết bị; thành tích Top công khai vẫn còn |
| Top từng chạy rồi hôm sau báo lỗi | Supabase Free project bị pause do ít hoạt động | Mở Supabase Dashboard kiểm tra trạng thái và khôi phục; xem quota/usage |

**Xem log backend:** vào Netlify project → **Logs** / **Functions → game** (tùy giao diện), tìm dòng `Database error`, `Game API`. Không đăng công khai log chứa khóa bí mật.

---

## N. Những hạn chế cần biết trước khi quảng bá lớn

- **Không cần login**: mỗi trình duyệt giữ cookie `HttpOnly` để tiếp tục cùng Guest ID; xóa cookie/đổi thiết bị sẽ tạo người chơi khách mới. Không thể bảo đảm lấy lại tiến trình của khách không có tài khoản.
- **Top 4 bảng toàn quốc**: mọi người trên **cùng website kết nối cùng Supabase project** dùng chung bảng xếp hạng; mỗi kiếp chết đủ điều kiện xét cả 4 bảng.
- **Top 100**: chỉ hiển thị 100 người đứng đầu ở mỗi mục. Xem thứ hạng cá nhân trên màn hình tử vong.
- **Chống gian lận**: server tự xử lý hành động, từ chối gửi IQ/tiền giả. Đã có giới hạn hành động 90/phút/guest và giới hạn tạo khách ~60/giờ/IP. **Chưa có giải pháp chống bot hoàn toàn**. Trước khi chạy chiến dịch lớn, nên bổ sung challenge/Turnstile, giám sát lạm dụng và báo cáo tên người chơi.
- **Dữ liệu**: server lưu tiến trình và hồi ký. Người chơi có thể tự xuất hồi ký. Cân nhắc chính sách quyền riêng tư, thời hạn lưu dữ liệu và cơ chế sao lưu khi vận hành thực tế.
- **Chi phí**: Netlify và Supabase có hạn mức gói miễn phí, không bảo đảm chịu tải lớn mà không phát sinh phí hoặc bị giới hạn. Theo dõi Usage/Billing ở cả hai dịch vụ.
- **Không có website đã triển khai sẵn trong ZIP**. Chỉ sau khi chủ website thực hiện các bước trên mới có URL public thật.

---

## O. Checklist cuối — chỉ phát link khi tất cả đều đạt

- [ ] GitHub repo có `netlify.toml` và `netlify/functions/game.mjs` ở đúng đường dẫn
- [ ] Supabase chạy thành công toàn bộ `schema.sql`
- [ ] Netlify Deploy báo **Published**
- [ ] Netlify `SUPABASE_URL` đúng Project URL
- [ ] Netlify `SUPABASE_SECRET_KEY` đúng **Secret Key**, scope có Functions
- [ ] Tạo deploy mới sau khi nhập env
- [ ] `https://URL-THAT/api/game?view=health` trả `ok:true`, `database:connected`
- [ ] Website visibility **Public** (ẩn danh vẫn truy cập được)
- [ ] Game chạy trên điện thoại: đầu thai, bấm tăng tuổi, tự động 5 giây
- [ ] Kiếp chết ghi vào **cả 4 bảng Top** chung
- [ ] Máy thứ hai nhìn thấy bảng Top giống máy đầu tiên
- [ ] Hồi ký kiếp cũ còn sau khi reload
- [ ] Không đăng Supabase Secret Key lên GitHub

### Các tài liệu chính thức để tự đối chiếu

- Netlify import repository: https://docs.netlify.com/manage/projects/add-new-project/
- Netlify environment variables trong Function: https://docs.netlify.com/build/functions/environment-variables/
- Netlify project visibility: https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/
- Supabase API Keys: https://supabase.com/docs/guides/getting-started/api-keys
- GitHub upload file: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

**Kết thúc:** ai có URL `.netlify.app` public đều chơi, không đăng ký; thành tích được server ghi chung khi chết, có 4 bảng Top quốc gia. Nếu đến bước nào bị lỗi, gửi ảnh trang đó và dòng lỗi **nhưng che tất cả mật khẩu/Secret Key**.

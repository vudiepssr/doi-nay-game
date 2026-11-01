# TỰ CHẾ SỰ KIỆN CHO ĐỜI NÀY — v0.5

## 1. CHỈ CẦN SỬA MỘT FILE

Mở `js/customEvents.js` bằng VS Code (hoặc trình soạn thảo văn bản).
KHÔNG phải sửa `js/engine.js` hoặc `js/events.js`.

**Có 2 danh sách:**

- `CUSTOM_AMBIENT_EVENTS`: sự kiện tự xuất hiện trong nhật ký, mỗi năm game chọn ngẫu nhiên **2** sự kiện phụ. Người chơi KHÔNG cần nhấn lựa chọn.
- `CUSTOM_CHOICE_EVENTS`: sự kiện chính có các lựa chọn; mỗi năm game chọn ngẫu nhiên **1** sự kiện chính. Chơi tự động 5 giây/năm thì game tự chọn một phương án.

Sự kiện mới tự tham gia cùng sự kiện cũ trong vòng quay random. Thêm 100–1000 sự kiện cũng chỉ cần thêm các object trong mảng tương ứng.

## 2. SỰ KIỆN TỰ CHẠY: DÁN VÀO `CUSTOM_AMBIENT_EVENTS`

```js
{
  min: 18,
  max: 70,
  text: '💩 Mày đi ỉa ở công ty thì hết giấy. Sếp gọi điện đúng lúc đang cầu cứu.',
  effect: { happiness: -5, eq: -2, cash: -20000 },
  absurdity: 8,
  type: 'bad',
  weight: 2
},
```

## 3. SỰ KIỆN CÓ LỰA CHỌN: DÁN VÀO `CUSTOM_CHOICE_EVENTS`

```js
{
  min: 18,
  max: 70,
  title: 'Sếp phát hiện đang ngủ gật',
  description: 'Mày đang gục ở bàn thì sếp đi ngang hỏi đang làm gì.',
  weight: 2,
  choices: [
    {
      label: 'Thú nhận tối qua thức khuya',
      hint: 'EQ +3, hạnh phúc -2',
      effect: { eq: 3, happiness: -2 },
      text: '😴 Sếp chỉ nhắc mày đi ngủ sớm.'
    },
    {
      label: 'Bảo đang thiền tăng hiệu suất',
      hint: 'Trái ngang +7, EQ -3',
      effect: { eq: -3 },
      text: '🧘 Sếp bảo mày thiền luôn ở phòng nhân sự.',
      absurdity: 7
    }
  ]
},
```

## 4. CÁC TRƯỜNG

| Trường | Ý nghĩa |
|---|---|
| `min`, `max` | Độ tuổi tối thiểu, tối đa được random |
| `text` | Câu nhật ký (sự kiện tự chạy) / hậu quả của phương án |
| `title`, `description` | Tên và nội dung sự kiện có lựa chọn |
| `choices` | Danh sách phương án: `label`, `hint`, `effect`, `text`, `absurdity` |
| `effect` | Mức thay đổi chỉ số. Có thể bỏ đi hoặc `{}` nếu không thay đổi |
| `absurdity` | Điểm Top Trái Ngang; có thể bỏ qua |
| `type` | Màu nhật ký: `'good'`, `'bad'`, hoặc `'event'` |
| `weight` | Trọng số random, mặc định 1. `weight: 5` dễ xuất hiện gấp 5 lần sự kiện `weight: 1` trong cùng nhóm đủ điều kiện; không phải xác suất 5% |
| `condition` | Tuỳ chọn: `p => p.intellect >= 150`, lọc nhân vật đủ điều kiện |

`effect` thường dùng:

- `cash`: tiền mặt, tính bằng VND. Ví dụ `cash: 1000000` cộng 1 triệu, `cash: -500000` trừ 500 nghìn.
- `intellect`: IQ (điểm, 0–200), ví dụ `intellect: 2`.
- `health`, `happiness`, `eq`, `skill`, `luck`: các chỉ số tương ứng.

Ví dụ một biến cố chỉ cho người có IQ 150 trở lên (đặt `condition` trong object sự kiện):

```js
condition: p => p.intellect >= 150,
```

Nên dùng `min: 18` trở lên với nội dung người lớn. Phải có dấu phẩy giữa những object sự kiện. Tránh dùng dấu `'` ở giữa chuỗi `'...'` nếu không escape, thay bằng dấu `"..."`.

## 5. LÀM SAO ĐỂ SỰ KIỆN MỚI XUẤT HIỆN TRONG GAME?

**Cách A — Chạy bản nhiều file để làm game, sửa là được:**

1. Cài Python 3 và mở terminal trong thư mục `doi-nay-lifesim`.
2. Chạy `python -m http.server 8000` (một số máy Windows dùng `py -m http.server 8000`).
3. Mở `http://localhost:8000/` trong trình duyệt. Sửa `js/customEvents.js`, lưu lại, **tải lại trang** là vòng random cập nhật.

**Cách B — Chơi bằng `play.html` một file:**

1. Sửa `js/customEvents.js`, lưu.
2. Chạy `python build.py` (Windows có thể bấm `CAP-NHAT-GAME.bat` nếu đã cài Python).
3. Mở lại `play.html`. File này là bản đóng gói nên không thể tự đọc thay đổi ở file `.js` bên ngoài nếu chưa build lại.

**Lưu ý:** Sự kiện chọn ngẫu nhiên, không phải cứ thêm là năm tiếp theo xuất hiện ngay. `weight` giúp điều chỉnh độ thường gặp. Kiếp đang chơi vẫn giữ tiến trình. Chỉ các lượt random sau khi tải lại trang mới dùng kho sự kiện mới.

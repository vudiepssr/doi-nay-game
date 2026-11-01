/**
 * FILE DÀNH RIÊNG CHO MÀY TỰ CHẾ SỰ KIỆN!
 *
 * Chỉ cần THÊM object mới vào 1 trong 2 mảng dưới đây.
 * KHÔNG cần sửa engine.js, events.js hay bất cứ logic random nào.
 *
 * Hai loại:
 *  1) CUSTOM_AMBIENT_EVENTS = sự kiện tự nổ trong nhật ký; 2 lần/năm.
 *  2) CUSTOM_CHOICE_EVENTS  = sự kiện hiện lựa chọn mỗi năm.
 *
 * Cả 2 đều tự vào vòng quay random theo min/max tuổi.
 * weight: 1 mặc định; weight: 5 nghĩa là có trọng số gấp 5 một sự kiện weight: 1.
 * effect hỗ trợ: cash (VND), intellect (điểm IQ), eq, health, happiness,
 *                 skill, luck, v.v.  Dấu + là tăng, dấu - là giảm.
 * absurdity = điểm trái ngang; type: 'good', 'bad' hoặc 'event'.
 *
 * LƯU Ý: đặt dấu phẩy giữa các object. Chuỗi có dấu ' bên trong
 * nên dùng dấu "..." hoặc escape dấu ' thành \\' để không lỗi JavaScript.
 * Sự kiện người lớn để min: 18 trở lên.
 */

export const CUSTOM_AMBIENT_EVENTS = [
  // Ví dụ 1: tự chạy, độ tuổi 18–70, tăng độ xuất hiện bằng weight.
  {
    min: 18,
    max: 70,
    text: '💨 Mày đánh rắm trong thang máy rồi giả vờ nhìn điện thoại. Camera đã quay tất cả.',
    effect: { happiness: -2, eq: -1 },
    absurdity: 7,
    type: 'bad',
    weight: 3
  },
  // Ví dụ 2: may mắn/tiền bạc.
  {
    min: 18,
    max: 90,
    text: '💵 Giặt quần cũ, mày móc ra tờ 200 nghìn mà tưởng mình vừa đào được kho báu.',
    effect: { cash: 200000, happiness: 3 },
    absurdity: 1,
    type: 'good',
    weight: 2
  },

  // THÊM SỰ KIỆN MỚI VÀO ĐÂY, ví dụ:
  // {
  //   min: 6, max: 17,
  //   text: '🤡 Mày quên làm bài tập, lên lớp nhận ngay danh hiệu thánh đãng trí.',
  //   effect: { intellect: -1, happiness: -3 },
  //   absurdity: 5,
  //   type: 'bad',
  //   weight: 1
  // },
];

export const CUSTOM_CHOICE_EVENTS = [
  // Ví dụ: biến cố yêu cầu chọn một phương án.
  {
    min: 18,
    max: 65,
    title: 'Thang máy thối um',
    description: 'Trong thang máy kín người, ai đó vừa xì hơi một phát. Tất cả đều nhìn mày.',
    weight: 2,
    choices: [
      {
        label: 'Nhận tội dù không làm',
        hint: 'EQ +3, trái ngang +6',
        effect: { eq: 3, happiness: -2 },
        text: '💨 Mày đứng ra nhận tội. Cả tòa nhà nhớ mặt mày suốt một tháng.',
        absurdity: 6
      },
      {
        label: 'Nhìn chằm chằm ông sếp',
        hint: 'Hạnh phúc +3, EQ -4',
        effect: { happiness: 3, eq: -4 },
        text: '👀 Sếp nhìn ngược lại. Hai người bắt đầu chiến tranh lạnh.',
        absurdity: 5
      }
    ]
  },

  // THÊM BIẾN CỐ CÓ LỰA CHỌN VÀO ĐÂY THEO MẪU TRÊN.
];

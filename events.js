import {CUSTOM_AMBIENT_EVENTS,CUSTOM_CHOICE_EVENTS} from './customEvents.js';
import {AGE_SPECIFIC_AMBIENT_EVENTS} from './ageSpecificEvents.js';
import {NEW_AGE_AMBIENT_EVENTS} from './newAgeEvents.js';
// Sự kiện theo tuổi, có lựa chọn thực sự ảnh hưởng các chỉ số. Có thể thêm từng object độc lập.
export const EVENTS = [
  {min:1,max:5,title:'Kẹo trên sàn nhà',description:'Một viên kẹo lăn lóc dưới gầm bàn. Mày có định kiểm tra quy tắc 5 giây?',choices:[
    {label:'Nhặt ăn, đời có mấy khi',hint:'May rủi về sức khỏe',effect:{health:-7,happiness:5},text:'🍬 Mày ăn luôn viên kẹo trên sàn. Vui miệng nhưng cái bụng bắt đầu phản đối.',absurdity:3},
    {label:'Đưa người lớn xử lý',hint:'Khôn hơn tuổi',effect:{intellect:3,eq:2},text:'🧠 Mày nhờ người lớn xử lý, cứu được hệ tiêu hóa.'}]},
  {min:1,max:6,title:'Thiên tài tô màu?',description:'Bức tranh con vịt của mày trông hơi giống... củ khoai tây.',choices:[
    {label:'Tự tin đem khoe cả nhà',hint:'EQ +5, hạnh phúc +5',effect:{eq:5,happiness:5},text:'🎨 Cả nhà khen hết lời vì không ai dám nói sự thật.'},
    {label:'Ngồi vẽ thêm một tiếng',hint:'Trí tuệ +5',effect:{intellect:5,happiness:-2},text:'🖍️ Bức tranh mới cuối cùng nhìn ra con vịt.'}]},
  {min:6,max:12,title:'Kiểm tra đột xuất',description:'Cô giáo gọi mày lên bảng. Lớp im phăng phắc.',choices:[
    {label:'Bình tĩnh giải bài',hint:'IQ +4, hạnh phúc -2',effect:{intellect:4,happiness:-2},text:'📗 Mày giải xong bài, tự nhiên thấy mình như giáo sư.'},
    {label:'Tung tuyệt chiêu "em đau bụng"',hint:'Hạnh phúc +3, EQ -3',effect:{happiness:3,eq:-3},text:'🤡 Mày thoát lên bảng nhưng bị cô ghi vào sổ đầu bài.',absurdity:4}]},
  {min:7,max:17,title:'Drama trong lớp',description:'Hai đứa bạn thân cãi nhau và đều bắt mày chọn phe.',choices:[
    {label:'Đứng ra giảng hòa',hint:'EQ +6, hạnh phúc -3',effect:{eq:6,happiness:-3},text:'🤝 Mày hòa giải thành công, hôm sau hai đứa lại giận nhau.'},
    {label:'Đi mua trà sữa xem biến',hint:'Hạnh phúc +5, tiền -60k',effect:{cash:-60000,happiness:5},text:'🧋 Mày thành khán giả VIP của drama lớp học.',absurdity:3}]},
  {min:13,max:21,title:'Crush đã thả tim!',description:'Một trái tim hiện lên dưới story của mày. Tim mày đập nhanh hơn wifi nhà hàng xóm.',choices:[
    {label:'Nhắn tin bắt chuyện',hint:'EQ +5, may mắn quyết định',effect:{eq:5,happiness:4},text:'💬 Hai đứa trò chuyện được 30 phút, mày đã nghĩ tên cho con.'},
    {label:'Giả vờ không quan tâm',hint:'Trí tuệ +2, hạnh phúc -4',effect:{intellect:2,happiness:-4},text:'🥲 Mày chờ người ta nhắn tiếp đến... hết tuần.'}]},
  {min:17,max:30,title:'Đầu tư tiền nhàn rỗi?',description:'Một ông anh trên mạng hứa kiếm tiền gấp đôi trong 24 giờ.',choices:[
    {label:'Không có bữa trưa miễn phí',hint:'Trí tuệ +4, giữ tiền',effect:{intellect:4},text:'🛡️ Mày tránh được một cú lừa kinh điển.'},
    {label:'Liều ăn nhiều!',hint:'Mất 2 triệu, độ trái ngang +10',effect:{cash:-2000000,happiness:-7},text:'💸 Ông anh biến mất cùng tiền của mày. Tài khoản thì vẫn online.',absurdity:10}]},
  {min:18,max:35,title:'Phỏng vấn bất ngờ',description:'Một công ty gửi lời mời phỏng vấn nhưng giờ hẹn là 7:00 sáng.',choices:[
    {label:'Dậy sớm đi thử sức',hint:'Kỹ năng +7, sức khỏe -3',effect:{skill:7,health:-3},text:'☕ Mày đến sớm, người phỏng vấn đến muộn.'},
    {label:'Ngủ thêm cho đời tươi',hint:'Sức khỏe +3, bỏ lỡ cơ hội',effect:{health:3,happiness:2},text:'🛌 Mày ngủ thêm. Công ty cũng không gọi lại.'}]},
  {min:20,max:50,title:'Bạn rủ mở quán cà phê',description:'Bạn thân có ý tưởng kinh doanh và một bản PowerPoint toàn hình mèo.',choices:[
    {label:'Góp 5 triệu thử sức',hint:'Tiền -5 triệu, kỹ năng +5',effect:{cash:-5000000,skill:5},text:'☕ Quán mới mở chưa thấy khách, thấy toàn bạn tới xin uống chùa.',absurdity:3},
    {label:'Xin làm khách ruột thôi',hint:'EQ +3, giữ tiền',effect:{eq:3},text:'🍰 Mày giữ được tiền và tình bạn.'}]},
  {min:18,max:60,title:'Nhặt được ví tiền',description:'Mày nhặt được chiếc ví dày cộp, bên trong có giấy tờ chủ nhân.',choices:[
    {label:'Tìm cách trả lại',hint:'EQ +6, hạnh phúc +5',effect:{eq:6,happiness:5},text:'💚 Chủ ví cảm ơn, mời mày một bữa cơm.'},
    {label:'Cầm luôn, trời cho?',hint:'Tiền +1 triệu, EQ -12',effect:{cash:1000000,eq:-12},text:'😬 Ví có tiền nhưng lương tâm lâu lâu nhắc bài.',absurdity:8}]},
  {min:25,max:55,title:'Sếp nhắn tin lúc nửa đêm',description:'Tin nhắn viết: "Em ơi, còn thức không?". Ngày mai là thứ bảy.',choices:[
    {label:'Trả lời và làm nốt',hint:'Kỹ năng +5, sức khỏe -6',effect:{skill:5,health:-6},text:'💼 Mày thức đến 2 giờ sáng. Sếp chỉ thả biểu tượng 👍.'},
    {label:'Để sáng mai tính',hint:'Sức khỏe +4, EQ -2',effect:{health:4,eq:-2},text:'📵 Mày có một giấc ngủ ngon hiếm hoi.'}]},
  {min:35,max:75,title:'Họp lớp định mệnh',description:'Bạn cũ đi xe sang, người khác khoe con giỏi. Mày được hỏi: "Dạo này sao rồi?"',choices:[
    {label:'Kể thật cuộc đời',hint:'EQ +6, hạnh phúc +3',effect:{eq:6,happiness:3},text:'🤗 Một đứa bạn cũng đang khốn khổ y như mày.'},
    {label:'Nổ nhẹ cho đỡ quê',hint:'Hạnh phúc +5, EQ -5',effect:{happiness:5,eq:-5},text:'🎤 Câu chuyện của mày có thêm vài tỷ doanh thu tưởng tượng.',absurdity:5}]},
  {min:40,max:90,title:'Chẩn đoán từ Google',description:'Mày hơi đau lưng và lỡ gõ triệu chứng lên mạng. Kết quả toàn bệnh đáng sợ.',choices:[
    {label:'Đi bác sĩ cho chắc',hint:'Mất 1 triệu, sức khỏe +8',effect:{cash:-1000000,health:8},text:'🏥 Bác sĩ bảo mày cần ngủ sớm và ngồi bớt lướt mạng.'},
    {label:'Tự kê thuốc theo mạng',hint:'Hạnh phúc -4, sức khỏe -7',effect:{health:-7,happiness:-4},text:'🫠 Mày tự dọa mình một tuần rồi cuối cùng cũng đi bác sĩ.',absurdity:6}]},
  {min:60,max:115,title:'Hội người cao tuổi rủ đi nhảy',description:'Khu phố có lớp thể dục nhịp điệu lúc 5 giờ sáng.',choices:[
    {label:'Mặc đồ thể thao tham gia',hint:'Sức khỏe +6, EQ +5',effect:{health:6,eq:5},text:'💃 Mày thành gương mặt sáng giá của đội thể dục.'},
    {label:'Ở nhà trông cây cảnh',hint:'Hạnh phúc +4, sức khỏe -2',effect:{happiness:4,health:-2},text:'🪴 Cây cảnh sống khỏe hơn mày một chút.'}]},
  {min:1,max:115,title:'Một ngày trái ngang',description:'Đang yên đang lành, cuộc đời bất ngờ gửi cho mày một bài kiểm tra nhân phẩm.',choices:[
    {label:'Cười vào mặt số phận',hint:'Hạnh phúc +6, EQ +2',effect:{happiness:6,eq:2},text:'😎 Mày vẫn cười dù mọi thứ hơi bất ổn.'},
    {label:'Rút kinh nghiệm sâu sắc',hint:'Trí tuệ +4, hạnh phúc -2',effect:{intellect:4,happiness:-2},text:'🧘 Mày nhận ra không phải chuyện gì cũng có lời giải.'}]}
];

// Các biến cố nhiều lựa chọn bổ sung: chuyện khó đỡ có hậu quả, không chặn vòng đời nếu tự chạy.
const option=(label,hint,effect,text,absurdity=0)=>({label,hint,effect,text,absurdity});
const choice=(min,max,title,description,a,b,weight=1)=>({min,max,title,description,choices:[a,b],weight});
EVENTS.push(
  choice(1,5,'Ai đánh rắm thế?','Trong phòng vang lên một tiếng "bủm". Cả nhà nhìn mày như hung thủ.',
    option('Nhận tội hộ cả nhà','EQ +3, trái ngang +3',{eq:3,happiness:-1},'💨 Mày nhận luôn. Mẹ bảo ít nhất con rất có trách nhiệm.',3),
    option('Chỉ thẳng mặt bố','Hạnh phúc +4, EQ -2',{eq:-2,happiness:4},'🤭 Bố đỏ mặt, cả nhà cười như được mùa.')),
  choice(1,5,'Bỉm nổ tung','Một cú "đánh bom" trong bỉm khiến cả nhà phải sơ tán.',
    option('Cười nắc nẻ','Hạnh phúc +5',{happiness:5},'💩 Mày ngồi cười trong khi bố đi tìm khẩu trang.',5),
    option('Khóc ăn vạ','EQ -2, sức khỏe +2',{eq:-2,health:2},'🍼 Mày ré lên như còi báo động, người lớn chạy đến thay bỉm.')),
  choice(6,12,'Đại chiến nhà vệ sinh','Vừa ngồi xuống thì phát hiện cuộn giấy đã biến mất.',
    option('Gọi cứu viện','EQ +3, trái ngang +4',{eq:3},'🧻 Mày gọi bạn cứu bằng giọng run rẩy. Cả lớp biết chuyện.',4),
    option('Chờ người đi ngang','Hạnh phúc -3, IQ +1',{happiness:-3,intellect:1},'🚽 Mày ngồi suy ngẫm nhân sinh 20 phút.')),
  choice(6,12,'Điểm 0 chói lọi','Bài kiểm tra có một con số 0 to như tương lai chưa chắc chắn.',
    option('Về học tử tế','IQ +5, vui -4',{intellect:5,happiness:-4},'📚 Mày lao vào học để lần sau không còn làm trò hề.'),
    option('Đổ tại bút hết mực','EQ -3, trái ngang +5',{eq:-3,happiness:2},'🖊️ Cô giáo hỏi sao bút hết mực mà khoanh đủ tên.',5)),
  choice(6,17,'Thánh bóc phốt trong lớp','Ảnh mày ngủ gật há miệng bị đưa lên nhóm lớp.',
    option('Tự chế meme về mình','EQ +5, vui +3',{eq:5,happiness:3},'📸 Mày biến luôn ảnh nhục thành sticker và thành huyền thoại.'),
    option('Đòi admin xóa','EQ -2, trái ngang +4',{eq:-2,happiness:-2},'💢 Càng đòi xóa, meme càng phủ sóng.',4)),
  choice(12,17,'Lộ lịch sử tìm kiếm','Mày chiếu màn hình trước lớp và quên tắt tab "cách làm giàu không cần làm".',
    option('Cười trừ cho qua','EQ +4',{eq:4},'🧑‍🏫 Cả lớp cười, cô giáo bảo mày nên tập trung thi học kỳ.'),
    option('Tắt máy giả mất điện','Trái ngang +6',{happiness:-4},'🔌 Mày giật phích cắm, quên rằng đó là laptop chạy pin.',6)),
  choice(13,17,'Đại chiến trà sữa','Mày làm đổ trà sữa lên quần ngay trước mặt crush.',
    option('Lấy khăn lau tỉnh bơ','EQ +4',{eq:4},'🧋 Crush đưa khăn giấy. Mày còn giữ cái khăn tận 3 tháng.'),
    option('Đổ tại lực hấp dẫn','Vui +2, trái ngang +5',{happiness:2},'🥤 Mày cãi nhau với định luật Newton và thua.',5)),
  choice(16,25,'Phỏng vấn CLB như đi thi hoa hậu','Ban tuyển thành viên hỏi "em có ưu điểm gì?". Đầu mày trắng như tờ giấy.',
    option('Trả lời chân thành','Kỹ năng +3, EQ +2',{skill:3,eq:2},'🎤 Mày nói mình chăm chỉ, ít nhất không ai bật cười.'),
    option('Nổ mình có 10 năm kinh nghiệm','Trái ngang +8, EQ -3',{eq:-3,happiness:-2},'🎪 Người phỏng vấn hỏi mày làm việc từ năm 6 tuổi à.',8)),
  choice(18,35,'Tin nhắn gửi nhầm người yêu cũ','Mày định gửi ảnh mèo cho bạn, lại gửi cho người yêu cũ.',
    option('Thừa nhận gửi nhầm','EQ +4, vui -2',{eq:4,happiness:-2},'🐈 Người cũ thả tim con mèo. Hết phim.'),
    option('Giả vờ đang thử tính năng','Trái ngang +5',{eq:-2,happiness:-3},'📱 Mày giải thích 17 dòng, đối phương trả lời "ừ".',5)),
  choice(18,50,'Đồng nghiệp hôi chân','Người ngồi cạnh cởi giày, mùi bốc lên như vũ khí sinh học.',
    option('Góp ý tế nhị','EQ +5',{eq:5},'🧦 Đồng nghiệp mua tất mới, văn phòng lập tức hồi sinh.'),
    option('Dùng quạt đẩy mùi','Trái ngang +7',{happiness:2,health:-1},'🌪️ Quạt đẩy thẳng sang phòng sếp, cả tầng náo loạn.',7)),
  choice(18,45,'Đám cưới người yêu cũ','Thiệp cưới gửi tới kèm câu "nhớ đến nhé".',
    option('Đến ăn cỗ bình thường','EQ +6, vui -2',{eq:6,happiness:-2},'🍗 Mày ăn bốn cái đùi gà, nhận ra đời vẫn ngon.'),
    option('Đăng story tâm trạng','EQ -4, trái ngang +5',{eq:-4,happiness:-5},'📲 Mày đăng 17 story. Mẹ hỏi có ốm không.',5)),
  choice(18,60,'Shipper giao nhầm 100 hộp bánh','Đơn của mày có một hộp, người giao mang nguyên thùng.',
    option('Trả lại hàng dư','EQ +5, may mắn +1',{eq:5,luck:1},'📦 Shipper cảm ơn rối rít, mày được tặng thêm bánh.'),
    option('Giữ bí mật mà ăn','Trái ngang +8, sức khỏe -3',{happiness:4,health:-3},'🍰 Ba ngày sau mày nhìn bánh là buồn nôn.',8)),
  choice(20,45,'Công ty tổ chức team building','Sếp bắt nhảy "con vịt" trước 300 người.',
    option('Nhảy tới bến','EQ +5, vui +5',{eq:5,happiness:5},'🦆 Video điệu nhảy của mày được cả công ty lưu giữ.'),
    option('Trốn vào nhà vệ sinh','Trái ngang +7',{happiness:3,eq:-3},'🚾 Sếp gọi tên mày ngay trên loa tổng.',7)),
  choice(21,55,'Bắt quả tang nói xấu sếp','Mày đang kể chuyện sếp thì sếp đứng ngay sau lưng.',
    option('Xin lỗi đàng hoàng','EQ +5, vui -4',{eq:5,happiness:-4},'💼 Sếp chỉ bảo "lần sau góp ý trực tiếp".'),
    option('Nói đang kể chuyện phim','Trái ngang +9, EQ -5',{eq:-5,happiness:-5},'🎬 Sếp hỏi phim tên gì. Mày bịa ngay "Sếp Và Tôi".',9)),
  choice(22,55,'Cuộc họp có thể là email','Một cuộc họp 3 tiếng chỉ để chốt màu nút bấm.',
    option('Đề xuất kết thúc sớm','Kỹ năng +3, EQ +3',{skill:3,eq:3},'📧 Cuối cùng mọi người chịu gửi email.'),
    option('Ngủ mở mắt','Sức khỏe +2, trái ngang +6',{health:2},'😴 Mày ngủ vẫn gật đúng nhịp, sếp tưởng đang đồng ý.',6)),
  choice(20,65,'Lừa đảo tình cảm cấp tốc','Người mới quen nhắn "anh/em yêu" rồi nhờ chuyển 5 triệu.',
    option('Chặn luôn','IQ +3, EQ +2',{intellect:3,eq:2},'🛡️ Mày né được cú scam, tự thưởng mình ly nước.'),
    option('Tin vào định mệnh','Tiền -5 triệu, trái ngang +12',{cash:-5000000,happiness:-8},'💸 Tình yêu bay theo số tài khoản. Đúng là vãi chưởng.',12)),
  choice(25,50,'Đi khách sạn hết nước nóng','Mày vừa gội đầu thì nước nóng tắt ngúm.',
    option('Gọi lễ tân','EQ +2',{eq:2},'🚿 Lễ tân lên xử lý, mày bớt lạnh lùng theo nghĩa đen.'),
    option('Cố tắm cho xong','Sức khỏe -3, trái ngang +4',{health:-3},'🥶 Mày run như điện thoại ở chế độ rung.',4)),
  choice(28,60,'Họ hàng hỏi lương','Đang ăn cơm, bà cô hỏi "tháng cháu kiếm được mấy chục?".',
    option('Nói đủ sống là được','EQ +4',{eq:4},'🍚 Mày đánh trống lảng bằng một bát canh.'),
    option('Khoe lương nhân mười','Trái ngang +7, vui +2',{eq:-4,happiness:2},'💰 Hôm sau họ hàng kéo tới hỏi vay tiền.',7)),
  choice(30,70,'Phát hiện nhóm chat không có mình','Mọi người trong cơ quan có nhóm chat tên "trừ đứa kia".',
    option('Bỏ qua mà sống','Vui +3, EQ +2',{happiness:3,eq:2},'🙂 Mày tiết kiệm thời gian đọc drama mỗi ngày.'),
    option('Lập nhóm "trừ cả thế giới"','Trái ngang +6',{eq:-3,happiness:3},'📵 Nhóm có đúng một người: mày.',6)),
  choice(35,75,'Hàng xóm hát karaoke 2 giờ sáng','Nhạc vang lên như gọi hồn cả khu phố.',
    option('Nhắc nhở lịch sự','EQ +5',{eq:5},'🎙️ Hàng xóm tắt nhạc, hẹn hát tiếp chiều mai.'),
    option('Bật loa đối kháng','Trái ngang +8, sức khỏe -3',{health:-3,happiness:4},'🔊 Hai nhà thi nhau hát dở, công an phường đến làm giám khảo.',8)),
  choice(40,80,'Đi khám vì đau lưng','Bác sĩ hỏi mày ngồi máy tính bao lâu. Câu trả lời khiến bác sĩ im lặng.',
    option('Chăm vận động','Sức khỏe +8',{health:8},'🧘 Mày bắt đầu tập nhẹ nhàng và bớt đau.'),
    option('Mua ghế đắt để ngắm','Tiền -3 triệu, trái ngang +4',{cash:-3000000,happiness:3},'🪑 Mày mua ghế xịn nhưng vẫn nằm trên giường làm việc.',4)),
  choice(50,90,'Lỡ bật camera họp online','Mày đang nhai bánh và gãi bụng thì camera bật.',
    option('Chào mọi người bình thản','EQ +4',{eq:4},'🎥 Mày chào xong, cả phòng nín cười.'),
    option('Đổ tại con mèo','Trái ngang +7',{eq:-2,happiness:-2},'🐱 Mọi người hỏi mèo nào biết mở camera.',7)),
  choice(60,115,'Giải vô địch cờ tướng vỉa hè','Ông hàng xóm bảo mày chỉ là "gà mờ".',
    option('Chơi tỉnh táo','IQ +2, vui +4',{intellect:2,happiness:4},'♟️ Mày thắng một ván, hàng xóm xin phục thù.'),
    option('Đánh liều như cao thủ','Trái ngang +5',{happiness:-2},'🐓 Mày thua sau 5 nước, danh hiệu gà mờ được giữ vững.',5)),
  choice(60,115,'Tranh luận chuyện cây cảnh','Hội dưỡng sinh cãi nhau xem cây nào đắt tiền nhất.',
    option('Hỏi người trồng cây','EQ +4, IQ +1',{eq:4,intellect:1},'🌱 Cuối cùng hội chuyển sang chăm cây cho khỏe.'),
    option('Khẳng định cây nhựa vô địch','Trái ngang +6, vui +2',{happiness:2},'🪴 Cả hội cạn lời, riêng mày cười hề hề.',6)),
  choice(1,115,'Nhân phẩm réo tên','Tự dưng mày cảm thấy vũ trụ đang định bày trò.',
    option('Giữ bình tĩnh','Hạnh phúc +3',{happiness:3},'🧘 Mày thở sâu, sóng gió đi qua nhẹ nhàng.'),
    option('Thách trời chơi lớn','Trái ngang +8, may mắn -2',{luck:-2,happiness:-1},'⚡ Mày thách số phận và số phận cười khẩy.',8))
);

// Biến cố phụ: tự random 1 chuyện/năm, không hiện modal, có ảnh hưởng chỉ số.
// Ngôn ngữ cố tình bựa/cà khịa. Những trò gợi dục chỉ xuất hiện ở độ tuổi trưởng thành.
const A=(min,max,text,effect={},absurdity=0,type='event',condition=null,weight=1)=>({min,max,text,effect,absurdity,type,condition,weight});
export const AMBIENT_EVENTS=[
  // 1–5: tuổi thơ quậy banh nóc
  A(1,5,'💩 Mày ị một phát long trời lở đất. Bố mẹ mở cửa sổ như chống khí độc.',{happiness:3},5),
  A(1,5,'🍼 Mày ném bình sữa trúng đầu bố. Cả nhà phong danh hiệu "xạ thủ bỉm".',{happiness:4},4),
  A(1,5,'👶 Mày ăn dặm rồi bôi cháo lên tóc bà. Bà vẫn khen cháu ngoan.',{eq:1},3),
  A(1,5,'🧷 Mày giấu chiếc tất bẩn trong hộp bánh. Ba ngày sau cả nhà phá án.',{happiness:2},4),
  A(1,5,'🦆 Mày gọi con chó là "bố". Bố thật đứng hình mất năm giây.',{eq:1},4),
  A(1,5,'🛁 Mày tè trong chậu tắm rồi vỗ tay như mới lập kỷ lục.',{happiness:2},5),
  A(1,5,'🐈 Mày kéo đuôi mèo và bị nó nhìn khinh bỉ. Bài học về ranh giới cá nhân.',{eq:2},2),
  A(1,5,'🍚 Mày úp nguyên bát cơm lên đầu. Bố bảo chắc con muốn làm đầu bếp.',{happiness:3},3),
  A(1,5,'📱 Mày nhấn nút gọi nhầm cho sếp của mẹ, mở đầu bằng tiếng khóc như báo động.',{eq:1},4),
  A(1,5,'🐤 Mày phát âm sai một từ, cả nhà ghi âm làm chuông báo thức.',{happiness:2},2),
  A(1,5,'🧸 Mày đem gấu bông đi "tắm" trong bồn cầu. Thảm họa vệ sinh cấp quốc gia.',{happiness:-1},6,'bad'),
  A(1,5,'🍭 Mày làm rớt kẹo rồi nhặt lên thổi phù phù. Vi khuẩn cười nhếch mép.',{health:-1,happiness:2},3),
  A(1,5,'🚼 Mày tự tháo bỉm chạy vòng quanh nhà, bị phát hiện qua dấu chân bùn.',{health:1},4),
  A(1,5,'🎂 Mày thổi nến sinh nhật mạnh quá khiến bánh dính mặt chú.',{happiness:3},3),
  // 6–12: trường lớp và nhà vệ sinh
  A(6,12,'🚽 Mày vào nhà vệ sinh trường mới biết hết giấy. Đây mới gọi là bài kiểm tra cuộc đời.',{happiness:-3},6,'bad'),
  A(6,12,'📖 Mày học thuộc lòng nhưng lên bảng đọc nhầm thực đơn quán cơm.',{intellect:1},4),
  A(6,12,'🧃 Hộp nước trái cây nổ trong cặp, sách vở có hương ổi suốt học kỳ.',{happiness:-2},4,'bad'),
  A(6,12,'🤡 Mày khoe biết ảo thuật rồi làm mất luôn tiền ăn sáng.',{cash:-20000},4,'bad'),
  A(6,12,'👟 Mày mang một chiếc giày đen một chiếc trắng, tự nhận là thời trang cao cấp.',{happiness:2},3),
  A(6,12,'🧹 Cả lớp trực nhật, mày lau bảng khiến phấn bay như mưa tuyết.',{skill:1},3),
  A(6,12,'🐕 Chạy trốn chó nhà hàng xóm, mày lập kỷ lục chạy nước rút mới.',{health:1},4),
  A(6,12,'🍞 Mày nhai bánh mì trong lớp, cô gọi trả lời đúng lúc miệng đầy ụ.',{eq:-1},5),
  A(6,12,'📣 Mày hét "có ma" giữa sân trường, hóa ra là áo khoác treo ngược.',{happiness:2},5),
  A(6,12,'🎒 Mày quên cặp đi học nhưng nhớ mang đồ ăn vặt. Ưu tiên rất rõ ràng.',{happiness:2,intellect:-1},4),
  A(6,12,'🥬 Mày lén bỏ rau vào bát bố, bị bắt quả tang bằng camera gia đình.',{eq:-1},4),
  A(6,12,'💤 Mày ngủ gật lúc chào cờ, giật mình vỗ tay nhầm chỗ.',{happiness:-2},5),
  A(6,12,'📐 Mày dùng thước kẻ làm kiếm, vô tình gạt đổ hộp bút của cô.',{skill:1},4),
  A(6,12,'🎨 Tranh mày được treo ở lớp. Phụ huynh hỏi sao con trâu trông giống máy giặt.',{happiness:3},3,'good'),
  A(6,12,'🎲 Mày giành chiến thắng oẳn tù tì và được làm vua lớp đúng 15 phút.',{eq:2,happiness:2},1,'good'),
  // 13–17: drama teen, không có tình tiết người lớn
  A(13,17,'📱 Mày đăng story thất tình dù chưa từng có người yêu. Bạn bè hỏi thăm rần rần.',{happiness:-1},4),
  A(13,17,'😂 Mày cười trong giờ học và bị cô hỏi "có gì vui kể cả lớp".',{eq:-2},5),
  A(13,17,'🧋 Mày hẹn crush ở quán trà sữa, đến nơi mới nhớ để ví ở nhà.',{happiness:-3},5,'bad'),
  A(13,17,'💻 Bài thuyết trình của mày mở đầu bằng tab "meme mèo hét".',{skill:1},5),
  A(13,17,'🎧 Mày đeo tai nghe hát to trong lớp mà không biết điện thoại chưa phát nhạc.',{eq:-1},6),
  A(13,17,'📸 Bạn chụp ảnh mày đang ngủ há miệng, meme lớp ra đời.',{happiness:-2},7,'bad'),
  A(13,17,'👀 Crush nhìn mày hai giây, mày suy luận ra cả một tiểu thuyết tình yêu.',{happiness:3},3),
  A(13,17,'🚴 Mày tập biểu diễn xe đạp, kết quả là diễn một cú ngã vào bụi cây.',{health:-2},6,'bad'),
  A(13,17,'🎤 Mày hát karaoke trong sinh nhật bạn, hàng xóm đi tìm nguồn tiếng kêu cứu.',{eq:1},6),
  A(13,17,'🥲 Bài kiểm tra sai một câu dễ, mày ngồi tiếc nuối như mất sổ đỏ.',{intellect:1,happiness:-1},2),
  A(13,17,'🧠 Mày phát hiện cách học hiệu quả hơn và dành thêm giờ luyện tập.',{intellect:1,skill:1},0,'good'),
  A(13,17,'🐸 Mày dùng ảnh ếch làm avatar, cả nhà tưởng tài khoản bị hack.',{happiness:2},3),
  A(13,17,'🍟 Mày ăn vụng khoai tây chiên ở thư viện. Tiếng nhai vang như tiếng sấm.',{happiness:2},3),
  A(13,17,'💬 Mày gửi "ừ" cho crush rồi ngồi phân tích ý nghĩa trong 4 tiếng.',{happiness:-2},5),
  A(13,17,'🧦 Giày ướt mưa khiến tất có mùi kinh hoàng, bạn cùng bàn xin đổi chỗ.',{eq:-1},4),
  A(13,17,'🕹️ Mày thức chơi game, sáng hôm sau mắt thâm như gấu trúc.',{health:-2,happiness:2},4),
  // 18–29: văn phòng, phòng trọ, người yêu, tiền nong
  A(18,29,'💸 Cuối tháng mày mở ví ra xem: hai hóa đơn và một giấc mơ làm giàu.',{happiness:-2},5,'bad'),
  A(18,29,'🚿 Nhà trọ mất nước đúng lúc đầu đầy dầu gội. Vãi thật, đời biết chọn giờ.',{happiness:-3},7,'bad'),
  A(18,29,'🍜 Mì gói úp lên sàn. Mày ngồi nhìn nó như nhìn cổ phiếu sập.',{happiness:-2},5,'bad'),
  A(18,29,'💌 Mày lỡ thả tim ảnh người yêu cũ từ ba năm trước. Điện thoại nóng ran.',{eq:-2},6),
  A(18,29,'📦 Mày mua khóa học làm giàu 0 đồng, phải đóng phí giữ chỗ 199k.',{cash:-199000},6,'bad'),
  A(18,29,'🎙️ Mày hát trong nhà tắm trọ, hàng xóm hỏi có cần gọi cứu thương không.',{happiness:3},5),
  A(18,29,'🍻 Bạn bè rủ đi nhậu, mày uống nước lọc nhưng vẫn phải chia tiền đều.',{cash:-150000,happiness:-2},5,'bad'),
  A(18,29,'🛵 Mày đặt xe ôm tới nhầm địa chỉ, đứng đợi như tượng đá.',{happiness:-2},4),
  A(18,29,'🪞 Mày soi gương đi phỏng vấn, phát hiện còn miếng rau dính răng.',{happiness:-1},5),
  A(18,29,'👕 Mày mặc áo trái ra đường cả buổi. Người lạ khen cá tính.',{happiness:2},4),
  A(18,29,'🧦 Đôi tất đi làm mốc meo một góc. Đồng nghiệp mở điều hòa hết cỡ.',{eq:-1},6),
  A(18,29,'🧻 Mày xé nhầm hóa đơn thay vì giấy ghi chú, kế toán đuổi theo.',{skill:1},4),
  A(18,29,'🪳 Gián bay vào phòng trọ, mày nhảy như idol K-pop dù không có nhạc.',{health:1},5),
  A(18,29,'📺 Mày học được cách thương lượng tiền lương từ một video thực tế.',{skill:2},0,'good'),
  A(18,29,'💕 Buổi hẹn hò khá ổn, cho đến khi mày gọi nhầm tên người ta.',{eq:-2,happiness:-3},7,'bad'),
  A(18,29,'🧋 Mày mua hai cốc trà sữa để an ủi bản thân. Tài khoản khóc thay.',{cash:-100000,happiness:3},2),
  A(18,29,'🎮 Mày chơi game tới 3 giờ sáng rồi tuyên bố "hôm sau ngủ sớm".',{health:-2,happiness:1},3),
  A(18,29,'🚪 Mày mở nhầm cửa nhà vệ sinh công cộng. Hai bên cùng muốn xóa ký ức.',{eq:-1},8),
  A(18,29,'📷 Camera trước mở bất ngờ, một góc mặt khiến mày suy nghĩ về nhân sinh.',{happiness:-1},5),
  A(18,29,'🧑‍💻 Mày sửa một lỗi khó trong công việc, được sếp khen đúng ba chữ.',{skill:2,happiness:3},0,'good'),
  A(18,29,'📧 Mày gửi email mà quên file đính kèm, thêm một email xin lỗi kinh điển.',{skill:1},3),
  A(18,29,'🧠 Mày hoàn thành khóa học khó, cảm giác não đã mọc thêm một nếp nhăn.',{intellect:1,skill:1},0,'good'),
  A(18,29,'🫠 Mày mở ứng dụng ngân hàng rồi tắt ngay để bảo vệ tinh thần.',{happiness:-2},5,'bad'),
  A(18,29,'🛒 Flash sale khiến mày mua món đồ "rẻ quá không thể bỏ", chưa dùng lần nào.',{cash:-700000,happiness:2},5,'bad'),
  A(18,29,'🚕 Tài xế gọi "anh/chị ơi" trong lúc mày đang đứng ngay cạnh xe.',{eq:-1},3),
  A(18,29,'🎉 Mày nhận thưởng bất ngờ, đủ mua bữa lẩu thịnh soạn.',{cash:1000000,happiness:3},0,'good'),
  // 30–59: gia đình, làm việc, lo toan
  A(30,59,'📊 Sếp gọi họp khẩn để công bố một việc lẽ ra nhắn Zalo là xong.',{happiness:-2},4,'bad'),
  A(30,59,'💩 Mày đau bụng giữa lúc kẹt xe. Thề chưa bao giờ thấy cây cầu dài thế.',{health:-1,happiness:-3},7,'bad'),
  A(30,59,'🧻 Nhà vệ sinh hết giấy đúng lúc quan trọng. Mày gọi cứu viện như đặc nhiệm.',{eq:1,happiness:-2},7),
  A(30,59,'👨‍👩‍👧 Họ hàng hỏi bao giờ mua thêm nhà. Mày hỏi lại bao giờ họ mua hộ.',{eq:-1,happiness:2},4),
  A(30,59,'🛏️ Mày ngủ gật trong cuộc họp online, mở mic đúng lúc ngáy khò khò.',{eq:-2},7),
  A(30,59,'💼 Mày gửi nhầm ảnh meme sếp vào nhóm có sếp. Cả phòng lặng như tờ.',{happiness:-4},9,'bad'),
  A(30,59,'🔑 Mày lục nhà tìm chìa khóa suốt 20 phút, hóa ra đang cầm trên tay.',{happiness:-1},4),
  A(30,59,'🎂 Bánh sinh nhật ghi sai tuổi thêm mười năm. Mày cười mà khóe mắt giật giật.',{happiness:-2},5),
  A(30,59,'🍲 Mày nấu canh mặn như nước biển, cả nhà uống nước như bị hạn hán.',{skill:1},5),
  A(30,59,'🪑 Mày ngồi ghế nhựa và nghe tiếng răng rắc. Cái ghế xin nghỉ hưu.',{health:-1},6),
  A(30,59,'🏦 Ngân hàng thông báo thu phí, mày thấy mình bị "móc túi hợp pháp".',{cash:-150000,happiness:-1},3,'bad'),
  A(30,59,'🎣 Mày đi câu cá để thư giãn, con cá lớn nhất là lời nói dối lúc về nhà.',{happiness:3},4),
  A(30,59,'💡 Mày nảy ra sáng kiến tiết kiệm chi phí sinh hoạt.',{cash:500000,skill:1},0,'good'),
  A(30,59,'🍺 Nhóm bạn nhậu tranh luận chuyện tỷ phú, người giàu nhất bàn là chủ quán.',{eq:1},4),
  A(30,59,'📱 Mày đăng nhầm ảnh chụp màn hình than phiền đồng nghiệp vào nhóm đồng nghiệp.',{eq:-3,happiness:-3},10,'bad'),
  A(30,59,'🛵 Đi giao lưu hội phụ huynh, mày bị gọi nhầm là ông/bà của chính con mình.',{happiness:-2},5),
  A(30,59,'💇 Mày cắt tóc theo ảnh người mẫu, ra về với quả đầu như chổi xể.',{happiness:-2},6),
  A(30,59,'📈 Khoản đầu tư bất ngờ tăng nhẹ, mày tự nhận là "sói già tài chính".',{cash:500000,happiness:2},2,'good'),
  A(30,59,'🦷 Mày đi lấy cao răng, nghe bác sĩ nói "cố lên" như đang thi vượt chướng ngại.',{health:2},3,'good'),
  A(30,59,'🥬 Mày quyết tâm ăn lành mạnh rồi phá kèo bằng hai xiên thịt nướng.',{health:-1,happiness:3},3),
  A(30,59,'🚗 Mày bấm khóa xe 8 lần vì không nhớ có khóa chưa.',{happiness:-1},3),
  A(30,59,'🔌 Mày rút nhầm ổ điện phòng làm việc, cả đồng nghiệp đồng loạt quay lại.',{skill:1,eq:-2},8),
  A(30,59,'📚 Mày đọc xong một cuốn sách khó, cảm giác IQ vừa được xoa dịu.',{intellect:1,happiness:2},0,'good'),
  A(30,59,'🍛 Quán cơm tăng giá, mày tuyên bố tự nấu từ mai. Mai vẫn ra quán.',{cash:-70000},4),
  A(30,59,'🏠 Mày sửa được cái vòi nước nhỏ giọt sau ba lần gọi YouTube.',{skill:2,happiness:2},0,'good'),
  A(30,59,'🧑‍🤝‍🧑 Bạn cũ rủ hợp tác "kèo chắc thắng"; mày tỉnh táo từ chối.',{intellect:1,eq:1},0,'good'),
  A(30,59,'🍗 Bữa cỗ họ hàng kéo dài 6 tiếng, câu hỏi về lương dài hơn cả bữa.',{happiness:-2},5),
  A(30,59,'📉 Giá cổ phiếu đỏ lòm, mày tắt điện thoại để giữ huyết áp.',{happiness:-2},4,'bad'),
  A(30,59,'👟 Mày quyết tâm chạy bộ, chạy được 500 mét đã muốn làm lễ nghỉ hưu.',{health:1},3,'good'),
  A(30,59,'🤬 Mày buột miệng "đéo tin được" khi hóa đơn điện tăng gấp đôi.',{happiness:-3,cash:-400000},5,'bad'),
  // 60+ chuyện tuổi già hài hước
  A(60,115,'🦷 Mày cười trong đám cưới, răng giả suýt rơi vào bát canh.',{happiness:-1},7),
  A(60,115,'🧓 Mày mắng đứa cháu chơi điện thoại nhiều, rồi lén chơi game cả tối.',{happiness:3},4),
  A(60,115,'♟️ Thua cờ tướng, mày tuyên bố do gió thổi lệch quân.',{eq:-1},4),
  A(60,115,'🎤 Mày hát karaoke nhạc trẻ, lũ cháu tưởng loa đang bị lỗi.',{happiness:3},4),
  A(60,115,'🥬 Mày đi chợ mặc cả được 2 nghìn, vui hơn hồi lĩnh thưởng tháng 13.',{cash:2000,happiness:4},0,'good'),
  A(60,115,'🌱 Mày chăm cây suốt tuần, cây mọc mạnh nhất lại là cỏ dại.',{happiness:-1},3),
  A(60,115,'🚲 Mày đạp xe thể dục, bị đứa trẻ 6 tuổi vượt qua rồi quay lại cười.',{health:2,happiness:1},3),
  A(60,115,'📱 Mày gửi nhầm sticker "haha" vào nhóm họ hàng đang thông báo chuyện buồn.',{eq:-2,happiness:-2},9,'bad'),
  A(60,115,'🪙 Mày tìm được tiền lẻ trong túi áo từ 20 năm trước, cảm giác như đào vàng.',{cash:50000,happiness:3},0,'good'),
  A(60,115,'💃 Hội dưỡng sinh kéo mày lên múa, video của mày đạt 30 nghìn lượt xem.',{eq:3,happiness:3},2,'good'),
  A(60,115,'🍵 Mày pha trà nhạt như nước lọc, vẫn có bạn đến ngồi kể chuyện cả chiều.',{eq:2,happiness:2},0,'good'),
  A(60,115,'📻 Mày mở đài buổi sáng, hàng xóm bảo giờ này mới là "báo thức của khu phố".',{happiness:2},2),
  A(60,115,'🏥 Khám định kỳ cho thấy sức khỏe ổn định nhờ chăm đi bộ.',{health:3},0,'good'),
  A(60,115,'🍲 Mày dạy cháu nấu món gia truyền, cháu cho đường vào nước mắm.',{happiness:3},4),
  A(60,115,'🧠 Mày tham gia câu lạc bộ đọc sách để giữ đầu óc minh mẫn.',{intellect:1,eq:2},0,'good'),
  A(60,115,'🧦 Mày giấu tiền trong tất rồi quên mất tất nào, huy động cả nhà tìm kho báu.',{happiness:-2},6),
  A(60,115,'🎣 Mày kể về con cá to bằng cánh cửa, đứa cháu hỏi bằng chứng đâu.',{happiness:2},3),
  A(60,115,'📸 Mày dùng filter làm trẻ lại 40 tuổi, đăng ảnh với caption "ngày xưa".',{happiness:3},4),
  // Bất kỳ tuổi nào: bất ngờ vui dở khóc dở cười
  A(1,115,'🌈 Một ngày thời tiết đẹp khiến mày thấy cuộc đời còn dễ thương.',{happiness:3},0,'good'),
  A(1,115,'🍀 Mày vô tình gặp một người tốt và được giúp đúng lúc.',{eq:2,happiness:3},0,'good'),
  A(1,115,'😵 Mày đi tìm đồ vật suốt mười phút trong khi nó nằm ngay trước mặt.',{happiness:-1},2),
  A(1,115,'🐈 Mèo hàng xóm nhìn mày như nhìn một nhân viên phục vụ thiếu chuyên nghiệp.',{happiness:1},2),
  A(1,115,'🌧️ Mày vừa giặt chăn xong thì trời đổ mưa như trút nước.',{happiness:-2},3,'bad'),
  A(1,115,'🥳 Mày được ai đó khen một câu nhỏ mà vui cả ngày.',{happiness:4},0,'good'),
  A(1,115,'😬 Mày vấp một bậc thềm giữa đám đông, giả vờ mình đang khởi động.',{eq:-1},4),
  A(1,115,'🌮 Mày ăn món mới thấy ngon bất ngờ, cuộc đời gỡ gạc được một chút.',{happiness:3},0,'good'),
  A(1,115,'🧦 Một chiếc tất biến mất khỏi máy giặt. Vũ trụ vẫn chưa giải thích.',{happiness:-1},2),
  A(1,115,'🧹 Mày dọn phòng và tìm thấy món đồ đã mất từ năm ngoái.',{happiness:2,skill:1},0,'good'),
  // Điều kiện đặc biệt; mấy chuyện hiếm không chiếm cả bảng
  A(18,115,'🏦 Tài khoản gia đình giàu có chuyển cho mày một khoản trợ cấp kín tiếng.',{cash:5000000,happiness:2},0,'good',p=>p.wealth>=86,.15),
  A(18,115,'📉 Dù sinh ra ngậm thìa vàng, mày vẫn mua hớ món đồ đắt gấp đôi giá trị.',{cash:-3000000},6,'bad',p=>p.wealth>=86,.35),
  A(6,115,'🧠 Mày giải một câu đố hóc búa trong vài giây, người quanh đó cạn lời.',{happiness:3},0,'good',p=>p.intellect>=150,.2),
  A(18,115,'🤑 Một vé số hiếm hoi trúng giải nhỏ, đủ để mày đãi bạn bè.',{cash:3000000,happiness:4},1,'good',p=>p.luck>=85,.15),
  A(18,115,'🤯 Mày lỡ gửi tin "vãi cả nồi" trong lúc chia sẻ màn hình trước khách hàng.',{eq:-4,happiness:-4},11,'bad',p=>p.job!=='Thất nghiệp tự do',.7),
  A(18,115,'🫠 Mày ăn mì gói năm bữa liên tiếp, đến gói gia vị cũng muốn nghỉ việc.',{health:-2,happiness:-2},4,'bad',p=>p.cash<1000000,.65)
];

// Tự động ghép ngân hàng sự kiện do người chơi tự viết vào kho sự kiện mặc định.
EVENTS.push(...CUSTOM_CHOICE_EVENTS);
// Ghép ở cuối để không thay đổi chỉ số index trong save đời trước.
AMBIENT_EVENTS.push(...CUSTOM_AMBIENT_EVENTS, ...AGE_SPECIFIC_AMBIENT_EVENTS, ...NEW_AGE_AMBIENT_EVENTS);

function weightedPick(items){
  const total=items.reduce((s,e)=>s+(e.weight??1),0);
  let r=Math.random()*total;
  for(const e of items){r-=(e.weight??1);if(r<0)return e;}
  return items[items.length-1];
}
export function randomAmbientEvents(player,count=1){
  player.recentAmbient??=[];
  const selected=[];
  for(let i=0;i<count;i++){
    // Từ 1 đến 18 tuổi, ưu tiên tuyệt đối tập sự kiện ĐÚNG tuổi người chơi.
    // Một tin tự động mỗi năm; từ tuổi 19 trở đi dùng kho thường.
    const hasAgePool=AMBIENT_EVENTS.some(e=>e.ageSpecific===true&&player.age>=e.min&&player.age<=e.max);
    const valid=AMBIENT_EVENTS.filter(e=>player.age>=e.min&&player.age<=e.max&&
      (!hasAgePool || e.ageSpecific===true)&&
      (!e.condition||e.condition(player))&&!selected.includes(AMBIENT_EVENTS.indexOf(e)));
    let candidates=valid.filter(e=>!player.recentAmbient.includes(AMBIENT_EVENTS.indexOf(e)));
    if(!candidates.length)candidates=valid;
    if(!candidates.length)break;
    const chosen=weightedPick(candidates),idx=AMBIENT_EVENTS.indexOf(chosen);
    selected.push(idx);player.recentAmbient.push(idx);
  }
  player.recentAmbient=player.recentAmbient.slice(-16);
  return selected.map(i=>AMBIENT_EVENTS[i]);
}

// Sự kiện có lựa chọn cũng hạn chế lặp lại nhiều năm liên tiếp.
export function randomLifeEvent(player){
  player.recentChoices??=[];
  const valid=EVENTS.filter(e=>player.age>=e.min&&player.age<=e.max&&(!e.condition||e.condition(player)));
  const fresh=valid.filter(e=>!player.recentChoices.includes(EVENTS.indexOf(e)));
  const chosen=weightedPick(fresh.length?fresh:valid);
  player.recentChoices.push(EVENTS.indexOf(chosen));
  player.recentChoices=player.recentChoices.slice(-7);
  return chosen;
}

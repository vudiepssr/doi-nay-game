import {rand,pick} from './config.js';
const mil=n=>n*1e6;
const make=(id,title,icon,description,button,options={})=>({id,title,icon,description,button,cost:0,minAge:0,...options});
export function getActions(p,category){
  if(category==='study'){
    if(p.age<6)return [
      make('babble','Tập nói & Tập đi','🍼','Rèn khả năng nói và bước đi, nền tảng cho một kiếp người.','Tập luyện',{effect:{intellect:4,health:2,eq:1},log:'🍼 Mày luyện nói, cả nhà nghe nhầm thành câu đòi thừa kế.'}),
      make('color','Tập tô màu','🎨','Phát triển trí tưởng tượng bằng những nét vẽ khó hiểu.','Tô màu',{effect:{intellect:3,happiness:5},log:'🎨 Bức tranh đầu tay được cả nhà khen là nghệ thuật trừu tượng.'}),
      make('play-blocks','Xếp hình','🧩','Chơi thông minh từ nhỏ, đỡ bị gọi là ngáo.','Xếp hình',{effect:{intellect:5,skill:2},log:'🧩 Mày xây một lâu đài rồi tự tay phá tan công trình.'}),
      make('family-story','Nghe kể chuyện','📚','Nghe chuyện cổ tích trước khi ngủ.','Nghe truyện',{effect:{eq:3,happiness:4},log:'📖 Mày nghe hết chuyện cổ tích và bắt đầu nghi ngờ logic của nàng Bạch Tuyết.'})
    ];
    if(p.age<18)return [
      make('school','Học hành chăm chỉ','🎓','Cắm đầu học, hy vọng tương lai không phải ăn mì gói.','Học bài',{effect:{intellect:7,skill:2,happiness:-3},log:'📚 Mày học cật lực, đầu như máy tính sắp cháy.'}),
      make('read','Đọc Sách & Tự Học','📗','Tăng trí tuệ mỗi ngày, không sợ bị gọi là học vẹt.','Mua sách (-200k)',{cost:200000,effect:{intellect:5,happiness:2},log:'📕 Mày mua sách. Lần này còn đọc thật chứ không chỉ chụp ảnh đăng story.'}),
      make('club','Tham Gia Câu Lạc Bộ','🎭','Luyện khả năng giao tiếp, mở rộng mối quan hệ.','Tham gia',{effect:{eq:7,happiness:3},log:'🎭 Mày gia nhập câu lạc bộ và nhận ra họp nhóm cũng là một môn thể thao.'}),
      make('sport-teen','Tập Thể Thao','🏃','Rèn sức khỏe, không phải chỉ biết nằm lướt mạng.','Tập luyện',{effect:{health:7,happiness:3},log:'🏃 Mày chịu đi vận động thay vì lăn trên giường.'})
    ];
    return [
      make('university','Học Đại Học','🎓','Tốn 40 triệu/năm. Tăng mạnh Trí Tuệ & Kỹ Năng.','Đăng ký học (-40 Triệu)',{cost:mil(40),effect:{intellect:13,skill:13,happiness:-4},featured:true,log:'🎓 Mày đóng học phí đại học. Kiến thức vào đầu, tiền ra khỏi ví.'}),
      make('course','Khóa Học Ngắn Hạn','🏅','Tốn 10 triệu. Tăng kỹ năng chuyên môn nhanh chóng.','Đăng ký (-10 Triệu)',{cost:mil(10),effect:{skill:10,intellect:3},log:'🏅 Mày học một khóa ngắn hạn và có chứng chỉ khoe trên mạng.'}),
      make('read-adult','Đọc Sách & Tự Học','📗','Tốn ít tiền (500k). Tăng chút Trí Tuệ và Hạnh Phúc.','Mua sách (-500k)',{cost:500000,effect:{intellect:5,happiness:3},log:'📚 Mày đọc hết một quyển sách mà không ngủ gật, một kỳ tích.'}),
      make('gym','Tập Gym / Thể Thao','🏋️','Tốn 5 triệu/năm. Tăng Sức Khỏe và Hạnh Phúc.','Đăng ký Gym (-5 Triệu)',{cost:mil(5),effect:{health:11,happiness:5},log:'💪 Mày tập gym chăm chỉ, cơ bắp chưa thấy nhưng story thì có đủ.'})
    ];
  }
  if(category==='work'){
    if(p.age<16)return [
      make('chores','Làm việc nhà','🧹','Phụ bố mẹ và học cách chăm sóc bản thân.','Làm việc nhà',{effect:{skill:3,eq:2,happiness:-1},log:'🧹 Mày quét nhà. Mẹ vẫn bảo còn bụi dưới gầm bàn.'}),
      make('help-shop','Phụ bán hàng','🛒','Học kinh doanh từ những việc nhỏ.','Phụ việc',{effect:{skill:4,eq:3,cash:50000},log:'🛍️ Mày phụ bán hàng và được thưởng 50k, cảm giác như doanh nhân.'}),
      make('learn-craft','Tập kỹ năng thực tế','🛠️','Làm đồ thủ công, sửa đồ và học tự lập.','Luyện kỹ năng',{effect:{skill:6,intellect:2},log:'🛠️ Mày học sửa đồ, cuối cùng có một chiếc quạt quay ngược.'}),
      make('dream-job','Tìm nghề mơ ước','🚀','Mơ ước làm phi hành gia, ca sĩ hay chủ tịch.','Lên kế hoạch',{effect:{happiness:4,intellect:2},log:'🚀 Mày vẽ kế hoạch làm tỷ phú vào năm 20 tuổi.'})
    ];
    if(p.age<18)return [
      make('part-time-teen','Làm Thêm Cuối Tuần','🛵','Kiếm 1,5 triệu, đổi bằng chút sức khỏe.','Làm thêm (+1,5 Triệu)',{effect:{cash:mil(1.5),skill:3,health:-2},log:'🛵 Mày nhận làm thêm và biết giá trị của một ngày cuối tuần.'}),
      make('intern-teen','Tập Sự Không Lương','💼','Học kinh nghiệm trong môi trường chuyên nghiệp.','Xin thực tập',{effect:{skill:7,happiness:-2},log:'💼 Mày thực tập không lương, được trả bằng "kinh nghiệm quý báu".'}),
      make('sell-used','Bán Đồ Cũ','📦','Thanh lý đồ không dùng, lấy tiền tiêu vặt.','Bán đồ (+500k)',{effect:{cash:500000,happiness:1},log:'📦 Mày bán vài món cũ và phát hiện nhà mình nhiều thứ linh tinh.'}),
      make('side-hustle','Học Làm Freelancer','💻','Rèn kỹ năng tự kiếm tiền trên mạng.','Bắt đầu',{effect:{skill:5,intellect:2},log:'💻 Mày tạo hồ sơ freelancer, ngày đầu có 0 khách nhưng 3 lượt xem.'})
    ];
    return [
      make('job','Xin Việc / Đổi Việc','💼',`Việc hiện tại: ${p.job}. Kỹ năng cao dễ nhận lương tốt hơn.`,'Gửi CV đi phỏng vấn',{apply: q=>{
        const success=Math.random() < Math.min(.95,.52+(q.skill+q.intellect)/500);
        if(!success)return {effect:{happiness:-3,skill:2},log:'📩 Nhà tuyển dụng cảm ơn vì đã quan tâm, rồi mất hút như người yêu cũ.',absurdity:2};
        const base=rand(7,13)*mil(12);
        const salary=base+Math.round(q.skill*mil(.75))+Math.round(q.intellect*mil(.25));
        const old=q.salary; q.salary=Math.max(old,salary);q.job=pick(['Nhân viên văn phòng','Lập trình viên','Chuyên viên kinh doanh','Nhân viên marketing','Chuyên viên vận hành']);
        return {effect:{skill:4,happiness:5},log:`💼 Mày được nhận làm ${q.job}, thu nhập ${Math.round(q.salary/1e6)} triệu/năm.`};
      }}),
      make('overtime','Làm Thêm / Freelance','💻','Tăng thu nhập ngay, bớt thời gian nghỉ ngơi.','Cày thêm (+4 Triệu)',{effect:{cash:mil(4),health:-4,happiness:-2,skill:3},log:'💻 Mày cày thêm việc tới khuya, kiếm được 4 triệu và một đôi mắt thâm.'}),
      make('startup','Khởi Nghiệp','🚀','Bỏ vốn 50 triệu. Cơ hội đổi đời hoặc ăn mì gói.','Mở công ty (-50 Triệu)',{cost:mil(50),apply:q=>{
        if(Math.random() < .32+q.skill/300+q.luck/500){q.job='Chủ doanh nghiệp';q.salary=Math.max(q.salary,rand(180,600)*1e6);return {effect:{happiness:13,skill:8},log:'🚀 Công ty bắt đầu có khách. Mày lên chức CEO, tự phong cũng được!'};}
        return {effect:{health:-7,happiness:-14,skill:7},log:'📉 Startup thất bại. Mày thành chuyên gia kể chuyện khởi nghiệp.',absurdity:12};
      }}),
      make('resign','Nghỉ Việc Xả Hơi','🌴','Bỏ lương cố định để đổi lấy tự do tinh thần.','Nộp đơn nghỉ việc',{disabledWhen:q=>q.salary===0,apply:q=>{q.salary=0;q.job='Thất nghiệp tự do';return {effect:{happiness:12,health:5},log:'🌴 Mày nghỉ việc. Sáng thứ hai tự do nhưng tài khoản hơi run.'};}})
    ];
  }
  if(category==='life'){
    const child=p.age<18;
    return [
      child?make('play','Vui Chơi Cùng Bạn','🪁','Thỏa sức quậy phá, tuổi thơ có một lần.','Đi chơi',{effect:{happiness:9,eq:4,health:2},log:'🪁 Mày đi chơi với bạn và về nhà với đôi dép bám đầy bùn.'}):make('travel','Đi Du Lịch','✈️','Tiêu 8 triệu để đổi lấy kỷ niệm và ảnh sống ảo.','Xách ba lô (-8 Triệu)',{cost:mil(8),effect:{happiness:14,health:2,eq:3},log:'✈️ Mày đi du lịch, chụp 400 ảnh và đăng 2 tấm.'}),
      make('family','Ở Bên Gia Đình','🏠','Dành thời gian cho những người thật sự quan trọng.','Quây quần',{effect:{happiness:8,eq:5},log:'🏠 Mày dành thời gian cho gia đình, phát hiện mọi người cũng có drama riêng.'}),
      child?make('sleep','Ngủ Đủ Giấc','😴','Hồi sức bằng cách ngủ một giấc ngon.','Đi ngủ sớm',{effect:{health:7,happiness:4},log:'😴 Mày ngủ đủ giấc và dậy như người được hồi sinh (chỉ là cảm giác).'}):make('romance','Hẹn Hò / Tìm Người Yêu','💕','Dũng cảm mở cửa trái tim. Cưới xin cũng là random.','Đi hẹn hò (-2 Triệu)',{cost:mil(2),apply:q=>{
        if(q.marriage==='Đã kết hôn')return {effect:{happiness:8,eq:3},log:'💞 Mày hâm nóng tình cảm với người bạn đời.'};
        if(Math.random()<.22+q.eq/250){q.marriage='Đang hẹn hò';return {effect:{happiness:12,eq:4},log:'💘 Buổi hẹn thành công! Cuối cùng cũng có người chịu nghe mày kể chuyện.'};}
        return {effect:{happiness:-4,eq:3},log:'🥀 Người ta bảo "chúng mình hợp làm bạn hơn".',absurdity:3};
      }}),
      make('doctor','Khám Sức Khỏe','❤️','Khám tổng quát và chăm sóc bản thân.','Khám bệnh (-1 Triệu)',{cost:mil(1),effect:{health:11,happiness:2},log:'🩺 Bác sĩ bảo vẫn cứu được, nhưng nhớ ngủ sớm.'}),
      ...(!child?[
        make('marry','Kết Hôn','💍','Nếu đã có người yêu, hai người có thể tiến tới hôn nhân.','Tổ chức cưới (-30 Triệu)',{cost:mil(30),disabledWhen:q=>q.marriage!=='Đang hẹn hò'||q.age<20,apply:q=>{q.marriage='Đã kết hôn';return {effect:{happiness:14,eq:4},log:'💍 Hai người chính thức cưới nhau! Họ hàng đã sẵn sàng hỏi bao giờ có con.'};}}),
        make('children','Sinh Con','🧸','Gia đình thêm thành viên, trách nhiệm và chi phí cũng tăng.','Đón con chào đời (-8 Triệu)',{cost:mil(8),disabledWhen:q=>q.marriage!=='Đã kết hôn'||q.age<20||q.age>55||q.children>=4,apply:q=>{q.children++;return {effect:{happiness:12,health:-4},log:'🧸 Gia đình đón thêm một em bé. Từ nay giấc ngủ là thứ xa xỉ.'};}}),
        make('buy-house','Mua Nhà Riêng','🏡','Một căn nhà giá 350 triệu. Không còn phải đi ở trọ.','Mua nhà (-350 Triệu)',{cost:mil(350),disabledWhen:q=>q.house==='Nhà riêng',apply:q=>{q.house='Nhà riêng';return {effect:{happiness:15},log:'🏡 Mày mua được nhà riêng. Thoát kiếp thuê trọ, gia nhập hội đóng tiền sửa ống nước.'};}}),
        make('buy-car','Mua Ô Tô','🚗','Tậu xe giá 90 triệu. Tiện đi lại, khoe nhẹ với họ hàng.','Mua xe (-90 Triệu)',{cost:mil(90),disabledWhen:q=>q.vehicle==='Ô tô',apply:q=>{q.vehicle='Ô tô';return {effect:{happiness:8},log:'🚗 Mày tậu một chiếc ô tô. Từ nay có thêm sở thích đi rửa xe.'};}})
      ]:[])
    ];
  }
  if(category==='finance'){
    if(p.age<16)return [
      make('piggy','Bỏ Ống Heo','🐷','Để dành tiền mua thứ mình thích.','Tiết kiệm',{effect:{cash:100000,skill:1},log:'🐷 Mày nhận lì xì và bỏ ống heo được 100k.'}),
      make('learn-money','Học Cách Dùng Tiền','🧮','Nắm các khái niệm tiêu và tiết kiệm.','Học tài chính',{effect:{intellect:5,skill:2},log:'🧮 Mày học rằng tiền không mọc từ cây, kể cả cây ATM.'}),
      make('help-parents','Giúp Nhà Quản Chi','🛍️','Giúp bố mẹ ghi chép chi tiêu.','Ghi sổ',{effect:{skill:4,eq:2},log:'🛍️ Mày ghi chi tiêu và phát hiện tiền trà sữa của nhà hơi nhiều.'}),
      make('money-wish','Ước Làm Tỷ Phú','🌟','Không tốn tiền. Chỉ tốn niềm tin.','Ước thật mạnh',{effect:{happiness:4},log:'🌟 Mày ước trở thành tỷ phú. Vũ trụ đã xem nhưng chưa trả lời.'})
    ];
    return [
      make('invest','Gửi Tiết Kiệm / Đầu Tư','📈','Bỏ 5 triệu vào danh mục. Giá trị lên xuống theo từng năm.','Đầu tư (-5 Triệu)',{cost:mil(5),apply:q=>{q.invested+=mil(5);return {effect:{intellect:2},log:'📈 Mày bỏ 5 triệu vào danh mục. Từ nay mỗi lần xem thị trường đều thót tim.'};}}),
      make('withdraw','Rút Tiền Đầu Tư','🏦','Rút tối đa 5 triệu từ danh mục đang nắm giữ.','Rút về ví (+tối đa 5 Triệu)',{disabledWhen:q=>q.invested<=0,apply:q=>{const amount=Math.min(mil(5),q.invested);q.invested-=amount;q.cash+=amount;return {log:`🏦 Mày rút ${Math.round(amount/1e5)/10} triệu từ khoản đầu tư.`};}}),
      make('lottery','Thử Vận May','🍀','Mua vé số 200k. Trúng lớn thì cả xóm biết.','Mua vé (-200k)',{cost:200000,apply:q=>{
        if(Math.random()<.005+q.luck/2000){const prize=rand(100,500)*1e6;q.cash+=prize;q.wonLottery=true;return {effect:{happiness:25},log:`🎉 TRÚNG SỐ! Mày đút túi ${Math.round(prize/1e6)} triệu. Họ hàng bỗng rất thân!`,absurdity:8};}
        return {effect:{happiness:-2},log:'🎟️ Vé số không trúng. Mày tài trợ cho giấc mơ của người khác.',absurdity:2};
      }}),
      make('charity','Làm Từ Thiện','🤲','Cho đi 1 triệu, tăng kết nối và sự hài lòng.','Quyên góp (-1 Triệu)',{cost:mil(1),effect:{eq:6,happiness:6},log:'🤲 Mày quyên góp một phần tiền để giúp người khác.'})
    ];
  }
  return [];
}

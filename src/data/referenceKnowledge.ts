export interface KnowledgeTopic {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  contentMarkdown: string;
  keyTakeaways: string[];
}

export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: 'core-concept',
    title: '1. Bản Chất Xét Nghiệm: Dấu Ấn Tổn Thương vs Chức Năng Gan Thực Sự',
    category: 'Nền tảng',
    readTime: '4 phút',
    summary: 'Phân định rạch ròi giữa "Liver Chemistries" (chỉ thị vị trí và mức độ hoại tử tế bào gan/ứ mật) và "True Liver Function Tests" (đo lường năng lực tổng hợp và bài tiết thực chất của gan).',
    contentMarkdown: `### "Liver Function Tests" - Một Thuật Ngữ Chưa Hoàn Toàn Chính Xác
Trong thực hành lâm sàng hàng ngày, xét nghiệm bộ sinh hóa gan thường được gọi chung là "xét nghiệm chức năng gan" (LFTs). Tuy nhiên, theo các hướng dẫn chính thức từ Hội Tiêu hóa Hoa Kỳ (**ACG 2017**) và Tổ chức Y tế Thế giới (**WHO**):
* **ALT (Alanine Aminotransferase) & AST (Aspartate Aminotransferase)**: Không hề phản ánh chức năng hoạt động của gan, mà là **chỉ thị hoại tử / rò rỉ màng tế bào gan** (markers of hepatocellular injury or death). Nồng độ men gan có thể tăng vọt trong khi chức năng chuyển hóa của gan vẫn còn nguyên vẹn; ngược lại, ở giai đoạn xơ gan mất bù giai đoạn cuối, tế bào gan bị teo xơ kiệt quệ thì men gan có thể chỉ ở mức bình thường hoặc tăng nhẹ.
* **ALP (Alkaline Phosphatase) & GGT (Gamma-Glutamyl Transferase)**: Là các enzyme gắn trên màng vi quản mật, đóng vai trò **chỉ thị tổn thương biểu mô đường mật và hội chứng ứ mật** (markers of cholestasis and biliary epithelial injury).
* **Xét nghiệm chức năng thực sự (True Tests of Hepatic Function)**:
  1. **Năng lực tổng hợp Protein (Synthetic Capacity)**: Đo lường qua nồng độ **Albumin huyết thanh** (thời gian bán thải t½ ~ 21 ngày) và **Thời gian Prothrombin / INR** (phản ánh các yếu tố đông máu chu kỳ ngắn, đặc biệt Yếu tố VII t½ ~ 6 giờ).
  2. **Năng lực chuyển hóa và bài tiết (Excretory Capacity)**: Đo lường qua khả năng liên hợp và bài tiết **Bilirubin** vào đường mật.`,
    keyTakeaways: [
      'Men gan cao không đồng nghĩa với suy gan; men gan bình thường không loại trừ xơ gan tiến triển.',
      'Albumin và PT/INR là hai thước đo chuẩn xác nhất về khả năng tổng hợp của gan trên lâm sàng.',
      'Bilirubin và Albumin chịu ảnh hưởng của các yếu tố ngoài gan (như dinh dưỡng, thận, tán huyết) nên phải phân tích trong tổng thể bệnh cảnh.'
    ]
  },
  {
    id: 'microscopic-anatomy',
    title: '2. Giải Phẫu Vi Thể & Dòng Chảy Huyết Học Tiểu Thùy Gan',
    category: 'Giải phẫu & Sinh lý',
    readTime: '5 phút',
    summary: 'Cấu trúc hình lục giác của tiểu thùy gan, bộ ba khoảng cửa, mạng xoang gan và định hướng tổn thương theo các vùng Rappaport (Zone 1, 2, 3).',
    contentMarkdown: `### Kiến trúc tiểu thùy gan (Hepatic Lobule)
Mỗi tiểu thùy gan là một cấu trúc hình lăng trụ 5-6 cạnh (penta- to hexagonal), ở mỗi góc là một **Bộ ba khoảng cửa (Portal tract)** bao gồm:
* Nhánh của **Tĩnh mạch cửa (Portal vein)**: đưa máu giàu dưỡng chất từ đường tiêu hóa về gan.
* Nhánh của **Động mạch gan (Hepatic artery)**: cung cấp máu giàu oxy.
* Nhánh của **Ống mật (Bile duct)**: dẫn lưu dịch mật được tiết từ tế bào gan.

Ở trung tâm mỗi tiểu thùy là **Tĩnh mạch trung tâm tiểu thùy (Central vein)**, máu từ các xoang gan sẽ đổ về đây trước khi hợp lưu vào tĩnh mạch gan và tĩnh mạch chủ dưới.

### Chiều dòng chảy và sinh lý học trao đổi chất
* **Dòng chảy của máu**: Đi từ các góc (khoảng cửa) hướng tâm về phía tĩnh mạch trung tâm tiểu thùy. Dòng máu trong xoang gan chảy chậm với áp lực thấp, tạo điều kiện tối đa cho sự tiếp xúc giữa huyết tương và bề mặt tế bào gan qua **Khoảng Disse**.
* **Dòng chảy của dịch mật**: Ngược chiều với dòng máu! Dịch mật do tế bào gan chế tiết được đổ vào các **Vi quản mật (Bile canaliculi)** nằm xen kẽ giữa các bè tế bào gan, sau đó chảy ly tâm về các ống mật tại khoảng cửa.

### Phân vùng chức năng (Rappaport Acinus) và tính nhạy cảm tổn thương:
* **Zone 1 (Quanh khoảng cửa - Periportal)**: Nhận máu giàu oxy và chất dinh dưỡng đầu tiên. Tế bào gan ở đây có hoạt tính tổng hợp protein, tân tạo đường và chu trình urê cao. Nhạy cảm nhất với độc chất trực tiếp từ ruột.
* **Zone 3 (Quanh tĩnh mạch trung tâm - Perivenular / Centrilobular)**: Xa nguồn cấp máu giàu oxy nhất, phân áp oxy thấp nhất. Tế bào tại đây giàu enzym Cytochrome P450 (CYP2E1), chuyên phụ trách chuyển hóa độc chất và lipogenesis.
  * **Hệ quả lâm sàng**: Vùng Zone 3 là nơi **dễ bị tổn thương nhất khi tụt huyết áp / thiếu máu cục bộ (Shock Liver)** và là vị trí chịu ảnh hưởng nặng nề nhất do độc chất chuyển hóa như **Paracetamol (NAPQI)** hoặc viêm gan do rượu.`,
    keyTakeaways: [
      'Máu chảy hướng tâm (từ khoảng cửa vào tĩnh mạch trung tâm), dịch mật chảy ly tâm (ngược chiều).',
      'Vùng Zone 3 nhạy cảm nhất với thiếu oxy (sốc gan) và độc chất chuyển hóa P450 (Paracetamol, rượu).'
    ]
  },
  {
    id: 'de-ritis-ratio',
    title: '3. Chuyên Đề Tỷ Số De Ritis (AST/ALT): 50 Năm Vững Vàng Giá Trị Lâm Sàng',
    category: 'Men gan hoại tử',
    readTime: '6 phút',
    summary: 'Nghiên cứu kinh điển của Fernando De Ritis (1957) và tổng kết từ Ken Sikaris: Vị trí bào tương vs ty thể, thời gian bán hủy t½ và ngưỡng quyết định lâm sàng.',
    contentMarkdown: `### Nguồn gốc tế bào học của ALT và AST
* **ALT (Alanine Aminotransferase / SGPT)**: 
  * Định vị **chỉ trong bào tương (Cytosol)** của tế bào gan.
  * Tính đặc hiệu gan rất cao (trong gan nồng độ 2850 U/g, cơ vân chỉ 300 U/g).
  * Thời gian bán hủy dài: **t½ ~ 47 ± 10 giờ** (~2 ngày).
  * Vì nằm ở bào tương, chỉ cần tổn thương vi mô hoặc thay đổi tính thấm màng tế bào, ALT đã dễ dàng rò rỉ ra máu.
* **AST (Aspartate Aminotransferase / SGOT)**:
  * Tồn tại ở 2 dạng isoenzyme: **80% nằm trong ty thể (mAST)** và **20% nằm trong bào tương (cAST)**.
  * Phân bố rộng ở nhiều mô: Tim (7800 U/g), Cơ vân (5000 U/g), Thận (4500 U/g), Não và Hồng cầu.
  * Thời gian bán hủy ngắn: **t½ ~ 17 ± 5 giờ** (bị thực bào qua tế bào nội mô xoang gan nhanh gấp đôi ALT).

### Diễn giải tỷ số De Ritis (AST/ALT) theo bối cảnh lâm sàng:
| Tỷ số De Ritis | Bệnh lý đặc trưng | Cơ chế sinh hóa giải thích |
|---|---|---|
| **< 1.0** (0.5 - 0.7) | Viêm gan virus cấp (A, B, C, E), Thoái hóa mỡ gan (MASLD) | ALT rò rỉ nhiều từ bào tương và thanh thải chậm (t½ dài hơn AST gấp gần 3 lần), nồng độ ALT duy trì cao hơn trong máu. |
| **> 1.5 - 2.0** (trong viêm gan virus cấp) | Viêm gan tối cấp / Suy gan bùng phát | Đột ngột phá hủy sâu tới tận ty thể; tỷ số >1.5 ở bệnh nhân viêm gan cấp báo hiệu nguy cơ tử vong tăng 40 lần (Botros & Sikaris 2013). |
| **> 2.0** (AST < 400 U/L) | Viêm gan do rượu (Alcoholic Hepatitis) | (1) Cồn gây độc trực tiếp màng ty thể giải phóng mAST; (2) Thiếu Pyridoxine (B6) ở người nghiện rượu làm ức chế tổng hợp ALT mạnh hơn AST; (3) Giảm thanh thải AST qua xoang gan. |
| **> 1.0** (trong bệnh mạn tính) | Xơ hóa gan tiến triển / Xơ gan (F3 - F4) | Sự xơ hóa làm đảo lộn cấu trúc xoang gan, giảm bắt giữ và thanh thải AST; là thành phần then chốt trong công thức FIB-4 và APRI. |
| **> 3.0 - 5.0** (AST tăng vọt) | Tiêu cơ vân / Chấn thương cơ / Nhồi máu cơ tim | Cơ bắp chứa lượng AST khổng lồ (tỷ lệ AST/ALT mô cơ là 17:1). Kiểm tra ngay Creatine Kinase (CK) để tránh nhầm với bệnh gan. |
| **> 1.0 kèm ALP thấp dị thường** | Bệnh Wilson (Wilson Disease) | Ion đồng lắng đọng phá hủy ty thể đồng thời ức chế cạnh tranh với ion kẽm của enzyme Phosphatase kiềm (ALP). |`,
    keyTakeaways: [
      'AST:ALT > 2:1 là chỉ dấu kinh điển của viêm gan do rượu, nhưng giá trị tuyệt đối của AST hiếm khi quá 400 U/L.',
      'Viêm gan virus cấp điển hình có De Ritis < 1.0; nếu De Ritis đảo chiều > 1.5 thì phải cảnh giác nguy cơ suy gan bùng phát.',
      'AST tăng đơn độc hoặc AST >> ALT luôn luôn phải loại trừ tổn thương cơ (bằng xét nghiệm CK) hoặc mẫu máu vỡ hồng cầu.'
    ]
  },
  {
    id: 'cholestasis-approach',
    title: '4. Tiếp Cận Hội Chứng Ứ Mật (ALP & GGT) & Tỷ Số R-Ratio',
    category: 'Ứ mật & Đường mật',
    readTime: '5 phút',
    summary: 'Cách sử dụng chỉ số R-ratio chuẩn ACG để phân loại tổn thương gan, xác minh nguồn gốc của ALP bằng GGT, và vai trò của chẩn đoán hình ảnh.',
    contentMarkdown: `### Chỉ số R-ratio (R-value) theo ACG & DILIN
Để phân biệt chính xác kiểu tổn thương tế bào gan hay ứ mật, hiệp hội ACG khuyến cáo sử dụng **chỉ số R**:
$$\\text{R} = \\frac{\\text{ALT} / \\text{ULN}_{\\text{ALT}}}{\\text{ALP} / \\text{ULN}_{\\text{ALP}}}$$
* **R > 5.0**: **Tổn thương tế bào gan (Hepatocellular pattern)** - Điển hình: Viêm gan virus, ngộ độc thuốc, thiếu máu cục bộ, tự miễn.
* **R < 2.0**: **Tổn thương ứ mật (Cholestatic pattern)** - Điển hình: Tắc mật sỏi/u, PBC, PSC, DILI thể ứ mật (Augmentin, Steroid).
* **2.0 ≤ R ≤ 5.0**: **Tổn thương thể hỗn hợp (Mixed pattern)** - Gặp trong DILI thể hỗn hợp, tắc mật giai đoạn sớm, hội chứng chồng lấp tự miễn.

### Xác nhận nguồn gốc gan của Alkaline Phosphatase (ALP)
ALP là enzyme xúc tác thủy phân este phosphat ở pH kiềm, phân bố ở:
* Gan (màng vi quản mật của tế bào gan).
* Xương (nguyên bào xương tạo xương - tăng ở trẻ em đang lớn, gãy xương, bệnh Paget, đa u tủy xương).
* Nhau thai (tăng sinh lý từ tam cá nguyệt thứ 2 và 3 của thai kỳ).
* Ruột non (tăng nhẹ sau bữa ăn nhiều dầu mỡ ở người có nhóm máu O hoặc B).

**Nguyên tắc ACG 2017**:
1. Nếu ALP tăng đi kèm men gan hoặc bilirubin tăng: Nguồn gốc gan rõ ràng, không cần xét nghiệm phụ.
2. Nếu **ALP tăng đơn độc**: Bắt buộc làm **GGT (Gamma-Glutamyl Transferase)** hoặc **5'-Nucleotidase** để xác nhận. GGT vắng mặt ở mô xương. Nếu GGT bình thường, nguyên nhân chắc chắn từ xương hoặc ngoài gan!`,
    keyTakeaways: [
      'R-ratio chuẩn hóa theo ULN là công cụ khách quan nhất để phân định tổn thương gan hoại tử vs ứ mật.',
      'GGT đóng vai trò "người bảo lãnh" khẳng định ALP tăng do bệnh lý gan mật hay do bệnh xương/sinh lý thai kỳ.',
      'Bước kế tiếp bắt buộc khi khẳng định ứ mật là Siêu âm bụng để tách đôi: Đường mật dãn (tắc ngoài gan) vs Không dãn (ứ mật trong gan).'
    ]
  },
  {
    id: 'bilirubin-metabolism',
    title: '5. Chuyển Hóa Bilirubin & Lưu Đồ Tiếp Cận Vàng Da Lâm Sàng',
    category: 'Vàng da & Bilirubin',
    readTime: '6 phút',
    summary: 'Sinh lý học gián tiếp vs liên hợp, vai trò enzym UGT1A1, tiếp cận vàng da trước gan, tại gan, sau gan theo hướng dẫn của WHO và ACG.',
    contentMarkdown: `### Chu trình chuyển hóa Bilirubin trong cơ thể
Người trưởng thành khỏe mạnh tạo ra khoảng **250 - 350 mg Bilirubin mỗi ngày**, trong đó 80-85% từ sự phá hủy hồng cầu già tại lách và tủy xương (thoái giáng Heme).
1. **Bilirubin gián tiếp (Không liên hợp / Unconjugated / Indirect)**:
   * Không tan trong nước, gắn chặt với Albumin trong huyết tương để di chuyển đến gan.
   * **Không thể lọc qua cầu thận**, do đó không xuất hiện trong nước tiểu.
2. **Quá trình liên hợp tại tế bào gan**:
   * Tại lưới nội chất tế bào gan, enzym **UDP-glucuronosyltransferase 1A1 (UGT1A1)** gắn 2 phân tử acid glucuronic vào bilirubin để tạo thành **Bilirubin trực tiếp (Bilirubin liên hợp / Diglucuronide)**.
3. **Bài tiết vào dịch mật**:
   * Bilirubin liên hợp tan trong nước, được bơm chủ động qua màng vi quản mật đổ vào đường ruột.
   * Tại đại tràng, vi khuẩn khử bilirubin thành **Urobilinogen** và **Stercobilin** (tạo màu vàng nâu đặc trưng của phân). Một phần nhỏ tái hấp thu theo chu trình gan ruột và đào thải qua nước tiểu.

### Phân đoạn Bilirubin và Định hướng nguyên nhân:
* **Tăng Bilirubin gián tiếp ưu thế (Bilirubin trực tiếp < 20% tổng số)**:
  * **Tăng sản xuất quá mức**: Tán huyết nội mạch hoặc ngoại mạch (Sốt rét, Thalassemia, tự miễn, tụ máu lớn đang tiêu).
  * **Giảm bắt giữ và liên hợp tại gan**: 
    * **Hội chứng Gilbert**: Đột biến promoter gen UGT1A1 lành tính (gặp 5-7% dân số), bilirubin hiếm khi vượt quá 3-4 mg/dL.
    * **Hội chứng Crigler-Najjar**: Thiếu hụt UGT1A1 nặng hoặc hoàn toàn (Type I & II), vàng da nhân ở trẻ sơ sinh.
* **Tăng Bilirubin trực tiếp ưu thế (Bilirubin trực tiếp > 50% tổng số)**:
  * **Tắc mật cơ học ngoài gan**: Sỏi ống mật chủ, u đầu tụy, u bóng Vater, u đường mật Klatskin (phân bạc màu, ngứa, nước tiểu sẫm màu).
  * **Tổn thương tế bào gan nặng**: Viêm gan virus bùng phát, viêm gan rượu, xơ gan (do ức chế bơm bài tiết mật vào vi quản).
  * **Bệnh lý bài tiết bẩm sinh hiếm gặp**: Hội chứng Dubin-Johnson (khiếm khuyết gen bơm MRP2) và Rotor (men gan bình thường).`,
    keyTakeaways: [
      'Bilirubin gián tiếp không qua nước tiểu; khi nước tiểu sậm màu vàng sẫm có bọt chứng tỏ Bilirubin trực tiếp tan trong nước bị rò rỉ vào máu.',
      'Nếu Bilirubin tăng đơn độc ưu thế gián tiếp và men gan bình thường: Loại trừ tán huyết rồi nghĩ ngay tới Hội chứng Gilbert lành tính.',
      'Delta Bilirubin (liên hợp gắn bền vững với Albumin) có thời gian bán hủy 3 tuần, giải thích hiện tượng vàng da chậm biến mất dù bệnh gan đã hồi phục.'
    ]
  },
  {
    id: 'pitfalls-interfering',
    title: '6. Bẫy Xét Nghiệm & Yếu Tố Nhiễu Sinh Hóa Cần Cảnh Giác',
    category: 'Thực hành xét nghiệm',
    readTime: '4 phút',
    summary: 'Nhận diện tán huyết trong ống nghiệm (in vitro hemolysis), đục mỡ (lipemia), vàng da đậm (icterus), ảnh hưởng của vận động, thuốc và nhịp sinh học.',
    contentMarkdown: `### 1. Mẫu máu vỡ hồng cầu (In Vitro Hemolysis)
* Hồng cầu chứa nồng độ **AST cao gấp 40 lần** so với huyết thanh, cùng với lượng lớn **LDH** và **Kali**.
* Kỹ thuật lấy máu kém, garô quá chặt hoặc bơm kim tiêm áp lực cao làm vỡ hồng cầu giải phóng AST vào huyết thanh, tạo ra kết quả **tăng giả AST đơn độc** trong khi ALT và GGT hoàn toàn bình thường.

### 2. Hiện tượng nhiễu quang học (Spectrophotometric Interference)
Các máy xét nghiệm tự động đo hoạt độ enzyme dựa trên độ hấp thụ ánh sáng ở các bước sóng xác định (theo định luật Beer-Lambert):
* **Huyết sắc tố (Hemoglobin)**: Hấp thụ cực đại ở 415 nm (320 - 580 nm), gây sai lệch kết quả định lượng Sắt, Albumin, Lipase và GGT.
* **Đục mỡ (Lipemia)**: Gây tán xạ ánh sáng, đặc biệt làm nhiễu nặng các phản ứng đo quang ở bước sóng ngắn **340 nm** (phản ứng tiêu thụ NADH để đo ALT và AST).
* **Vàng da đậm (Icterus)**: Bilirubin hấp thụ mạnh ở 400 - 540 nm, có thể gây sai lệch kết quả Creatinine hoặc một số enzyme khác.

### 3. Nhịp sinh học và Bữa ăn
* Nồng độ **ALT có nhịp sinh học dao động tới 45%** trong ngày, thường đạt đỉnh vào buổi chiều và thấp nhất vào rạng sáng.
* Bữa ăn nhiều chất béo có thể làm tăng transaminase tạm thời từ 2 đến 3 lần và kích hoạt tăng ALP ruột (đặc biệt ở người nhóm máu O và B). Do đó, **mẫu máu nên được lấy vào buổi sáng sau khi nhịn đói qua đêm**.

### 4. Thuốc can thiệp phản ứng đo quang
* Thuốc kháng sinh **Metronidazole** hấp thụ ánh sáng ở vùng 340 nm, có thể can thiệp làm kết quả đo ALT bị sai lệch thấp giả tạo trên một số dòng máy phân tích sử dụng phương pháp IFCC.`,
    keyTakeaways: [
      'Luôn kiểm tra chỉ số Hemolysis Index trên phiếu xét nghiệm khi thấy AST tăng cao đơn độc.',
      'Lấy máu buổi sáng lúc đói giúp loại bỏ biến thiên nhịp sinh học và ảnh hưởng từ chuyển hóa thức ăn.',
      'Khai thác thuốc đang dùng (kể cả kháng sinh như Metronidazole hay thực phẩm chức năng) để diễn giải chính xác.'
    ]
  }
];

import { BiomarkerInfo } from '../types/cdss';

export const BIOMARKER_DICTIONARY: BiomarkerInfo[] = [
  {
    id: 'alt',
    code: 'ALT (SGPT)',
    nameVi: 'Alanine Aminotransferase',
    nameEn: 'Alanine Aminotransferase (Serum Glutamic Pyruvic Transaminase)',
    category: 'Hepatocellular',
    normalRangeMale: '29 - 33 U/L (ACG 2017) / <40 U/L (Truyền thống)',
    normalRangeFemale: '19 - 25 U/L (ACG 2017) / <35 U/L (Truyền thống)',
    halfLife: '~47 ± 10 giờ (thanh thải chậm)',
    cellularOrigin: 'Bào tương (Cytosol) của tế bào gan (đặc hiệu cao cho gan)',
    physiologicalRole: 'Xúc tác chuyển nhóm amin giữa L-alanine và 2-oxoglutarate để tạo pyruvate và L-glutamate, tham gia chu trình glucose-alanine chuyển đổi năng lượng giữa cơ và gan.',
    causesOfElevation: [
      'Viêm gan virus cấp (A, B, C, D, E) - thường tăng từ 5x đến >15x ULN',
      'Tổn thương gan do thuốc (DILI) như Paracetamol, kháng sinh, thuốc hạ áp',
      'Bệnh gan nhiễm mỡ chuyển hóa (MASLD / MASH) - tăng mạn tính 2-5x ULN',
      'Thiếu máu cục bộ gan (Shock liver / Ischemic hepatitis) - tăng vọt >15x đến >10,000 U/L',
      'Viêm gan tự miễn (AIH), bệnh Wilson, bệnh ứ sắt (Hemochromatosis)'
    ],
    clinicalPearls: [
      'ALT là dấu ấn nhạy và đặc hiệu nhất cho tổn thương tế bào gan vì định vị chủ yếu tại gan và nằm trong bào tương.',
      'Mức độ tăng ALT không tỷ lệ thuận với mức độ nặng hay tiên lượng của bệnh gan mạn tính.',
      'Theo ACG 2017, ngưỡng ULN thực sự ở người khỏe mạnh không có yếu tố nguy cơ là 33 U/L ở nam và 25 U/L ở nữ.'
    ],
    testingPitfalls: [
      'Nhiễu do huyết tương đục mỡ (Lipemia) ở bước sóng 340 nm.',
      'Kháng sinh Metronidazole hấp thụ ánh sáng ở bước sóng đo quang, có thể làm kết quả ALT thấp giả tạo.',
      'Nhịp sinh học có thể làm ALT dao động tới 45% (thường cao hơn vào buổi chiều).'
    ]
  },
  {
    id: 'ast',
    code: 'AST (SGOT)',
    nameVi: 'Aspartate Aminotransferase',
    nameEn: 'Aspartate Aminotransferase (Serum Glutamic Oxaloacetic Transaminase)',
    category: 'Hepatocellular',
    normalRangeMale: '5 - 35 U/L (ACG 2017)',
    normalRangeFemale: '5 - 30 U/L (ACG 2017)',
    halfLife: '~17 ± 5 giờ (thanh thải nhanh gấp đôi ALT)',
    cellularOrigin: '80% trong ty thể (mAST), 20% trong bào tương (cAST). Có ở gan, tim, cơ vân, thận, não, hồng cầu.',
    physiologicalRole: 'Xúc tác chuyển nhóm amin giữa aspartate và alpha-ketoglutarate, đóng vai trò sống còn trong thoi vận chuyển malate-aspartate giữa bào tương và ty thể phục vụ hô hấp hiếu khí.',
    causesOfElevation: [
      'Bệnh gan do rượu (tỷ lệ AST/ALT > 2:1)',
      'Xơ gan do mọi nguyên nhân (giảm thanh thải AST qua xoang gan, AST/ALT > 1.0)',
      'Viêm gan thiếu máu cục bộ (AST thường tăng trước và cao hơn ALT trong 24h đầu)',
      'Tiêu cơ vân, viêm cơ, chấn thương cơ bắp nặng hoặc tập luyện thể lực cường độ cao',
      'Nhồi máu cơ tim cấp',
      'Tán huyết nội mạch hoặc vỡ hồng cầu trong ống nghiệm'
    ],
    clinicalPearls: [
      'AST ít đặc hiệu cho gan hơn ALT vì phân bố rộng rãi ở cơ tim và cơ vân.',
      'Khi AST tăng đơn độc trong khi ALT và GGT hoàn toàn bình thường, bước đầu tiên là kiểm tra Creatine Kinase (CK) để loại trừ bệnh cơ vân và kiểm tra chỉ số tan máu của mẫu máu.'
    ],
    testingPitfalls: [
      'Tan máu trong ống nghiệm (In vitro hemolysis) phóng thích lượng lớn AST từ hồng cầu làm tăng giả AST.',
      'Tập thể hình hoặc chạy đường trường trước khi xét nghiệm 24-48 giờ có thể làm AST tăng gấp 3-5 lần.'
    ]
  },
  {
    id: 'alp',
    code: 'ALP (Kiềm Thổ)',
    nameVi: 'Alkaline Phosphatase (Phosphatase Kiềm)',
    nameEn: 'Alkaline Phosphatase',
    category: 'Cholestatic',
    normalRangeMale: '30 - 120 U/L',
    normalRangeFemale: '30 - 120 U/L (Tăng sinh lý trong thai kỳ)',
    halfLife: '~7 ngày',
    cellularOrigin: 'Màng vi quản mật tế bào gan, biểu mô đường mật, nguyên bào xương, nhau thai, niêm mạc ruột non.',
    physiologicalRole: 'Xúc tác thủy phân các este monophosphat hữu cơ ở pH kiềm tối ưu (pH 9-10), tham gia vận chuyển màng và khoáng hóa xương.',
    causesOfElevation: [
      'Tắc mật ngoài gan: Sỏi ống mật chủ, u đầu tụy, u bóng Vater, chít hẹp đường mật',
      'Ứ mật trong gan: Viêm đường mật tiên phát (PBC), viêm xơ đường mật (PSC), DILI thể ứ mật',
      'Bệnh lý thâm nhiễm gan: U hạt sarcoidosis, lao gan, ung thư gan di căn, lymphoma',
      'Bệnh lý xương: Bệnh xương Paget, nhuyễn xương do thiếu vitamin D, ung thư di căn xương, thời kỳ gãy xương đang liền',
      'Tăng sinh lý: Phụ nữ mang thai 3 tháng cuối (nguồn gốc nhau thai), trẻ em tuổi dậy thì đang tăng trưởng xương'
    ],
    causesOfReduction: [
      'Bệnh Wilson thể cấp bùng phát (đồng ức chế kẽm trong phân tử ALP)',
      'Thiếu kẽm hoặc magnesi nặng, suy dinh dưỡng, suy giáp nặng'
    ],
    clinicalPearls: [
      'Tăng ALP trong ứ mật là do tăng sinh tổng hợp enzyme mới tại màng vi quản mật chứ không chỉ đơn thuần là rò rỉ cơ học.',
      'Nếu ALP tăng đơn độc, đo ngay GGT: GGT tăng cùng chứng minh nguồn gốc gan; GGT bình thường gợi ý bệnh xương hoặc nhau thai.'
    ],
    testingPitfalls: [
      'Tăng sinh lý sau bữa ăn nhiều chất béo ở người có nhóm máu O hoặc B (do giải phóng isoenzyme ruột). Mẫu xét nghiệm cần lấy lúc đói.'
    ]
  },
  {
    id: 'ggt',
    code: 'GGT (Gamma-GT)',
    nameVi: 'Gamma-Glutamyl Transferase',
    nameEn: 'Gamma-Glutamyl Transferase',
    category: 'Cholestatic',
    normalRangeMale: '< 50 U/L (hoặc < 35 U/L)',
    normalRangeFemale: '< 35 U/L',
    halfLife: '~14 - 26 ngày',
    cellularOrigin: 'Màng tế bào biểu mô đường mật (Cholangiocytes), tế bào gan, ống thận, tụy (KHÔNG có trong mô xương).',
    physiologicalRole: 'Chuyển nhóm gamma-glutamyl từ glutathione sang các acid amin hoặc peptide, tham gia bảo vệ chống stress oxy hóa và hấp thu acid amin.',
    causesOfElevation: [
      'Tắc mật và viêm đường mật (song hành với ALP)',
      'Lạm dụng rượu mạn tính (cồn kích thích cảm ứng enzym GGT tại lưới nội chất tế bào gan)',
      'Gan nhiễm mỡ (MASLD / MASH), đái tháo đường, béo phì',
      'Sử dụng các thuốc cảm ứng enzym gan: Phenytoin, Carbamazepine, Barbiturate',
      'Bệnh lý tụy, suy tim sung huyết'
    ],
    clinicalPearls: [
      'GGT có độ nhạy cực cao với bệnh lý gan mật nhưng độ đặc hiệu kém nếu dùng đơn độc để tầm soát.',
      'Giá trị lâm sàng lớn nhất của GGT là dùng làm "test đối chứng" để khẳng định ALP tăng có nguồn gốc từ gan mật hay từ xương.'
    ],
    testingPitfalls: [
      'Rất dễ tăng do rượu hoặc thuốc chống co giật dù không có tổn thương mô học đáng kể tại gan.'
    ]
  },
  {
    id: 'bilirubin-total',
    code: 'Total Bilirubin',
    nameVi: 'Bilirubin Toàn Phần',
    nameEn: 'Total Serum Bilirubin',
    category: 'Bilirubin',
    normalRangeMale: '0.2 - 1.2 mg/dL (3.4 - 20.5 µmol/L)',
    normalRangeFemale: '0.2 - 1.2 mg/dL (3.4 - 20.5 µmol/L)',
    halfLife: '~4 giờ (Bilirubin tự do) / ~21 ngày (Delta Bilirubin gắn Albumin)',
    cellularOrigin: 'Sản phẩm giáng hóa thoái biến nhân Hem của Hemoglobin hồng cầu (80-85%) và các hemoprotein khác (Cytochrome, Myoglobin).',
    physiologicalRole: 'Chất chuyển hóa thải trừ; có đặc tính chống oxy hóa sinh lý ở nồng độ bình thường nhưng gây độc thần kinh (vàng da nhân) ở nồng độ tự do rất cao ở trẻ sơ sinh.',
    causesOfElevation: [
      'Tắc nghẽn đường mật do sỏi, khối u, hẹp đường mật',
      'Viêm gan cấp, xơ gan giai đoạn tiến triển hoặc mất bù',
      'Tán huyết nội mạch hoặc ngoại mạch (Sốt rét, Thalassemia, thiếu máu tự miễn)',
      'Hội chứng Gilbert, Crigler-Najjar, Dubin-Johnson, Rotor',
      'Sốc nhiễm trùng (Cholestasis of sepsis), nuôi dưỡng tĩnh mạch hoàn toàn (TPN)'
    ],
    clinicalPearls: [
      'Vàng da lâm sàng (Jaundice/Icterus) thường chỉ phát hiện được bằng mắt thường khi Bilirubin toàn phần vượt quá 2.5 - 3.0 mg/dL.',
      'Sự tồn tại của Delta-bilirubin (liên kết cộng hóa trị với albumin với t½ 3 tuần) giải thích tại sao vàng da mắt có thể tồn tại nhiều tuần sau khi tổn thương gan đã khỏi hoàn toàn.'
    ],
    testingPitfalls: [
      'Mẫu máu tiếp xúc với ánh sáng mặt trời hoặc đèn huỳnh quang kéo dài làm bilirubin bị quang hóa phân hủy, dẫn đến kết quả thấp giả tạo.'
    ]
  },
  {
    id: 'bilirubin-direct',
    code: 'Direct Bilirubin',
    nameVi: 'Bilirubin Trực Tiếp (Bilirubin Liên Hợp)',
    nameEn: 'Conjugated / Direct Bilirubin',
    category: 'Bilirubin',
    normalRangeMale: '0.0 - 0.3 mg/dL (0 - 5.1 µmol/L)',
    normalRangeFemale: '0.0 - 0.3 mg/dL (0 - 5.1 µmol/L)',
    halfLife: 'Ngắn (trừ dạng Delta)',
    cellularOrigin: 'Được tạo ra trong lưới nội chất tế bào gan nhờ enzym UGT1A1 gắn acid glucuronic.',
    physiologicalRole: 'Dạng bilirubin tan trong nước, được bơm chủ động qua kênh MRP2 vào vi quản mật để đào thải theo phân.',
    causesOfElevation: [
      'Tắc nghẽn lưu thông dòng mật ngoài gan (sỏi mật, u đường mật)',
      'Ứ mật trong gan (PBC, PSC, thuốc, nhiễm trùng huyết)',
      'Tổn thương tế bào gan nặng (viêm gan cấp, viêm gan rượu, xơ gan)',
      'Hội chứng Dubin-Johnson và Rotor'
    ],
    clinicalPearls: [
      'Bilirubin trực tiếp tan trong nước nên khi rò rỉ vào máu sẽ được lọc qua cầu thận, làm nước tiểu có màu vàng sẫm đặc trưng (Bilirubinuria).',
      'Nếu Bilirubin trực tiếp chiếm >50% Bilirubin toàn phần: Chắc chắn là tăng bilirubin liên hợp do bệnh lý gan mật.'
    ],
    testingPitfalls: [
      'Nhiễm sắc tố máu có thể làm nhiễu phản ứng Diazo.'
    ]
  },
  {
    id: 'albumin',
    code: 'Albumin Máu',
    nameVi: 'Albumin Huyết Thanh',
    nameEn: 'Serum Albumin',
    category: 'Synthetic',
    normalRangeMale: '3.5 - 5.0 g/dL (35 - 50 g/L)',
    normalRangeFemale: '3.5 - 5.0 g/dL (35 - 50 g/L)',
    halfLife: '~18 - 21 ngày (thời gian dài)',
    cellularOrigin: 'Được tổng hợp duy nhất tại tế bào nhu mô gan (khoảng 10 - 15g/ngày).',
    physiologicalRole: 'Duy trì 75-80% áp lực keo huyết tương ngăn thoát dịch vào khoang kẽ; vận chuyển bilirubin, hormon tuyến giáp, acid béo và các loại thuốc.',
    causesOfElevation: [
      'Mất nước cô đặc máu (Dehydration)'
    ],
    causesOfReduction: [
      'Bệnh gan mạn tính / Xơ gan (giảm tổng hợp, phản ánh tổn thương mạn >3 tuần)',
      'Mất qua thận (Hội chứng thận hư), mất qua ruột (bệnh ruột mất đạm, tiêu chảy mạn)',
      'Hội chứng đáp ứng viêm toàn thân / Nhiễm trùng nặng (Cytokine IL-6, TNF-alpha ức chế gan tổng hợp albumin)',
      'Suy dinh dưỡng thiếu protein nặng (Kwashiorkor)'
    ],
    clinicalPearls: [
      'Do thời gian bán hủy dài (21 ngày), Albumin máu HOÀN TOÀN BÌNH THƯỜNG trong viêm gan cấp tính.',
      'Albumin giảm là dấu hiệu kinh điển giúp phân biệt tổn thương gan mạn tính (như xơ gan) với tổn thương gan cấp.'
    ],
    testingPitfalls: [
      'Dùng dịch truyền albumin trước khi xét nghiệm làm sai lệch kết quả đánh giá chức năng gan nội sinh.'
    ]
  },
  {
    id: 'inr',
    code: 'PT / INR',
    nameVi: 'Thời Gian Prothrombin / Chỉ Số INR',
    nameEn: 'Prothrombin Time / International Normalized Ratio',
    category: 'Synthetic',
    normalRangeMale: 'INR: 0.85 - 1.15 (PT: 11 - 13.5 giây)',
    normalRangeFemale: 'INR: 0.85 - 1.15 (PT: 11 - 13.5 giây)',
    halfLife: 'Yếu tố VII: 6 giờ; Yếu tố II: 60 giờ; Yếu tố X: 30 giờ.',
    cellularOrigin: 'Gan là nơi sản xuất toàn bộ các yếu tố đông máu con đường ngoại sinh và chung (I, II, V, VII, X).',
    physiologicalRole: 'Đánh giá khả năng đông máu ngoại sinh và năng lực tổng hợp protein chu kỳ ngắn của gan.',
    causesOfElevation: [
      'Suy gan cấp (ALF) - tiêu chuẩn chẩn đoán cốt lõi: INR >= 1.5 kèm bệnh não gan',
      'Xơ gan tiến triển / Suy tế bào gan mạn',
      'Thiếu hụt Vitamin K (do ứ mật kéo dài làm giảm hấp thu mỡ, suy dinh dưỡng, kháng sinh phổ rộng)',
      'Dùng thuốc chống đông kháng vitamin K (Warfarin), NOAC, đông máu nội mạch rải rác (DIC)'
    ],
    clinicalPearls: [
      'PT/INR là thước đo nhạy bén nhất về chức năng tổng hợp cấp thời của tế bào gan (nhờ Yếu tố VII có t½ chỉ 6 giờ).',
      'Để phân biệt kéo dài INR do suy tế bào gan hay do thiếu Vitamin K: Tiêm tĩnh mạch Vitamin K 10mg; nếu do thiếu hụt đơn thuần, INR sẽ cải thiện rõ rệt sau 24-48 giờ.'
    ],
    testingPitfalls: [
      'Lấy máu sai tỷ lệ chống đông Natri Citrate (ống lấy không đủ thể tích máu) làm kéo dài giả tạo kết quả PT.'
    ]
  },
  {
    id: 'platelets',
    code: 'Tiểu Cầu',
    nameVi: 'Số Lượng Tiểu Cầu',
    nameEn: 'Platelet Count',
    category: 'Specialized',
    normalRangeMale: '150 - 450 x 10^9 / L',
    normalRangeFemale: '150 - 450 x 10^9 / L',
    halfLife: '~7 - 10 ngày',
    cellularOrigin: 'Sinh mẫu tiểu cầu tại tủy xương dưới sự kích thích của Thrombopoietin (TPO) do gan tiết ra.',
    physiologicalRole: 'Cầm máu ban đầu và ổn định thành mạch.',
    causesOfElevation: [
      'Tăng tiểu cầu phản ứng sau xuất huyết tiêu hóa cấp tính hoặc phản ứng viêm toàn thân',
      'Hội chứng tăng sinh tủy / Cắt lách'
    ],
    causesOfReduction: [
      'Tăng áp lực tĩnh mạch cửa gây cường lách và ứ đọng tiểu cầu tại lách',
      'Giảm sản xuất Thrombopoietin do suy tế bào nhu mô gan',
      'Ức chế tủy xương do rượu hoặc nhiễm virus viêm gan C'
    ],
    clinicalPearls: [
      'Giảm tiểu cầu (<150 x 10^9/L) ở bệnh nhân có bệnh gan mạn tính là một trong những chỉ điểm gián tiếp nhạy nhất của tăng áp lực tĩnh mạch cửa và xơ gan.',
      'Tiểu cầu là tham số quan trọng trong các công thức xơ hóa không xâm lấn hàng đầu: FIB-4 và APRI.'
    ],
    testingPitfalls: [
      'Hiện tượng vón tiểu cầu do chất chống đông EDTA trong ống nghiệm (Pseudothrombocytopenia) - cần kiểm tra lại bằng ống Citrate.'
    ]
  },
  {
    id: 'ck',
    code: 'Creatine Kinase (CK)',
    nameVi: 'Creatine Kinase Toàn Phần',
    nameEn: 'Creatine Kinase (CPK)',
    category: 'Non-hepatic',
    normalRangeMale: '30 - 200 U/L',
    normalRangeFemale: '30 - 170 U/L',
    halfLife: '~12 giờ',
    cellularOrigin: 'Cơ vân, cơ tim, mô não (hoàn toàn KHÔNG có trong tế bào gan).',
    physiologicalRole: 'Xúc tác phosphoryl hóa đảo ngược creatine thành phosphocreatine, nguồn dự trữ năng lượng nhanh cho cơ bắp.',
    causesOfElevation: [
      'Tiêu cơ vân cấp (Rhabdomyolysis) do tập luyện quá mức, chèn ép ngạt thở, co giật, sốc nhiệt',
      'Viêm cơ tự miễn (Polymyositis, Dermatomyositis)',
      'Nhồi máu cơ tim cấp',
      'Tác dụng phụ của nhóm thuốc hạ mỡ máu Statin'
    ],
    clinicalPearls: [
      'Bẫy chẩn đoán: Khi cơ vân bị hủy hoại, AST và ALT giải phóng đồng thời nhưng AST >> ALT. Đo CK là chìa khóa vàng phân biệt bệnh cơ với bệnh gan.'
    ],
    testingPitfalls: [
      'Tiêm bắp hoặc tập thể dục nhẹ cũng có thể làm CK tăng nhẹ.'
    ]
  },
  {
    id: 'afp',
    code: 'AFP',
    nameVi: 'Alpha-Fetoprotein',
    nameEn: 'Alpha-Fetoprotein',
    category: 'Tumor & Serology',
    normalRangeMale: '< 10 - 20 ng/mL',
    normalRangeFemale: '< 10 - 20 ng/mL (Tăng sinh lý khi mang thai)',
    halfLife: '~5 - 7 ngày',
    cellularOrigin: 'Được sản xuất bởi túi noãn hoàng và gan bào thai. Ở người trưởng thành, được tiết bởi nguyên bào gan (hepatoblasts) trong quá trình tái tạo gan và bởi tế bào ung thư biểu mô gan.',
    physiologicalRole: 'Protein huyết tương chính ở bào thai, tương đương chức năng áp lực keo của Albumin ở người lớn.',
    causesOfElevation: [
      'Ung thư biểu mô tế bào gan (HCC) - thường > 400 - 500 ng/mL',
      'U nguyên bào gan (Hepatoblastoma) ở trẻ em',
      'U quái ác tính hoặc u tế bào mầm tinh hoàn / buồng trứng',
      'Tái tạo tế bào gan sau đợt bùng phát viêm gan virus cấp/mạn tính (thường tăng vừa 20 - 200 ng/mL)',
      'Xơ gan hoạt động'
    ],
    clinicalPearls: [
      'Theo đánh giá giải phẫu bệnh học (Altaihani et al. 2024): AFP là dấu ấn khối u then chốt để phát hiện và theo dõi ung thư gan nguyên phát.',
      'Sự gia tăng AFP trong viêm gan virus mạn không phải lúc nào cũng là ác tính, mà có thể phản ánh quá trình phân chia nguyên bào gan tích cực để bù đắp tế bào bị hoại tử.',
      'Nồng độ AFP > 400 ng/mL ở bệnh nhân xơ gan có giá trị chẩn đoán xác định HCC rất cao mà không cần chờ sinh thiết nếu hình ảnh học CT/MRI có tính chất ngấm thuốc kinh điển.'
    ],
    testingPitfalls: [
      'Tăng sinh lý rõ rệt trong thai kỳ (do thai nhi tiết vào máu mẹ).'
    ]
  },
  {
    id: 'ca199',
    code: 'CA 19-9',
    nameVi: 'Kháng Nguyên Carbohydrate 19-9',
    nameEn: 'Carbohydrate Antigen 19-9',
    category: 'Tumor & Serology',
    normalRangeMale: '< 37 U/mL',
    normalRangeFemale: '< 37 U/mL',
    halfLife: '~4 - 8 ngày',
    cellularOrigin: 'Biểu mô đường mật, biểu mô ống tụy và tế bào biểu mô đường tiêu hóa.',
    physiologicalRole: 'Kháng nguyên nhóm máu Lewis sialyl hóa (sialyl-Lewis A), biểu hiện trên bề mặt glycoprotein tiết.',
    causesOfElevation: [
      'Ung thư đường mật (Cholangiocarcinoma) - đặc biệt trên bệnh nhân Viêm xơ đường mật tiên phát (PSC)',
      'Ung thư tụy biểu mô tuyến',
      'Tắc mật cơ học hoặc viêm đường mật cấp tính lành tính (do giảm bài tiết mật vào ruột)',
      'Ung thư đại trực tràng, dạ dày, phổi',
      'Xơ gan'
    ],
    clinicalPearls: [
      'Bài báo Altaihani et al. (2024) nhấn mạnh: CA 19-9 đóng vai trò đặc biệt quan trọng trong việc theo dõi diễn tiến của Viêm xơ đường mật tiên phát (PSC), một bệnh tự miễn thường tiến triển âm thầm thành u đường mật ác tính.',
      'Khoảng 5 - 10% dân số âm tính với kháng nguyên Lewis (Le a-b-) sẽ không có khả năng tổng hợp CA 19-9, dẫn đến kết quả âm tính giả ngay cả khi khối u đường mật rất lớn.'
    ],
    testingPitfalls: [
      'Ứ mật lành tính có thể gây tăng vừa CA 19-9 (lên đến 100 - 300 U/mL), sẽ hạ về bình thường sau khi giải phóng tắc nghẽn.'
    ]
  },
  {
    id: 'ferritin',
    code: 'Ferritin & Bão Hòa Transferrin',
    nameVi: 'Ferritin & Độ Bão Hòa Transferrin (TSAT)',
    nameEn: 'Serum Ferritin & Transferrin Saturation',
    category: 'Specialized',
    normalRangeMale: 'Ferritin: 30 - 400 ng/mL | TSAT: 20 - 45%',
    normalRangeFemale: 'Ferritin: 15 - 200 ng/mL | TSAT: 15 - 45%',
    halfLife: '~30 - 50 giờ',
    cellularOrigin: 'Tế bào hệ võng nội mô, tế bào nhu mô gan và đại thực bào.',
    physiologicalRole: 'Dự trữ sắt an toàn bên trong tế bào dưới dạng không độc hại, giải phóng sắt khi cơ thể cần tạo hồng cầu.',
    causesOfElevation: [
      'Bệnh ứ sắt mô di truyền (Hereditary Hemochromatosis) - TSAT ≥ 45% và Ferritin tăng cao',
      'Hoại tử tế bào gan cấp tính (phóng thích ferritin từ tế bào gan bị vỡ)',
      'Phản ứng viêm pha cấp (Nhiễm trùng, u ác tính, hội chứng hoạt hóa đại thực bào HLH)',
      'Hội chứng chuyển hóa, gan nhiễm mỡ MASLD, nghiện rượu mạn',
      'Truyền máu nhiều lần'
    ],
    clinicalPearls: [
      'Theo Hướng dẫn ACG 2017 & Altaihani 2024: Mọi bệnh nhân tăng men gan không rõ nguyên nhân cần làm bilan sắt (Ferritin + TSAT).',
      'Nếu TSAT ≥ 45% kèm Ferritin tăng: Chỉ định xét nghiệm đột biến gen HFE (C282Y và H63D) để xác chẩn Hemochromatosis.',
      'Ferritin là protein phản ứng viêm pha cấp; vì vậy trong viêm gan cấp, Ferritin tăng cao thường chỉ là hiện tượng thoát rò do vỡ tế bào chứ không phải ứ sắt mô.'
    ],
    testingPitfalls: [
      'Viêm toàn thân làm tăng Ferritin giả mà độ bão hòa Transferrin vẫn bình thường.'
    ]
  },
  {
    id: 'ceruloplasmin',
    code: 'Ceruloplasmin',
    nameVi: 'Ceruloplasmin Huyết Thanh',
    nameEn: 'Serum Ceruloplasmin',
    category: 'Specialized',
    normalRangeMale: '20 - 40 mg/dL',
    normalRangeFemale: '20 - 40 mg/dL',
    halfLife: '~5.5 ngày',
    cellularOrigin: 'Được tổng hợp chủ yếu ở tế bào nhu mô gan.',
    physiologicalRole: 'Protein vận chuyển 90-95% đồng trong huyết tương và đóng vai trò men ferroxidase oxy hóa Fe2+ thành Fe3+ để gắn vào transferrin.',
    causesOfElevation: [
      'Phản ứng viêm pha cấp, nhiễm trùng',
      'Thuốc tránh thai chứa estrogen, mang thai'
    ],
    causesOfReduction: [
      'Bệnh Wilson (giảm ở 85% bệnh nhân do đột biến gen ATP7B)',
      'Hội chứng thận hư, bệnh ruột mất đạm',
      'Thiếu hụt đồng dinh dưỡng, suy gan tối cấp giai đoạn kiệt quệ'
    ],
    clinicalPearls: [
      'Ở bệnh nhân < 55 tuổi có men gan tăng kéo dài hoặc có bất thường vận động / tâm thần: Cần làm Ceruloplasmin để tầm soát bệnh Wilson.',
      'Khi Ceruloplasmin < 20 mg/dL, cần làm tiếp xét nghiệm đồng nước tiểu 24h (>100 µg/ngày) và khám mắt bằng đèn khe tìm vòng Kayser-Fleischer ở màng Descemet.'
    ],
    testingPitfalls: [
      'Vì là protein pha cấp, Ceruloplasmin có thể tăng giả về mức bình thường trong đợt viêm gan cấp hoặc nhiễm trùng dù bệnh nhân thực sự mắc bệnh Wilson.'
    ]
  },
  {
    id: 'autoimmune-antibodies',
    code: 'Tự Kháng Thể Gan',
    nameVi: 'Bộ Tự Kháng Thể Gan (AMA, ANA, ASMA, LKM1)',
    nameEn: 'Autoimmune Liver Antibodies Panel',
    category: 'Tumor & Serology',
    normalRangeMale: 'Âm tính (Hiệu giá < 1:40)',
    normalRangeFemale: 'Âm tính (Hiệu giá < 1:40)',
    halfLife: 'Kháng thể IgG lưu hành nhiều tuần.',
    cellularOrigin: 'Tương bào của hệ thống miễn dịch tự sinh.',
    physiologicalRole: 'Chỉ điểm quá trình tự miễn phá hủy tế bào gan hoặc đường mật.',
    causesOfElevation: [
      'AMA (Kháng thể kháng ty thể): Dấu hiệu đặc trưng nhất của Viêm đường mật tiên phát (PBC, dương tính >95%)',
      'ANA (Kháng thể kháng nhân) & ASMA (Kháng thể kháng cơ trơn): Viêm gan tự miễn Type 1 (AIH-1)',
      'Anti-LKM1 & Anti-LC1: Viêm gan tự miễn Type 2 (AIH-2)',
      'p-ANCA: Viêm xơ đường mật tiên phát (PSC)'
    ],
    clinicalPearls: [
      'Theo Altaihani et al. (2024): Việc định danh chính xác kiểu tự kháng thể giúp phân biệt các bệnh gan tự miễn và hội chứng chồng lấp (Overlap syndrome).',
      'Ở phụ nữ trẻ có tăng men gan không giải thích được: Kháng thể ANA, ASMA và định lượng IgG là bước chỉ định bắt buộc.'
    ],
    testingPitfalls: [
      'Hiệu giá ANA thấp (1:40 hoặc 1:80) có thể gặp ở người bình thường hoặc người già mà không có bệnh tự miễn thực sự.'
    ]
  },
  {
    id: 'ldh',
    code: 'LDH',
    nameVi: 'Lactate Dehydrogenase',
    nameEn: 'Lactate Dehydrogenase',
    category: 'Non-hepatic',
    normalRangeMale: '50 - 150 U/L (hoặc 140 - 280 U/L tùy phương pháp)',
    normalRangeFemale: '50 - 150 U/L (hoặc 140 - 280 U/L tùy phương pháp)',
    halfLife: '~10 - 24 giờ tùy isoenzyme (LDH-5 ở gan ~10h, LDH-1 ở tim ~100h)',
    cellularOrigin: 'Hiện diện trong hầu hết các mô cơ thể: Gan, cơ tim, cơ vân, thận, hồng cầu, khối u.',
    physiologicalRole: 'Xúc tác phản ứng thuận nghịch chuyển hóa pyruvat thành lactat trong chu trình đường phân kỵ khí (Cori cycle).',
    causesOfElevation: [
      'Thiếu máu cục bộ gan / Sốc gan (LDH tăng cực cao và giảm nhanh trong vài ngày)',
      'Tán huyết nội mạch hoặc vỡ hồng cầu mẫu thử trong ống nghiệm',
      'Nhồi máu cơ tim, nhồi máu phổi, tiêu cơ vân',
      'Ung thư di căn gan hoặc u lympho'
    ],
    clinicalPearls: [
      'Tỷ số ALT/LDH < 1.5 trong bệnh cảnh tăng men gan dữ dội gợi ý rất cao Viêm gan thiếu máu cục bộ (Shock Liver) hoặc ngộ độc Paracetamol, khác với Viêm gan virus cấp thường có ALT/LDH > 1.5.',
      'LDH tăng cao kèm Bilirubin gián tiếp tăng là bộ đôi then chốt xác định tan máu.'
    ],
    testingPitfalls: [
      'Mẫu máu vỡ hồng cầu nhẹ cũng làm LDH tăng vọt giả tạo.'
    ]
  },
  {
    id: 'cdt',
    code: 'CDT',
    nameVi: 'Carbohydrate-Deficient Transferrin',
    nameEn: 'Carbohydrate-Deficient Transferrin',
    category: 'Specialized',
    normalRangeMale: '< 1.7 - 2.0 %',
    normalRangeFemale: '< 1.7 - 2.0 %',
    halfLife: '~14 - 17 ngày',
    cellularOrigin: 'Được tạo ra tại gan khi ethanol ức chế các enzym gắn chuỗi carbohydrate vào transferrin.',
    physiologicalRole: 'Dấu ấn đặc hiệu phản ánh tình trạng lạm dụng rượu mạn tính (>50-60g cồn nguyên chất mỗi ngày trong ít nhất 2 tuần liên tục).',
    causesOfElevation: [
      'Nghiện rượu / Lạm dụng rượu mạn tính nặng',
      'Rối loạn glycosyl hóa bẩm sinh (rất hiếm)'
    ],
    clinicalPearls: [
      'Bài báo 2024 ghi nhận: Carbohydrate-deficient transferrin có độ đặc hiệu rất cao trong việc phát hiện uống rượu quá mức gây hại gan, vượt trội hơn so với GGT đơn độc (vốn dễ bị nhiễu bởi thuốc hoặc gan nhiễm mỡ).',
      'Nồng độ CDT sẽ giảm dần về bình thường sau 2 - 4 tuần cai rượu hoàn toàn, hữu ích trong giám sát cai nghiện.'
    ],
    testingPitfalls: [
      'Xơ gan giai đoạn cuối thể mất bù nặng có thể làm biến đổi kết quả CDT.'
    ]
  },
  {
    id: 'tsh',
    code: 'TSH & Tuyến Giáp',
    nameVi: 'Thyroid-Stimulating Hormone & Tuyến Giáp',
    nameEn: 'Thyroid-Stimulating Hormone (TSH)',
    category: 'Specialized',
    normalRangeMale: '0.4 - 4.0 µIU/mL',
    normalRangeFemale: '0.4 - 4.0 µIU/mL',
    halfLife: '~60 phút',
    cellularOrigin: 'Tuyến yên thùy trước.',
    physiologicalRole: 'Điều hòa sinh tổng hợp và bài tiết hormone giáp (T3, T4).',
    causesOfElevation: [
      'Suy giáp tiên phát (Hypothyroidism)'
    ],
    causesOfReduction: [
      'Cường giáp / Nhiễm độc giáp (Hyperthyroidism / Thyrotoxicosis)'
    ],
    clinicalPearls: [
      'Cả suy giáp và cường giáp đều có thể gây biến đổi men gan (Altaihani et al. 2024 & ACG 2017).',
      'Suy giáp thường gây tăng ALT/AST nhẹ kèm tăng lipid máu và men cơ CK; cường giáp có thể gây hoại tử tế bào gan do thiếu oxy tương đối ở Zone 3 hoặc gây ứ mật vàng da trong bão giáp.'
    ],
    testingPitfalls: [
      'Kháng thể dị loại (Heterophile antibodies) có thể gây sai lệch kết quả miễn dịch.'
    ]
  }
];

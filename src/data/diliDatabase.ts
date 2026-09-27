export interface DILIDrugEntry {
  name: string;
  nameVi: string;
  rank?: number; // Thứ hạng theo nghiên cứu DILIN (Chalasani et al.)
  category: 'Antibiotic' | 'NSAID' | 'Anticonvulsant' | 'Cardiovascular' | 'Antineoplastic / Immunotherapy' | 'Supplement / Herbal' | 'Other';
  mechanism: 'Direct' | 'Idiosyncratic' | 'Indirect';
  majorPhenotypes: string;
  typicalLatency: string;
  hlaAssociation?: string;
  riskNotes: string;
  actionGuidance: string;
}

export interface DILIPhenotypeDefinition {
  id: string;
  nameEn: string;
  nameVi: string;
  injuryType: 'Direct' | 'Idiosyncratic' | 'Indirect' | 'Unknown';
  latency: string;
  enzymePattern: string;
  typicalAgents: string[];
  clinicalFeatures: string;
  prognosisAndMortality: string;
  managementRecommendations: string[];
}

// 10 Kiểu hình DILI chính theo NEJM 2019 (Table 2)
export const DILI_PHENOTYPES: DILIPhenotypeDefinition[] = [
  {
    id: 'acute-hepatic-necrosis',
    nameEn: 'Acute hepatic necrosis',
    nameVi: 'Hoại tử tế bào gan cấp',
    injuryType: 'Direct',
    latency: 'Vài ngày (1 – 5 ngày sau liều cao hoặc tăng liều)',
    enzymePattern: 'ALT/AST tăng vọt rất cao (thường > 20 - 50x ULN, có thể > 10.000 U/L); ALP và Bilirubin tăng nhẹ ban đầu',
    typicalAgents: ['Acetaminophen (Paracetamol)', 'Aspirin', 'Niacin', 'Amiodarone tiêm TM', 'Thuốc lắc (Ecstasy)', 'Nấm độc Amanita phalloides'],
    clinicalFeatures: 'Khởi phát đột ngột, đau hạ sườn phải, buồn nôn, tiến triển nhanh đến suy gan cấp (rối loạn đông máu INR ≥ 1.5, toan chuyển hóa, hôn mê gan). Mô bệnh học: Hoại tử vùng trung tâm tiểu thùy (zone 3) ít viêm.',
    prognosisAndMortality: 'Có thể tử vong nếu không xử trí kịp thời. Nếu qua cơn nguy kịch, men gan giảm nhanh gần như lúc tăng vọt.',
    managementRecommendations: [
      'Ngừng ngay lập tức tác nhân gây độc',
      'Với Paracetamol: Dùng ngay N-acetylcysteine (NAC) theo phác đồ càng sớm càng tốt',
      'Hội chẩn khẩn cấp trung tâm ghép gan nếu INR ≥ 1.5 hoặc có bệnh não gan'
    ]
  },
  {
    id: 'enzyme-elevations',
    nameEn: 'Asymptomatic enzyme elevations',
    nameVi: 'Tăng men gan không triệu chứng (Hiện tượng thích nghi)',
    injuryType: 'Direct',
    latency: 'Vài ngày đến vài tháng',
    enzymePattern: 'Tăng nhẹ đến vừa ALT hoặc ALP (< 3 - 5x ULN), không tăng Bilirubin',
    typicalAgents: ['Statins (Atorvastatin, Rosuvastatin)', 'Heparin', 'Aspirin', 'Nhiều thuốc hóa dược khác'],
    clinicalFeatures: 'Hoàn toàn không có triệu chứng lâm sàng và không vàng da. Thường tự ổn định hoặc giảm dần dù tiếp tục dùng thuốc do hiện tượng thích nghi của gan (adaptation).',
    prognosisAndMortality: 'Tiên lượng rất tốt, lành tính, không đe dọa chức năng gan.',
    managementRecommendations: [
      'Theo dõi sát men gan mỗi 2 - 4 tuần',
      'Nếu men gan ổn định hoặc giảm, có thể duy trì thuốc dưới sự giám sát',
      'Ngừng thuốc nếu ALT vượt quá 3x - 5x ULN hoặc bắt đầu xuất hiện triệu chứng/vàng da'
    ]
  },
  {
    id: 'acute-hepatocellular-hepatitis',
    nameEn: 'Acute hepatocellular hepatitis',
    nameVi: 'Viêm gan tế bào gan cấp đặc ứng',
    injuryType: 'Idiosyncratic',
    latency: '5 đến 90 ngày (vài tuần đến vài tháng)',
    enzymePattern: 'ALT tăng cao nổi trội (tăng từ 5 đến 50 lần, R > 5); ALP tăng khiêm tốn',
    typicalAgents: ['Isoniazid (INH)', 'Diclofenac', 'Nitrofurantoin', 'Propylthiouracil', 'Ketoconazole'],
    clinicalFeatures: 'Giống viêm gan virus cấp (mệt mỏi, chán ăn, buồn nôn, đau bụng, tiểu sẫm màu, vàng da).',
    prognosisAndMortality: 'Tỷ lệ tử vong cao (≥ 10%) nếu kèm vàng da rõ (thỏa Định luật Hy - Hy\'s Law). Chiếm 11 - 15% các ca suy gan cấp ở phương Tây.',
    managementRecommendations: [
      'ĐÌNH CHỈ NGAY thuốc nghi ngờ (quy tắc cốt lõi)',
      'Đánh giá tiêu chuẩn Hy\'s Law (ALT ≥ 3x ULN + Total Bili ≥ 2x ULN + R > 5)',
      'Cân nhắc dùng N-acetylcysteine ngay cả khi không phải do paracetamol trong suy gan cấp sớm',
      'Tránh thử lại thuốc (rechallenge) vì nguy cơ bùng phát tử vong'
    ]
  },
  {
    id: 'cholestatic-hepatitis',
    nameEn: 'Cholestatic hepatitis',
    nameVi: 'Viêm gan ứ mật',
    injuryType: 'Idiosyncratic',
    latency: 'Vài tuần đến vài tháng',
    enzymePattern: 'ALP tăng cao nổi trội (R < 2); ALT tăng vừa phải',
    typicalAgents: ['Amoxicillin-clavulanate', 'Cefazolin', 'Terbinafine', 'Azathioprine', 'Temozolomide'],
    clinicalFeatures: 'Ngứa da xuất hiện sớm và rất dữ dội, kèm vàng da ứ mật. Thường tự giới hạn nhưng thời gian thoái lui kéo dài hàng tháng.',
    prognosisAndMortality: 'Đa số lành tính, ít khi dẫn tới suy gan cấp. Tuy nhiên một số ca có thể biến chứng teo mất ống mật (Vanishing Bile Duct Syndrome - VBDS).',
    managementRecommendations: [
      'Ngừng thuốc nghi ngờ',
      'Điều trị triệu chứng ngứa bằng Cholestyramine hoặc Ursodeoxycholic acid (UDCA)',
      'Theo dõi Bilirubin và ALP định kỳ cho đến khi hồi phục hoàn toàn (có thể mất 3 - 6 tháng)'
    ]
  },
  {
    id: 'mixed-hepatitis',
    nameEn: 'Mixed hepatitis',
    nameVi: 'Viêm gan hỗn hợp (Tế bào gan & Ứ mật)',
    injuryType: 'Idiosyncratic',
    latency: 'Vài ngày đến vài tháng',
    enzymePattern: 'Cả ALT và ALP đều tăng ở mức độ vừa (2 ≤ R ≤ 5)',
    typicalAgents: ['Trimethoprim-sulfamethoxazole (TMP-SMZ)', 'Phenytoin', 'Kháng sinh Fluoroquinolone', 'Macrolide (Azithromycin)'],
    clinicalFeatures: 'Biểu hiện đan xen giữa hoại tử tế bào gan và ứ mật; thường đi kèm sốt hoặc ban da dị ứng.',
    prognosisAndMortality: 'Tiên lượng nói chung lành tính nhất trong các thể DILI, hiếm khi tiến triển thành suy gan cấp.',
    managementRecommendations: [
      'Ngừng thuốc nghi ngờ',
      'Đánh giá đáp ứng Dechallenge (men gan thường giảm trên 50% trong 30 ngày)'
    ]
  },
  {
    id: 'chronic-hepatitis-aih',
    nameEn: 'Chronic hepatitis / Drug-induced AIH',
    nameVi: 'Viêm gan mạn tính / Viêm gan dạng tự miễn do thuốc',
    injuryType: 'Idiosyncratic',
    latency: 'Vài tháng đến nhiều năm dùng thuốc liên tục',
    enzymePattern: 'ALT tăng vừa đến cao kéo dài, có thể kèm tăng Bilirubin; IgG tăng, tự kháng thể ANA/ASMA dương tính',
    typicalAgents: ['Nitrofurantoin', 'Minocycline', 'Hydralazine', 'Methyldopa', 'Statins', 'Fenofibrate'],
    clinicalFeatures: 'Khởi phát âm thầm, khó phân biệt với viêm gan tự miễn (AIH) nguyên phát tự phát. Mô bệnh học có thâm nhiễm tương bào.',
    prognosisAndMortality: 'Có thể tiến triển xơ gan nếu không phát hiện. Điểm then chốt: Tổn thương thoái lui hoàn toàn và KHÔNG tái phát sau khi ngừng thuốc và ngưng corticoid.',
    managementRecommendations: [
      'Ngừng ngay thuốc nghi ngờ',
      'Cân nhắc dùng đợt ngắn Glucocorticoid (Prednisone 20 - 60 mg/ngày) nếu tổn thương nặng',
      'Theo dõi tối thiểu 6 tháng sau khi ngừng corticoid để khẳng định không tái phát'
    ]
  },
  {
    id: 'bland-cholestasis',
    nameEn: 'Bland cholestasis',
    nameVi: 'Ứ mật đơn thuần không kèm viêm (Bland Cholestasis)',
    injuryType: 'Idiosyncratic',
    latency: '1 đến 3 tháng (30 – 90 ngày)',
    enzymePattern: 'Bilirubin tăng rất cao kéo dài (> 10 - 20 mg/dL), trong khi ALT và ALP chỉ tăng nhẹ hoặc gần bình thường',
    typicalAgents: ['Anabolic steroids (vận động viên thể hình, gymer)', 'Estrogen / Thuốc tránh thai đường uống'],
    clinicalFeatures: 'Vàng da rất đậm và ngứa dữ dội kéo dài. Sinh thiết gan cho thấy ứ mật trong vi quản mật nhưng hầu như không có hoại tử tế bào gan hay thâm nhiễm viêm.',
    prognosisAndMortality: 'Hồi phục rất chậm (vài tháng) nhưng hầu như luôn tự giới hạn, tử vong cực kỳ hiếm.',
    managementRecommendations: [
      'Ngừng hoàn toàn steroid thể hình hoặc estrogen',
      'Trấn an bệnh nhân rằng vàng da sẽ giảm chậm trong 2 - 4 tháng',
      'Dùng thuốc giảm ngứa hỗ trợ'
    ]
  },
  {
    id: 'acute-fatty-liver-lactic-acidosis',
    nameEn: 'Acute fatty liver with lactic acidosis',
    nameVi: 'Thoái hóa mỡ vi thể kèm toan lactic & suy gan',
    injuryType: 'Direct',
    latency: 'Vài ngày đến vài tháng',
    enzymePattern: 'Toan lactic máu nặng, ALT tăng khiêm tốn đến vừa, suy giảm chức năng gan',
    typicalAgents: ['Stavudine', 'Didanosine', 'Linezolid', 'Aspirin (Hội chứng Reye ở trẻ em)', 'Tetracycline tiêm TM'],
    clinicalFeatures: 'Độc tính ty thể nặng nề, ức chế chuỗi hô hấp tế bào và beta-oxy hóa acid béo. Mệt lả, lú lẫn, hôn mê, toan máu nặng, có thể viêm tụy và bệnh thần kinh ngoại biên kèm theo.',
    prognosisAndMortality: 'Nguy cơ tử vong rất cao nếu không điều chỉnh toan chuyển hóa và ngưng thuốc kịp thời.',
    managementRecommendations: [
      'Ngừng ngay lập tức thuốc nghi ngờ',
      'Hồi sức tích cực, truyền dịch glucose, kiềm hóa máu điều chỉnh toan lactic',
      'Theo dõi sát tại khoa Hồi sức tích cực (ICU)'
    ]
  },
  {
    id: 'sinusoidal-obstruction-syndrome',
    nameEn: 'Sinusoidal obstruction syndrome (SOS/VOD)',
    nameVi: 'Hội chứng tắc xoang gan (Veno-occlusive disease)',
    injuryType: 'Direct',
    latency: '1 đến 3 tuần sau phơi nhiễm liều cao',
    enzymePattern: 'Tăng men gan và Bilirubin biến đổi, ứ trệ tuần hoàn gan',
    typicalAgents: ['Busulfan', 'Cyclophosphamide (chuẩn bị ghép tủy/tế bào gốc)', 'Gemtuzumab ozogamicin', 'Thảo dược chứa Pyrrolizidine alkaloids'],
    clinicalFeatures: 'Tổn thương tế bào nội mô xoang gan gây tắc nghẽn dòng máu tĩnh mạch cửa qua gan. Tam chứng kinh điển: Đau hạ sườn phải, gan to ứ máu, tăng cân nhanh do ứ dịch / báng bụng, sau đó xuất hiện vàng da.',
    prognosisAndMortality: 'Thể nặng có suy đa cơ quan với tỷ lệ tử vong cao.',
    managementRecommendations: [
      'Hạn chế muối dịch, dùng lợi tiểu cẩn trọng',
      'Xem xét dùng Defibrotide (thuốc bảo vệ nội mô xoang gan) ở thể nặng có suy cơ quan',
      'Hội chẩn chuyên khoa ghép tủy và huyết học'
    ]
  },
  {
    id: 'nodular-regenerative-hyperplasia',
    nameEn: 'Nodular regenerative hyperplasia (NRH)',
    nameVi: 'Tăng sản nốt tái tạo (Tăng áp lực tĩnh mạch cửa không xơ gan)',
    injuryType: 'Direct',
    latency: 'Vài năm dùng thuốc kéo dài',
    enzymePattern: 'Men gan ALT và ALP hoàn toàn bình thường hoặc chỉ tăng rất nhẹ',
    typicalAgents: ['Thioguanine', 'Azathioprine', 'Mercaptopurine', 'Oxaliplatin (sau hóa trị ung thư đại trực tràng)', 'Zidovudine/Didanosine kéo dài'],
    clinicalFeatures: 'Tăng áp lực tĩnh mạch cửa không do xơ gan: Xuất huyết do giãn vỡ tĩnh mạch thực quản, lách to, giảm tiểu cầu, báng bụng nhưng cấu trúc tiểu thùy gan không xơ hóa toàn bộ mà có các nốt tế bào gan tái tạo chèn ép vi mạch.',
    prognosisAndMortality: 'Nguy cơ xuất huyết tiêu hóa do vỡ giãn tĩnh mạch; tiên lượng phụ thuộc kiểm soát biến chứng tăng áp cửa.',
    managementRecommendations: [
      'Dừng vĩnh viễn thuốc liên quan',
      'Nội soi tầm soát và thắt búi giãn tĩnh mạch thực quản dự phòng xuất huyết',
      'Điều trị tăng áp lực tĩnh mạch cửa theo phác đồ chuẩn'
    ]
  },
  {
    id: 'immunoallergic-hepatitis',
    nameEn: 'Immunoallergic hepatitis',
    nameVi: 'Viêm gan quá mẫn dị ứng miễn dịch (DRESS / SJS)',
    injuryType: 'Idiosyncratic',
    latency: '1 đến 8 tuần',
    enzymePattern: 'Men gan tăng cao hỗn hợp hoặc tế bào gan kèm tăng bạch cầu ái toan máu',
    typicalAgents: ['Allopurinol', 'Carbamazepine', 'Phenytoin', 'Sulfonamides', 'Kháng sinh Macrolide'],
    clinicalFeatures: 'Tam chứng dị ứng kinh điển: Sốt cao, phát ban toàn thân (ban dạng sởi, mụn mủ, bong vảy hoặc hoại tử thượng bì), tăng bạch cầu ái toan (eosinophilia), hạch to. Thể nặng: DRESS syndrome, Stevens-Johnson (SJS), Hoại tử thượng bì nhiễm độc (TEN).',
    prognosisAndMortality: 'Hội chứng DRESS có tỷ lệ tử vong 5 - 10% nếu có tổn thương nội tạng nặng nề.',
    managementRecommendations: [
      'CẤP CỨU: Ngừng ngay toàn bộ thuốc nghi ngờ',
      'Chỉ định Corticosteroids toàn thân liều cao đối với hội chứng DRESS',
      'Hội chẩn Da liễu và Dị ứng miễn dịch lâm sàng'
    ]
  }
];

// Danh mục Top 25 thuốc kê đơn gây DILI hàng đầu theo nghiên cứu DILIN (Chalasani et al. & NEJM Table 3)
export const TOP_DILI_PRESCRIPTION_DRUGS: DILIDrugEntry[] = [
  {
    name: 'Amoxicillin-clavulanate',
    nameVi: 'Amoxicillin + Acid Clavulanic (Augmentin)',
    rank: 1,
    category: 'Antibiotic',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Cholestatic or mixed hepatitis (Viêm gan ứ mật hoặc hỗn hợp)',
    typicalLatency: 'Vài tuần sau khi dùng (thường phát tác sau khi đã kết thúc đợt kháng sinh 1 - 3 tuần)',
    hlaAssociation: 'HLA-A*02:01, HLA-DRB1*15:01',
    riskNotes: 'Nguyên nhân gây DILI hàng đầu chiếm 10.1% các ca. Thường gặp hơn ở nam giới và người cao tuổi. Nguy cơ do thành phần Clavulanate.',
    actionGuidance: 'Ngừng ngay thuốc. Bệnh thường tự thoái lui trong 1 - 4 tháng. Điều trị ngứa nếu cần.'
  },
  {
    name: 'Isoniazid (INH)',
    nameVi: 'Isoniazid (Thuốc chống lao hàng 1)',
    rank: 2,
    category: 'Antibiotic',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Acute hepatocellular hepatitis (Viêm gan hoại tử tế bào gan cấp)',
    typicalLatency: '2 đến 12 tuần (có thể đến 6 tháng)',
    riskNotes: 'Chiếm 5.3% ca DILI. Tỷ lệ mắc khoảng 1/1.000 người dùng. Nguy cơ tăng ở người nghiện rượu, suy dinh dưỡng, cao tuổi. Thường tuân theo Định luật Hy nếu có vàng da.',
    actionGuidance: 'Ngừng ngay khi ALT > 3x ULN kèm triệu chứng hoặc ALT > 5x ULN không triệu chứng. Theo dõi sát chức năng gan.'
  },
  {
    name: 'Nitrofurantoin',
    nameVi: 'Nitrofurantoin (Kháng sinh đường tiết niệu)',
    rank: 3,
    category: 'Antibiotic',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Acute or chronic hepatocellular hepatitis / Drug-induced AIH',
    typicalLatency: 'Dùng ngắn ngày: cấp tính (vài tuần); Dùng dự phòng kéo dài: mạn tính (vài tháng đến nhiều năm)',
    riskNotes: 'Chiếm 4.7% ca DILI. Hay gặp ở phụ nữ lớn tuổi dùng dự phòng nhiễm trùng tiểu tái phát. Tự kháng thể ANA/SMA thường dương tính cao.',
    actionGuidance: 'Ngừng thuốc vĩnh viễn. Nếu tổn thương mạn tính nặng, chỉ định đợt ngắn Prednisone.'
  },
  {
    name: 'TMP-SMZ (Trimethoprim-Sulfamethoxazole)',
    nameVi: 'Co-trimoxazole / Bactrim (TMP-SMZ)',
    rank: 4,
    category: 'Antibiotic',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Mixed hepatitis, Immunoallergic (DRESS/SJS)',
    typicalLatency: 'Vài ngày đến vài tuần',
    riskNotes: 'Chiếm 3.4% ca DILI. Thường đi kèm sốt, phát ban, tăng bạch cầu ái toan, tổn thương thận.',
    actionGuidance: 'Ngừng thuốc ngay lập tức. Chống chỉ định tái sử dụng nhóm Sulfonamide.'
  },
  {
    name: 'Minocycline',
    nameVi: 'Minocycline (Tetracycline thế hệ mới trị mụn)',
    rank: 5,
    category: 'Antibiotic',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Acute or chronic hepatocellular hepatitis / Drug-induced AIH',
    typicalLatency: 'Hàng tháng đến hàng năm điều trị mụn trứng cá',
    riskNotes: 'Chiếm 3.1% ca DILI. Rất thường kích hoạt bệnh cảnh giả viêm gan tự miễn (AIH) ở người trẻ.',
    actionGuidance: 'Ngừng minocycline. Thường khỏi hoàn toàn sau khi dừng thuốc.'
  },
  {
    name: 'Cefazolin',
    nameVi: 'Cefazolin (Cephalosporin thế hệ 1 tiêm TM)',
    rank: 6,
    category: 'Antibiotic',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Cholestatic hepatitis (Viêm gan ứ mật)',
    typicalLatency: '1 đến 3 tuần (thường chỉ sau duy nhất 1 liều tiêm dự phòng phẫu thuật)',
    riskNotes: 'Chiếm 2.2% ca DILI. Điển hình là ngứa và vàng da xuất hiện 1-2 tuần sau phẫu thuật ngoại trú.',
    actionGuidance: 'Trấn an bệnh nhân, theo dõi ALP và Bilirubin, điều trị ngứa.'
  },
  {
    name: 'Azithromycin',
    nameVi: 'Azithromycin (Kháng sinh Macrolide)',
    rank: 7,
    category: 'Antibiotic',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Hepatocellular, mixed, or cholestatic hepatitis',
    typicalLatency: '1 đến 3 tuần',
    riskNotes: 'Chiếm 2.0% ca DILI. Có thể kèm biểu hiện dị ứng nổi mề đay.',
    actionGuidance: 'Dừng thuốc và chuyển đổi kháng sinh nhóm khác nếu còn nhiễm trùng.'
  },
  {
    name: 'Ciprofloxacin',
    nameVi: 'Ciprofloxacin (Kháng sinh Fluoroquinolone)',
    rank: 8,
    category: 'Antibiotic',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Hepatocellular, mixed, or cholestatic hepatitis',
    typicalLatency: 'Vài ngày đến 3 tuần',
    riskNotes: 'Chiếm 1.8% ca DILI. Thường khởi phát nhanh.',
    actionGuidance: 'Ngừng thuốc và theo dõi men gan.'
  },
  {
    name: 'Levofloxacin',
    nameVi: 'Levofloxacin (Kháng sinh Fluoroquinolone)',
    rank: 9,
    category: 'Antibiotic',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Hepatocellular, mixed, or cholestatic hepatitis',
    typicalLatency: 'Vài ngày đến 3 tuần',
    riskNotes: 'Chiếm 1.4% ca DILI.',
    actionGuidance: 'Ngừng thuốc ngay.'
  },
  {
    name: 'Diclofenac',
    nameVi: 'Diclofenac (Voltaren - NSAID)',
    rank: 10,
    category: 'NSAID',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Acute or chronic hepatocellular hepatitis',
    typicalLatency: '1 đến 6 tháng (trung bình 30 - 90 ngày)',
    riskNotes: 'Chiếm 1.3% ca DILI. Tỷ lệ mắc 1/10.000 người dùng. Là NSAID gây DILI hoại tử gan nặng nhất, nguy cơ tử vong cao nếu không phát hiện sớm.',
    actionGuidance: 'Ngừng ngay lập tức. Kiểm tra tiêu chuẩn Hy\'s Law.'
  },
  {
    name: 'Phenytoin',
    nameVi: 'Phenytoin (Thuốc chống động kinh)',
    rank: 11,
    category: 'Anticonvulsant',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Hepatocellular or mixed hepatitis with DRESS syndrome',
    typicalLatency: '2 đến 8 tuần',
    riskNotes: 'Thường biểu hiện hội chứng quá mẫn chống co giật (AHS/DRESS): sốt, nổi ban, sưng hạch, tăng bạch cầu ái toan.',
    actionGuidance: 'Ngừng vĩnh viễn thuốc. Không đổi sang Carbamazepine vì dị ứng chéo.'
  },
  {
    name: 'Methyldopa',
    nameVi: 'Methyldopa (Thuốc hạ huyết áp thai kỳ)',
    rank: 12,
    category: 'Cardiovascular',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Hepatocellular or mixed hepatitis, giả tự miễn',
    typicalLatency: '2 đến 6 tháng',
    riskNotes: 'Thường dùng ở phụ nữ mang thai tăng huyết áp. Có thể kích hoạt tan máu tự miễn (Coombs dương tính) kèm viêm gan.',
    actionGuidance: 'Đổi sang Labetalol hoặc Nifedipine.'
  },
  {
    name: 'Azathioprine / 6-MP',
    nameVi: 'Azathioprine / 6-Mercaptopurine (Imuran)',
    rank: 13,
    category: 'Antineoplastic / Immunotherapy',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Cholestatic hepatitis; Liều dài ngày: SOS/VOD hoặc NRH',
    typicalLatency: 'Viêm gan ứ mật: vài tuần; NRH: vài năm',
    riskNotes: 'Độc tính phụ thuộc hoạt tính men TPMT. Dùng lâu ngày có thể gây tăng sản nốt tái tạo (NRH) và tăng áp lực tĩnh mạch cửa.',
    actionGuidance: 'Kiểm tra hoạt tính TPMT hoặc xét nghiệm nồng độ chất chuyển hóa 6-TGN / 6-MMP.'
  }
];

// Nhóm thuốc gây độc TRỰC TIẾP (Direct Hepatotoxins)
export const DIRECT_HEPATOTOXINS: DILIDrugEntry[] = [
  {
    name: 'Acetaminophen (Paracetamol) overdose',
    nameVi: 'Paracetamol liều cao / quá liều (> 4g/ngày hoặc ngộ độc cấp)',
    category: 'Other',
    mechanism: 'Direct',
    majorPhenotypes: 'Acute hepatic necrosis (Hoại tử tế bào gan cấp vùng 3)',
    typicalLatency: '24 đến 72 giờ sau khi uống',
    riskNotes: 'Nguyên nhân số 1 gây suy gan cấp ở phương Tây. Chất chuyển hóa độc NAPQI làm cạn kiệt Glutathione tế bào gan dẫn tới hoại tử ồ ạt. Nguy cơ tăng vọt ở người nghiện rượu, nhịn đói lâu ngày.',
    actionGuidance: 'Định lượng nồng độ Paracetamol máu đối chiếu đồ thị Rumack-Matthew. Truyền N-acetylcysteine (NAC) đường tĩnh mạch ngay lập tức. Theo dõi sát INR, Khí máu động mạch, Creatinine.'
  },
  {
    name: 'Intravenous Amiodarone',
    nameVi: 'Amiodarone tiêm truyền tĩnh mạch liều cao',
    category: 'Cardiovascular',
    mechanism: 'Direct',
    majorPhenotypes: 'Acute hepatic necrosis (Hoại tử tế bào gan cấp)',
    typicalLatency: '1 đến 3 ngày sau bolus hoặc truyền tĩnh mạch nhanh',
    riskNotes: 'Gây tăng vọt ALT cấp tính kèm tụt huyết áp/thiếu máu cục bộ xoang gan. Dạng uống thường dung nạp tốt hơn.',
    actionGuidance: 'Giảm tốc độ truyền hoặc ngừng amiodarone TM; men gan thường hạ nhanh sau khi ngừng.'
  },
  {
    name: 'Amanita phalloides toxin',
    nameVi: 'Độc tố nấm tán trắng / nấm tử thần (Amatoxin)',
    category: 'Supplement / Herbal',
    mechanism: 'Direct',
    majorPhenotypes: 'Massive acute hepatic necrosis (Hoại tử gan ồ ạt tối cấp)',
    typicalLatency: '6 đến 24 giờ đau bụng tiêu chảy, hoại tử gan xuất hiện sau 48 - 72 giờ',
    riskNotes: 'Ức chế RNA polymerase II tế bào gan. Tỷ lệ tử vong rất cao do suy gan tối cấp và suy thận.',
    actionGuidance: 'Rửa dạ dày, than hoạt tính đa liều, Silibinin tiêm TM, Penicillin G liều cao, hội chẩn ghép gan khẩn cấp.'
  }
];

// Nhóm thuốc gây độc GIÁN TIẾP (Indirect Hepatotoxins - Khái niệm đột phá NEJM 2019)
export const INDIRECT_HEPATOTOXINS: DILIDrugEntry[] = [
  {
    name: 'Immune Checkpoint Inhibitors (ICI - Anti-PD1, Anti-CTLA4)',
    nameVi: 'Thuốc ức chế điểm kiểm soát miễn dịch ung thư (Pembrolizumab, Nivolumab, Ipilimumab)',
    category: 'Antineoplastic / Immunotherapy',
    mechanism: 'Indirect',
    majorPhenotypes: 'Immune-mediated acute hepatitis (Viêm gan qua trung gian miễn dịch)',
    typicalLatency: '2 đến 12 tuần (thường sau 1 - 3 chu kỳ truyền)',
    riskNotes: 'Thuốc phá vỡ ức chế tự miễn dịch của tế bào T để diệt ung thư, dẫn đến kích hoạt tế bào T tự phản ứng tấn công tế bào gan. Không phải do độc tính phân tử thuốc mà do tác động điều biến miễn dịch.',
    actionGuidance: 'Theo dõi men gan trước mỗi chu kỳ truyền. Nếu ALT > 3 - 5x ULN (Độ 2): Tạm hoãn thuốc, dùng Corticoid (Prednisone 0.5 - 1 mg/kg/ngày). Nếu ALT > 5x ULN (Độ 3-4): Ngừng vĩnh viễn thuốc, Methylprednisolone 1 - 2 mg/kg/ngày, cân nhắc Mycophenolate mofetil nếu kháng steroid.'
  },
  {
    name: 'Anti-CD20 (Rituximab) & Immunosuppressants',
    nameVi: 'Rituximab (Kháng CD20) & Thuốc ức chế miễn dịch liều cao',
    category: 'Antineoplastic / Immunotherapy',
    mechanism: 'Indirect',
    majorPhenotypes: 'Hepatitis B reactivation (Bùng phát tái hoạt Viêm gan virus B)',
    typicalLatency: 'Trong quá trình điều trị hoặc sau khi kết thúc đợt ức chế miễn dịch vài tuần/tháng',
    riskNotes: 'Làm suy kiệt tế bào B khiến virus HBV nhân lên ồ ạt; khi hệ miễn dịch hồi phục sẽ tấn công phá hủy tế bào gan gây viêm gan bùng phát tối cấp.',
    actionGuidance: 'BẮT BUỘC sàng lọc HBsAg và Anti-HBc trước khi bắt đầu. Điều trị dự phòng kháng virus (Entecavir / Tenofovir) cho mọi bệnh nhân có nguy cơ.'
  },
  {
    name: 'Anti-retroviral Therapy (HAART / ART)',
    nameVi: 'Thuốc kháng retrovirus điều trị HIV',
    category: 'Other',
    mechanism: 'Indirect',
    majorPhenotypes: 'Immune reconstitution hepatitis (Bùng phát viêm gan do phục hồi miễn dịch - IRIS)',
    typicalLatency: 'Vài tuần đến vài tháng sau khi tải lượng virus HIV giảm và CD4 tăng',
    riskNotes: 'Sự phục hồi nhanh chóng của số lượng tế bào T CD4 tấn công các tế bào gan nhiễm HBV hoặc HCV đồng nhiễm.',
    actionGuidance: 'Phối hợp phác đồ điều trị đồng thời cả HIV và viêm gan virus B/C.'
  }
];

// Nhóm Thảo dược & Thực phẩm chức năng (HDS - Herbal & Dietary Supplements)
export const HERBAL_SUPPLEMENT_TOXINS: DILIDrugEntry[] = [
  {
    name: 'Green tea extract (Camellia sinensis / Catechins)',
    nameVi: 'Tinh chất trà xanh liều cao (chứa Catechin / EGCG trong viên giảm cân)',
    category: 'Supplement / Herbal',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Acute hepatocellular hepatitis (Viêm gan hoại tử cấp, có thể suy gan tối cấp)',
    typicalLatency: 'Vài tuần đến vài tháng uống viên nang giảm cân',
    riskNotes: 'Thường gặp trong các sản phẩm giảm cân thương mại (như SLIMQUICK, Hydroxycut). Nồng độ Catechin cô đặc cao gấp hàng chục lần uống trà thông thường, gây hoại tử tế bào gan với tỷ lệ phải ghép gan cao.',
    actionGuidance: 'Khuyên bệnh nhân ngừng ngay toàn bộ thực phẩm chức năng giảm cân. Theo dõi sát men gan và chức năng đông máu.'
  },
  {
    name: 'Anabolic-Androgenic Steroids (AAS)',
    nameVi: 'Steroid đồng hóa tăng cơ (thể hình / gymer dùng bất hợp pháp)',
    category: 'Supplement / Herbal',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Bland cholestasis (Ứ mật đơn thuần kéo dài)',
    typicalLatency: '1 đến 3 tháng sau chu kỳ dùng steroid uống/tiêm',
    riskNotes: 'Gặp ở nam giới trẻ tuổi tập thể hình. Bilirubin máu tăng rất cao (thường > 15 - 25 mg/dL) gây vàng mắt đậm và ngứa dai dẳng, trong khi ALT và ALP chỉ tăng khiêm tốn. Mô bệnh học ứ mật vi quản nhưng tế bào gan không hoại tử.',
    actionGuidance: 'Dừng vĩnh viễn steroid thể hình. Trấn an bệnh nhân tình trạng vàng da sẽ thoái lui chậm sau 2 - 4 tháng.'
  },
  {
    name: 'Multi-ingredient Dietary Supplements (Proprietary blends)',
    nameVi: 'Thực phẩm chức năng hỗn hợp đa thành phần (Thảo dược trôi nổi)',
    category: 'Supplement / Herbal',
    mechanism: 'Idiosyncratic',
    majorPhenotypes: 'Acute hepatocellular or mixed hepatitis',
    typicalLatency: '2 đến 12 tuần',
    riskNotes: 'Chứa 5 - 20 thành phần thảo mộc không rõ hàm lượng và chất lượng. Chiếm tới 20% các ca DILI hiện nay tại Mỹ.',
    actionGuidance: 'Rà soát kỹ mọi loại thuốc nam, thuốc bắc, viên uống thực phẩm bổ sung bệnh nhân đang dùng và đình chỉ toàn bộ.'
  }
];

// Danh sách tổng hợp toàn bộ các chất gây DILI để tra cứu và tìm kiếm
export const ALL_DILI_AGENTS: DILIDrugEntry[] = [
  ...TOP_DILI_PRESCRIPTION_DRUGS,
  ...DIRECT_HEPATOTOXINS,
  ...INDIRECT_HEPATOTOXINS,
  ...HERBAL_SUPPLEMENT_TOXINS
];

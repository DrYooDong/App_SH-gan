export interface FlowchartBranch {
  id: string;
  title: string;
  conditionDescription: string;
  color: string;
  clinicalActions: string[];
  furtherInvestigations: string[];
  keyDiagnosticPearls: string[];
}

export interface ClinicalAlgorithm {
  id: string;
  title: string;
  subtitle: string;
  sourceGuideline: string;
  overview: string;
  branches: FlowchartBranch[];
}

export const CLINICAL_ALGORITHMS: ClinicalAlgorithm[] = [
  {
    id: 'algo-transaminases',
    title: 'Lưu Đồ Tiếp Cận Tăng Aminotransferase (ALT / AST)',
    subtitle: 'Phân tầng nguy cơ và thứ tự xét nghiệm theo nồng độ bội số giới hạn trên bình thường (ULN)',
    sourceGuideline: 'ACG Clinical Guideline 2017 & Gastroenterology 2026',
    overview: 'Dựa trên nồng độ ALT ULN chuẩn là 33 U/L (nam) và 25 U/L (nữ). Việc tiếp cận được phân thành 5 mức độ để cân bằng giữa chi phí, tránh xét nghiệm tràn lan không cần thiết và không bỏ sót các cấp cứu tối khẩn.',
    branches: [
      {
        id: 'borderline-mild',
        title: 'Tăng nhẹ & Ranh giới (< 2x đến 2 - 5x ULN)',
        conditionDescription: 'ALT hoặc AST tăng dưới 5 lần ULN (thường ALT < 120-165 U/L). Bệnh nhân không có dấu hiệu suy gan cấp.',
        color: 'emerald',
        clinicalActions: [
          'Khai thác kỹ tiền sử: lượng rượu bia uống hàng tuần, thuốc kê đơn, thuốc OTC, thực phẩm chức năng, thảo dược, tiền sử truyền máu hoặc xăm mình.',
          'Ngưng ngay thuốc có độc tính gan tiềm ẩn và rượu bia.',
          'Đánh giá các yếu tố nguy cơ của Gan thoái hóa mỡ chuyển hóa (MASLD): BMI, vòng bụng, đái tháo đường, rối loạn lipid máu, tăng huyết áp.',
          'Lặp lại xét nghiệm sau 2-4 tuần để xác nhận tính chất tăng dai dẳng trước khi làm bilan chuyên sâu tốn kém.'
        ],
        furtherInvestigations: [
          'Xét nghiệm ban đầu (Bậc 1): HBsAg, anti-HBs, anti-HBc, anti-HCV (khẳng định bằng HCV RNA nếu dương tính).',
          'Siêu âm ổ bụng tổng quát: kiểm tra cấu trúc nhu mô gan (gan nhiễm mỡ, xơ gan thô), kích thước lách, đường kính tĩnh mạch cửa (bình thường < 12mm).',
          'Bilan sắt: Sắt huyết thanh, Ferritin, Độ bão hòa Transferrin (nếu TSAT ≥ 45% -> xem xét phân tích đột biến gen HFE).',
          'Nếu men gan vẫn tăng dai dẳng > 3 - 6 tháng không rõ nguyên nhân (Bậc 2): ANA, ASMA, Định lượng IgG, Ceruloplasmin (nếu < 55 tuổi), Phenotype Alpha-1 Antitrypsin, Kháng thể Celiac (anti-tTG IgA), TSH.'
        ],
        keyDiagnosticPearls: [
          'Tỷ số AST/ALT > 2:1 rất gợi ý bệnh gan do rượu (ALD).',
          'Tính ngay chỉ số FIB-4: nếu < 1.30 có thể loại trừ an tâm xơ hóa tiến triển (NPV > 90%).'
        ]
      },
      {
        id: 'moderate',
        title: 'Tăng mức độ vừa (5 - 15x ULN)',
        conditionDescription: 'ALT hoặc AST trong khoảng 165 - 500 U/L. Thường gặp trong viêm gan cấp hoặc đợt bùng phát cấp của viêm gan mạn.',
        color: 'amber',
        clinicalActions: [
          'Khám phát hiện ngay các dấu hiệu cảnh báo suy gan cấp: tri giác thay đổi, mất định hướng, dấu run vỗ cánh (Asterixis), xuất huyết dưới da.',
          'Đánh giá chức năng tổng hợp khẩn: PT/INR và Albumin.',
          'Nếu có vàng da hoặc đau hạ sườn phải: siêu âm cấp cứu tìm sỏi mật di chuyển hoặc tắc mạch gan.'
        ],
        furtherInvestigations: [
          'Hội chứng viêm gan virus cấp: IgM anti-HAV, HBsAg + IgM anti-HBc, anti-HCV kèm HCV RNA PCR.',
          'Tự miễn: ANA, ASMA, Anti-LKM1, Định lượng IgG toàn phần.',
          'Chuyển hóa & Độc chất: Bilan sắt, Ceruloplasmin, nồng độ Acetaminophen huyết thanh.',
          'Siêu âm Doppler mạch máu gan: Đánh giá tưới máu động mạch gan và hệ thống tĩnh mạch gan (loại trừ hội chứng Budd-Chiari).'
        ],
        keyDiagnosticPearls: [
          'Ở mức 5-15x ULN, các nguyên nhân virus cấp, viêm gan tự miễn cấp và độc chất chiếm ưu thế áp đảo so với MASLD thuần túy.'
        ]
      },
      {
        id: 'severe-massive',
        title: 'Tăng nặng (>15x ULN) & Khổng lồ (>10,000 U/L)',
        conditionDescription: 'ALT hoặc AST > 500 U/L (thường vài nghìn đến > 10,000 U/L). Tình trạng hoại tử tế bào gan ồ ạt cấp tính!',
        color: 'rose',
        clinicalActions: [
          'ĐÁNH GIÁ NGUY CƠ SUY GAN CẤP (ALF): Nếu INR ≥ 1.5 + Bệnh não gan -> Kích hoạt ngay quy trình hội chẩn khẩn cấp trung tâm ghép gan!',
          'Khảo sát ngay 3 nguyên nhân hàng đầu của mức >10,000 U/L: (1) Ngộ độc Acetaminophen; (2) Sốc gan do thiếu máu cục bộ (Ischemic hepatopathy); (3) Nấm độc Amanita phalloides.',
          'Chỉ định ngay N-Acetylcysteine (NAC) đường tĩnh mạch nếu nghi ngờ ngộ độc Paracetamol (không chờ kết quả xét nghiệm định lượng).',
          'Khôi phục huyết động học khẩn cấp nếu có tụt huyết áp, sốc tim hoặc sốc nhiễm trùng.'
        ],
        furtherInvestigations: [
          'Định lượng nồng độ Paracetamol huyết thanh, Khí máu động mạch (đánh giá toan lactic), Lactate máu, Khám độc chất nước tiểu.',
          'Siêu âm Doppler mạch máu gan cấp cứu.',
          'Hội chứng virus: IgM HAV, HBsAg, IgM anti-HBc, Anti-HCV, HSV, EBV, CMV serology/PCR.',
          'Xem xét sinh thiết gan chẩn đoán nếu tình trạng lâm sàng ổn định và bilan không xâm lấn không tìm ra nguyên nhân.'
        ],
        keyDiagnosticPearls: [
          'Trong thiếu máu cục bộ gan (Shock Liver), AST thường tăng cao hơn ALT và LDH tăng vọt gấp hàng chục lần; men gan giảm rất nhanh sau khi hồi sức tưới máu tốt.',
          'Độ cao tuyệt đối của transaminase không tỷ lệ thuận với khả năng sống còn; sự tụt giảm đột ngột của men gan đi kèm INR tiếp tục kéo dài và Bilirubin tăng vọt là dấu hiệu cạn kiệt tế bào gan (hoại tử toàn bộ).'
        ]
      }
    ]
  },
  {
    id: 'algo-cholestasis',
    title: 'Lưu Đồ Tiếp Cận Men Ứ Mật (Alkaline Phosphatase & GGT)',
    subtitle: 'Xác nhận nguồn gốc gan, định hướng tắc mật ngoài gan và các bệnh ứ mật trong gan',
    sourceGuideline: 'ACG Guideline & WHO Session 4',
    overview: 'Alkaline Phosphatase (ALP) tăng gợi ý tổn thương đường mật hoặc ứ mật. Lưu đồ chuẩn giúp phân định chính xác nguồn gốc cơ quan và lựa chọn kỹ thuật hình ảnh thích hợp.',
    branches: [
      {
        id: 'alp-isolated',
        title: 'Bước 1: Khẳng định nguồn gốc gan của ALP',
        conditionDescription: 'ALP tăng đơn độc trong khi ALT, AST và Bilirubin hoàn toàn bình thường.',
        color: 'sky',
        clinicalActions: [
          'Chỉ định xét nghiệm GGT (Gamma-Glutamyl Transferase) hoặc 5\'-Nucleotidase.',
          'Nếu GGT Bình Thường: ALP KHÔNG có nguồn gốc từ gan. Tìm nguyên nhân từ xương (bệnh Paget, di căn xương, nhuyễn xương do thiếu vitamin D), nhau thai (mang thai 3 tháng cuối) hoặc tăng sinh lý tuổi dậy thì.',
          'Nếu GGT Tăng Cao: Khẳng định ALP có nguồn gốc từ gan mật. Chuyển sang Bước 2 (Siêu âm gan mật).'
        ],
        furtherInvestigations: [
          'Nếu nghi ngờ nguồn gốc xương: Định lượng Canxi, Phospho máu, 25-OH Vitamin D, PTH, Chụp xạ hình xương nếu nghi ngờ u di căn.'
        ],
        keyDiagnosticPearls: [
          'GGT không có trong mô xương, là chìa khóa phân biệt rẻ tiền và đáng tin cậy nhất.'
        ]
      },
      {
        id: 'biliary-dilated',
        title: 'Bước 2A: Siêu âm thấy đường mật dãn (Tắc mật ngoài gan)',
        conditionDescription: 'Đường mật trong gan hoặc ngoài gan dãn (ống mật chủ > 6-7mm ở người trẻ hoặc > 10mm sau cắt túi mật).',
        color: 'amber',
        clinicalActions: [
          'Chẩn đoán: Tắc nghẽn cơ học đường mật.',
          'Đánh giá tam chứng Charcot (Đau HSP + Sốt + Vàng da) để phát hiện Viêm đường mật cấp nhiễm trùng.',
          'Chỉ định hình ảnh học độ phân giải cao: Chụp cộng hưởng từ mật tụy (MRCP) hoặc CT ngực bụng đa dãy có cản quang.'
        ],
        furtherInvestigations: [
          'Nội soi mật tụy ngược dòng (ERCP): Vừa chẩn đoán vừa can thiệp lấy sỏi, cắt cơ vòng Oddi hoặc đặt stent giải áp đường mật.',
          'Nội soi siêu âm (EUS): Nhạy cảm tối đa với sỏi bùn ống mật chủ đoạn thấp và khối u bóng Vater / đầu tụy.'
        ],
        keyDiagnosticPearls: [
          'Sỏi mật là nguyên nhân lành tính phổ biến nhất; ở người cao tuổi sút cân không đau bụng phải đặc biệt cảnh giác u đầu tụy hoặc ung thư đường mật (Klatskin).'
        ]
      },
      {
        id: 'biliary-nondilated',
        title: 'Bước 2B: Siêu âm đường mật không dãn (Ứ mật trong gan)',
        conditionDescription: 'Nhu mô gan đồng nhất hoặc thô nhẹ, hệ thống đường mật hoàn toàn không có dấu hiệu dãn nở.',
        color: 'indigo',
        clinicalActions: [
          'Rà soát ngay tiền sử dùng thuốc: Amoxicillin-Clavulanate, anabolic steroids, thuốc tránh thai, TMP-SMZ.',
          'Xét nghiệm tự kháng thể: Kháng thể kháng ty thể (AMA) để chẩn đoán Viêm đường mật tiên phát (PBC).',
          'Khảo sát Viêm xơ đường mật tiên phát (PSC): Khai thác bệnh sử viêm loét đại tràng (IBD), xét nghiệm IgG4.'
        ],
        furtherInvestigations: [
          'Nếu AMA (+): Chẩn đoán xác định PBC nếu ALP > 1.5x ULN (không cần sinh thiết gan). Khởi trị ngay Ursodeoxycholic acid (UDCA).',
          'Nếu AMA (-) và nghi ngờ PSC hoặc bệnh đường mật nhỏ: Chỉ định MRCP đánh giá hình thái cây mật (tìm hình ảnh hẹp dãn chuỗi hạt).',
          'Cân nhắc sinh thiết gan nếu AMA(-) và ALP vẫn tăng >2x kéo dài để loại trừ PBC âm tính với AMA, bệnh u hạt (Sarcoidosis), thoái hóa amyloid hoặc hội chứng biến mất đường mật.'
        ],
        keyDiagnosticPearls: [
          'Phụ nữ trung niên có ngứa da dai dẳng + ALP tăng + AMA(+) là bộ ba chẩn đoán xác định PBC.'
        ]
      }
    ]
  },
  {
    id: 'algo-bilirubin',
    title: 'Lưu Đồ Tiếp Cận Tăng Bilirubin & Vàng Da',
    subtitle: 'Phân đoạn Bilirubin gián tiếp vs liên hợp và cây quyết định chẩn đoán',
    sourceGuideline: 'WHO Training Session 4 & ACG Guideline',
    overview: 'Bước đầu tiên và quan trọng nhất khi tiếp cận bệnh nhân vàng da hoặc tăng bilirubin là phân đoạn (Fractionation) thành Bilirubin Trực tiếp (liên hợp) và Gián tiếp (tự do).',
    branches: [
      {
        id: 'bili-unconjugated',
        title: 'Ưu thế Bilirubin Gián tiếp / Tự do (<20% liên hợp)',
        conditionDescription: 'Bilirubin toàn phần tăng, trong đó Bilirubin trực tiếp chỉ chiếm dưới 20% tổng lượng.',
        color: 'amber',
        clinicalActions: [
          'Loại trừ ngay hiện tượng tán huyết (Hemolysis): Kiểm tra tổng phân tích tế bào máu, Haptoglobin, LDH, hồng cầu lưới, nghiệm pháp Coombs.',
          'Nếu có bằng chứng tán huyết: Chuyển khám chuyên khoa Huyết học tìm nguyên nhân (Thalassemia, thiếu men G6PD, tán huyết miễn dịch).',
          'Nếu KHÔNG có tán huyết và các men gan (ALT, AST, ALP, GGT) hoàn toàn bình thường: Chẩn đoán Hội chứng Gilbert.'
        ],
        furtherInvestigations: [
          'Hội chứng Gilbert: Bilirubin thường < 3 - 4 mg/dL, tăng lên khi nhịn ăn hoặc stress. Có thể làm xét nghiệm di truyền gen UGT1A1 nếu cần xác nhận pháp lý/bảo hiểm.',
          'Hội chứng Crigler-Najjar (rất hiếm ở người lớn): Thường khởi phát nặng từ giai đoạn sơ sinh.'
        ],
        keyDiagnosticPearls: [
          'Bilirubin gián tiếp không tan trong nước, không qua nước tiểu (nước tiểu không có sắc tố mật).'
        ]
      },
      {
        id: 'bili-conjugated',
        title: 'Ưu thế Bilirubin Trực tiếp / Liên hợp (>50% liên hợp)',
        conditionDescription: 'Bilirubin toàn phần tăng, trong đó Bilirubin trực tiếp chiếm trên 50%.',
        color: 'rose',
        clinicalActions: [
          'Đây là dấu hiệu chắc chắn của bệnh lý tế bào gan hoặc tắc nghẽn đường dẫn mật (Biliary or Hepatocellular disease).',
          'Bilirubin trực tiếp tan trong nước, thải qua nước tiểu làm nước tiểu có màu vàng sẫm sủi bọt vàng (Bilirubinuria).',
          'Chỉ định ngay Siêu âm ổ bụng để phân biệt tắc nghẽn cơ học đường mật (sỏi, u) với bệnh lý nhu mô gan.'
        ],
        furtherInvestigations: [
          'Nếu đường mật dãn: MRCP hoặc can thiệp ERCP.',
          'Nếu đường mật không dãn: Đánh giá tổn thương tế bào gan nặng (viêm gan virus, viêm gan do rượu, xơ gan mất bù, DILI).',
          'Nếu men gan hoàn toàn bình thường: Cân nhắc hội chứng di truyền hiếm gặp Dubin-Johnson hoặc Rotor.'
        ],
        keyDiagnosticPearls: [
          'Nồng độ Bilirubin toàn phần có thể vượt quá 30 mg/dL trong xơ gan mất bù có suy thận hoặc viêm gan rượu thể tối nặng.'
        ]
      }
    ]
  }
];

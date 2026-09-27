import React, { useState } from 'react';
import { 
  GitBranch, 
  Layers, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  FileCode, 
  Copy, 
  Check, 
  RotateCcw,
  ArrowRight,
  Stethoscope,
  Info,
  Flame,
  ShieldAlert,
  Compass
} from 'lucide-react';

export interface DecisionNode {
  id: string;
  label: string;
  category: 'root' | 'decision' | 'diagnosis' | 'emergency';
  level: number;
  condition?: string;
  description: string;
  evidence: string[];
  immediateOrders: string[];
  clinicalPearls: string[];
  warning?: string;
  parentId?: string;
  childrenIds?: string[];
}

export interface DecisionTreeDefinition {
  id: string;
  title: string;
  subtitle: string;
  sourceGuideline: string;
  rootId: string;
  nodes: Record<string, DecisionNode>;
  mermaidCode: string;
}

export const DECISION_TREES: DecisionTreeDefinition[] = [
  {
    id: 'tree-transaminases',
    title: 'Cây Quyết Định: Tăng Aminotransferase (ALT / AST)',
    subtitle: 'Lưu đồ phân tầng theo nồng độ ULN, tỷ số De Ritis và loại trừ cấp cứu suy gan cấp',
    sourceGuideline: 'ACG Clinical Guidelines 2017 & AASLD',
    rootId: 'trans-root',
    nodes: {
      'trans-root': {
        id: 'trans-root',
        label: 'Tăng ALT / AST Bất Thường',
        category: 'root',
        level: 0,
        description: 'Phát hiện ALT > 33 U/L (nam), > 25 U/L (nữ) theo chuẩn ACG 2017.',
        evidence: [
          'ALT có tính đặc hiệu cao cho gan (tế bào chất hepatocytes Zone 1-3).',
          'AST phân bố 80% trong ty thể và có cả ở cơ tim, cơ vân, thận, hồng cầu.',
          'Kiểm tra ngay dấu hiệu suy gan cấp: tri giác (bệnh não gan), dấu run vỗ cánh (asterixis), INR.'
        ],
        immediateOrders: [
          'Đo nồng độ ALT, AST kèm PT/INR và Albumin.',
          'Đánh giá tiền sử dùng thuốc trong 3 tháng gần nhất (đặc biệt Paracetamol, kháng sinh, TPCN, thảo dược).',
          'Định lượng lượng cồn tiêu thụ hàng tuần (g/tuần).'
        ],
        clinicalPearls: [
          'Không kết luận bình thường nếu ALT 30-40 U/L ở bệnh nhân có yếu tố nguy cơ chuyển hóa (MASLD) hoặc tiền sử tiếp xúc viêm gan virus.'
        ],
        childrenIds: ['trans-mild', 'trans-mod', 'trans-severe']
      },
      'trans-mild': {
        id: 'trans-mild',
        parentId: 'trans-root',
        label: 'Tăng Nhẹ / Ranh Giới (< 5x ULN)',
        category: 'decision',
        level: 1,
        condition: 'ALT hoặc AST < 5 lần ULN (thường ALT < 120 - 165 U/L)',
        description: 'Bệnh nhân ổn định, không có rối loạn đông máu hoặc suy gan cấp.',
        evidence: [
          'Nguyên nhân phổ biến nhất tại phòng khám ngoại trú: Gan thoái hóa mỡ chuyển hóa (MASLD).',
          'Viêm gan B mạn tính, Viêm gan C mạn tính.',
          'Bệnh gan do rượu (ALD), Tác dụng phụ của thuốc / TPCN.'
        ],
        immediateOrders: [
          'Bilan virus ban đầu: HBsAg, Anti-HCV (khẳng định bằng HCV RNA).',
          'Bilan chuyển hóa: Glucose đói, HbA1c, Lipid máu, BMI, Vòng bụng.',
          'Siêu âm ổ bụng tổng quát: kiểm tra cấu trúc echo gan, tĩnh mạch cửa, lách.',
          'Tính chỉ số FIB-4: Nếu < 1.30 có thể loại trừ xơ gan tiến triển với độ tin cậy >90%.'
        ],
        clinicalPearls: [
          'Nếu AST/ALT > 2:1 -> Gợi ý rất cao bệnh gan do rượu (ALD) do thiếu hụt Pyridoxal-5-phosphate.',
          'Nếu men gan vẫn tăng dai dẳng > 3 - 6 tháng không rõ nguyên nhân: làm Bilan Bậc 2 (ANA, ASMA, IgG, Sắt, Ferritin, Ceruloplasmin, Anti-tTG).'
        ],
        childrenIds: ['diag-masld', 'diag-alcohol', 'diag-viral-chronic']
      },
      'trans-mod': {
        id: 'trans-mod',
        parentId: 'trans-root',
        label: 'Tăng Vừa (5 - 15x ULN)',
        category: 'decision',
        level: 1,
        condition: 'ALT hoặc AST trong khoảng 5 - 15 lần ULN (165 - 500 U/L)',
        description: 'Tổn thương tế bào gan cấp tính hoặc đợt bùng phát cấp của bệnh gan mạn.',
        evidence: [
          'Đợt bùng phát viêm gan B/C mạn (HBV flare / HCV flare).',
          'Viêm gan tự miễn (Autoimmune Hepatitis - AIH).',
          'Tổn thương gan do thuốc (DILI) thể tế bào gan.',
          'Tắc mật thoáng qua do sỏi di chuyển (Acute Choledocholithiasis).'
        ],
        immediateOrders: [
          'Kiểm tra khẩn PT/INR để loại trừ khởi phát suy gan cấp.',
          'Huyết thanh virus cấp: IgM anti-HAV, HBsAg, IgM anti-HBc, anti-HCV kèm HCV RNA PCR.',
          'Tự miễn: ANA, ASMA (kháng thể cơ trơn), Định lượng IgG toàn phần.',
          'Siêu âm Doppler gan mật cấp cứu: kiểm tra sỏi mật và lưu thông mạch máu.'
        ],
        clinicalPearls: [
          'Sỏi mật di chuyển qua cơ vòng Oddi có thể làm ALT tăng vọt tạm thời lên 500-1000 U/L rồi giảm nhanh 50% trong 24-48 giờ tiếp theo.'
        ],
        childrenIds: ['diag-aih', 'diag-dili', 'diag-flare']
      },
      'trans-severe': {
        id: 'trans-severe',
        parentId: 'trans-root',
        label: 'Tăng Nặng (>15x ULN) & Khổng Lồ (>10,000 U/L)',
        category: 'emergency',
        level: 1,
        condition: 'ALT hoặc AST > 500 U/L, đặc biệt > 10,000 U/L',
        description: 'Hoại tử tế bào gan ồ ạt cấp tính! Nguy cơ tử vong cao nếu không can thiệp kịp thời.',
        evidence: [
          '3 nguyên nhân hàng đầu của ALT/AST > 10,000 U/L:',
          '1. Sốc gan do thiếu máu cục bộ (Ischemic hepatopathy / Shock Liver): tụt huyết áp, suy tim, sốc nhiễm trùng.',
          '2. Ngộ độc Acetaminophen (Paracetamol quá liều).',
          '3. Nấm độc Amanita phalloides hoặc virus tối cấp (HAV, HBV, HEV, HSV).'
        ],
        immediateOrders: [
          'ĐÁNH GIÁ NGUY CƠ SUY GAN CẤP (ALF): Kiểm tra ngay PT/INR và Tri giác. Nếu INR ≥ 1.5 + Bệnh não gan -> Kích hoạt ngay quy trình hội chẩn khẩn cấp trung tâm ghép gan!',
          'Định lượng nồng độ Paracetamol huyết thanh và dùng ngay N-Acetylcysteine (NAC) tĩnh mạch nếu có nghi ngờ.',
          'Hồi sức huyết động tích cực: nâng huyết áp động mạch trung bình (MAP > 65 mmHg) để khôi phục tưới máu gan.'
        ],
        clinicalPearls: [
          'Trong Sốc gan (Shock liver), AST thường tăng cao hơn ALT và LDH tăng vọt gấp hàng chục lần. Khi tưới máu được khôi phục, men gan giảm nhanh 50% mỗi 24 giờ.',
          'CẢNH BÁO: Men gan tụt giảm đột ngột nhưng Bilirubin và INR tiếp tục tăng vọt là dấu hiệu cạn kiệt tế bào gan (hoại tử toàn bộ) chứ không phải hồi phục!'
        ],
        warning: 'CẤP CỨU HỒI SỨC / GHÉP GAN: Kích hoạt quy trình ALF nếu INR ≥ 1.5 kèm rối loạn tri giác!',
        childrenIds: ['diag-shock-liver', 'diag-apap', 'diag-alf']
      },
      // Diagnoses
      'diag-masld': {
        id: 'diag-masld',
        parentId: 'trans-mild',
        label: 'Gan Thoái Hóa Mỡ Chuyển Hóa (MASLD)',
        category: 'diagnosis',
        level: 2,
        description: 'Chẩn đoán xác định khi có tăng men gan + bằng chứng mỡ hóa trên siêu âm + có yếu tố nguy cơ tim mạch/chuyển hóa (béo phì, đái tháo đường, rối loạn lipid).',
        evidence: ['De Ritis AST/ALT < 1', 'Không tiêu thụ rượu mức độc hại', 'FIB-4 đánh giá giai đoạn xơ hóa'],
        immediateOrders: ['Đo độ đàn hồi thoáng qua (FibroScan / VCTE)', 'Tối ưu hóa lối sống, giảm 7-10% trọng lượng cơ thể'],
        clinicalPearls: ['FIB-4 < 1.30: Theo dõi tại y tế cơ sở mỗi 1-2 năm. FIB-4 > 2.67: Chuyển khám chuyên khoa Gan Mật.']
      },
      'diag-alcohol': {
        id: 'diag-alcohol',
        parentId: 'trans-mild',
        label: 'Bệnh Gan Do Rượu (ALD)',
        category: 'diagnosis',
        level: 2,
        description: 'Uống rượu > 140g/tuần (nữ) hoặc > 210g/tuần (nam) kèm tỷ số De Ritis đặc trưng.',
        evidence: ['Tỷ số AST/ALT ≥ 2:1', 'AST thường < 300 - 400 U/L', 'GGT tăng cao đồng thời, MCV hồng cầu to'],
        immediateOrders: ['Ngưng rượu bia tuyệt đối', 'Bổ sung Thiamine (Vitamin B1) trước khi truyền glucose để phòng Wernicke'],
        clinicalPearls: ['AST tăng ưu thế do cồn gây tổn thương trực tiếp màng ty thể Zone 3 và làm suy giảm Pyridoxal-5-phosphate (coenzyme của ALT).']
      },
      'diag-viral-chronic': {
        id: 'diag-viral-chronic',
        parentId: 'trans-mild',
        label: 'Viêm Gan Virus Mạn Tính (HBV / HCV)',
        category: 'diagnosis',
        level: 2,
        description: 'Nhiễm virus dai dẳng > 6 tháng.',
        evidence: ['HBsAg (+) hoặc HCV RNA (+)', 'Men gan biến thiên từng đợt'],
        immediateOrders: ['Định lượng HBV DNA / HCV RNA', 'Xét nghiệm HBeAg, Anti-HBe, Tầm soát ung thư gan HCC bằng AFP + Siêu âm mỗi 6 tháng'],
        clinicalPearls: ['Viêm gan C hiện nay có thể chữa khỏi hoàn toàn >95% bằng thuốc DAA uống trong 8-12 tuần.']
      },
      'diag-aih': {
        id: 'diag-aih',
        parentId: 'trans-mod',
        label: 'Viêm Gan Tự Miễn (AIH)',
        category: 'diagnosis',
        level: 2,
        description: 'Tế bào lympho T tấn công tế bào gan, thường gặp ở nữ giới.',
        evidence: ['ANA (+) và/hoặc ASMA (+) hiệu giá cao', 'IgG toàn phần huyết thanh tăng > 1.2 - 1.5 lần bình thường'],
        immediateOrders: ['Sinh thiết gan chẩn đoán (viêm quanh khoảng cửa thâm nhiễm tương bào - Interface hepatitis)', 'Hội chẩn điều trị Corticosteroid (Prednisolone) + Azathioprine'],
        clinicalPearls: ['Đáp ứng nhanh chóng với ức chế miễn dịch là bằng chứng xác nhận chẩn đoán AIH quan trọng.']
      },
      'diag-dili': {
        id: 'diag-dili',
        parentId: 'trans-mod',
        label: 'Tổn Thương Gan Do Thuốc (DILI)',
        category: 'diagnosis',
        level: 2,
        description: 'Xuất hiện sau khi dùng thuốc 5 - 90 ngày, loại trừ các nguyên nhân khác.',
        evidence: ['R-ratio > 5 (thể hoại tử tế bào gan)', 'Điểm Roussel Uclaf (RUCAM) cao'],
        immediateOrders: ['Ngưng ngay lập tức toàn bộ các thuốc, TPCN, thảo dược nghi ngờ', 'Theo dõi men gan mỗi tuần đến khi hồi phục'],
        clinicalPearls: ['Amoxicillin-clavulanate là nguyên nhân DILI phổ biến nhất trên thế giới.']
      },
      'diag-flare': {
        id: 'diag-flare',
        parentId: 'trans-mod',
        label: 'Đợt Bùng Phát Viêm Gan B Mạn (HBV Flare)',
        category: 'diagnosis',
        level: 2,
        description: 'Virus tái hoạt động do suy giảm miễn dịch, hóa trị hoặc ngưng thuốc kháng virus đột ngột.',
        evidence: ['HBsAg (+), HBV DNA tăng vọt', 'IgM anti-HBc có thể dương tính hiệu giá thấp'],
        immediateOrders: ['Khởi trị ngay Entecavir hoặc Tenofovir (TDF/TAF)', 'Theo dõi sát INR để phòng suy gan cấp trên nền mạn (ACLF)'],
        clinicalPearls: ['Bắt buộc dự phòng thuốc kháng virus trước khi hóa trị hoặc điều trị ức chế miễn dịch ở người có HBsAg(+).']
      },
      'diag-shock-liver': {
        id: 'diag-shock-liver',
        parentId: 'trans-severe',
        label: 'Sốc Gan / Viêm Gan Thiếu Máu Cục Bộ (Ischemic Hepatopathy)',
        category: 'emergency',
        level: 2,
        description: 'Giảm tưới máu gan cấp tính do tụt huyết áp, sốc tim, sốc nhiễm trùng hoặc suy hô hấp nặng.',
        evidence: ['AST & ALT tăng vọt lên > 10,000 U/L', 'LDH tăng cực cao (tỷ số ALT/LDH < 1.5)', 'Tụt giảm men gan 50% mỗi 24-48 giờ sau khi huyết động ổn định'],
        immediateOrders: ['Hồi sức huyết động khẩn cấp, bù dịch, thuốc vận mạch nâng MAP > 65 mmHg', 'Siêu âm tim đánh giá chức năng thất trái'],
        clinicalPearls: ['Tế bào gan Zone 3 (quanh tĩnh mạch trung tâm) nhạy cảm nhất với thiếu oxy và hoại tử trước tiên.']
      },
      'diag-apap': {
        id: 'diag-apap',
        parentId: 'trans-severe',
        label: 'Ngộ Độc Paracetamol (Acetaminophen Overdose)',
        category: 'emergency',
        level: 2,
        description: 'Chất chuyển hóa NAPQI làm cạn kiệt Glutathione tế bào gan dẫn đến hoại tử ồ ạt.',
        evidence: ['Uống > 7.5 - 10g Paracetamol (hoặc liều thấp hơn ở người nghiện rượu, suy dinh dưỡng)', 'Nồng độ Paracetamol huyết thanh vượt đường cong Rumack-Matthew'],
        immediateOrders: ['Truyền ngay N-Acetylcysteine (NAC) tĩnh mạch càng sớm càng tốt', 'Kiểm tra khí máu động mạch, toan chuyển hóa, lactate máu'],
        clinicalPearls: ['Hiệu quả giải độc tối đa khi dùng NAC trong vòng 8 giờ đầu sau uống, nhưng vẫn có lợi ích rõ rệt kể cả khi dùng muộn.']
      },
      'diag-alf': {
        id: 'diag-alf',
        parentId: 'trans-severe',
        label: 'Suy Gan Cấp (Acute Liver Failure - ALF)',
        category: 'emergency',
        level: 2,
        description: 'Tổn thương gan cấp tính kèm rối loạn đông máu (INR ≥ 1.5) và rối loạn tri giác (bệnh não gan) ở người không có bệnh gan mạn trước đó.',
        evidence: ['INR ≥ 1.5', 'Bệnh não gan (từ lú lẫn, mất định hướng đến hôn mê)', 'Diễn tiến nhanh < 26 tuần'],
        immediateOrders: ['Liên hệ khẩn cấp Đơn vị Hồi Sức Tích Cực (ICU) & Trung Tâm Ghép Gan', 'Đặt nội khí quản bảo vệ đường thở nếu hôn mê (Grade III/IV)', 'Theo dõi áp lực nội sọ phòng phù não'],
        clinicalPearls: ['Ghép gan cấp cứu là phương pháp cứu sống duy nhất khi thất bại với hồi sức tích cực theo tiêu chuẩn King\'s College.']
      }
    },
    mermaidCode: `graph TD
  A[Tăng Aminotransferase ALT/AST] --> B{Mức độ bội số ULN}
  B -->|<5x ULN Nhẹ| C[Đánh giá De Ritis AST/ALT]
  B -->|5-15x ULN Vừa| D[Khảo sát Virus Cấp / Tự Miễn / DILI]
  B -->|>15x ULN Nặng/Khổng Lồ| E[CẤP CỨU: Sốc Gan, Ngộ Độc APAP, Suy Gan Cấp]

  C -->|AST/ALT < 1| C1[MASLD / Viêm gan virus B, C mạn]
  C -->|AST/ALT >= 2| C2[Bệnh gan do rượu ALD / Xơ gan]

  D --> D1[HBsAg, IgM anti-HBc, Anti-HCV, HCV RNA]
  D --> D2[Tự miễn: ANA, ASMA, IgG toàn phần]
  D --> D3[DILI: Rà soát tiền sử thuốc trong 3 tháng]

  E --> E1[Định lượng Paracetamol + Truyền NAC ngay]
  E --> E2[Kiểm tra INR & Bệnh não gan -> Báo động ALF!]
  E --> E3[Sốc gan: Hồi phục huyết động khẩn cấp MAP > 65mmHg]`
  },
  {
    id: 'tree-cholestasis',
    title: 'Cây Quyết Định: Tăng Men Ứ Mật (ALP & GGT)',
    subtitle: 'Xác nhận nguồn gốc gan mật, siêu âm phân định tắc ngoài gan và ứ mật trong gan',
    sourceGuideline: 'ACG Guideline 2017 & EASL',
    rootId: 'alp-root',
    nodes: {
      'alp-root': {
        id: 'alp-root',
        label: 'Tăng Phosphatase Kiềm (ALP)',
        category: 'root',
        level: 0,
        description: 'ALP tăng cao trong khi các men khác có thể bình thường hoặc tăng nhẹ.',
        evidence: [
          'ALP phân bố ở màng vi quản mật của tế bào gan, nhưng cũng có dồi dào ở mô xương, nhau thai, ruột non.',
          'Bước 1 bắt buộc: Khẳng định ALP có nguồn gốc từ gan mật hay ngoài gan.'
        ],
        immediateOrders: [
          'Xét nghiệm ngay GGT (Gamma-Glutamyl Transferase) hoặc 5\'-Nucleotidase.'
        ],
        clinicalPearls: [
          'GGT không có trong mô xương. GGT bình thường loại trừ chắc chắn nguồn gốc gan mật của ALP!'
        ],
        childrenIds: ['alp-nonhepatic', 'alp-hepatic']
      },
      'alp-nonhepatic': {
        id: 'alp-nonhepatic',
        parentId: 'alp-root',
        label: 'GGT Bình Thường: Nguồn Gốc Ngoài Gan',
        category: 'decision',
        level: 1,
        condition: 'ALP tăng nhưng GGT hoàn toàn bình thường',
        description: 'ALP xuất phát từ xương, thai kỳ hoặc sinh lý đang phát triển.',
        evidence: [
          'Bệnh lý xương: Bệnh Paget xương, Di căn xương (ung thư tiền liệt tuyến, vú), Nhuyễn xương do thiếu Vitamin D.',
          'Sinh lý: Phụ nữ mang thai 3 tháng cuối (ALP nhau thai), Trẻ em / thanh thiếu niên tuổi dậy thì (tạo xương).'
        ],
        immediateOrders: [
          'Định lượng Canxi, Phospho, 25-OH Vitamin D, PTH.',
          'X-quang hoặc Xạ hình xương nếu nghi ngờ u di căn.'
        ],
        clinicalPearls: [
          'Không cần làm siêu âm gan hay chụp CT bụng tốn kém khi GGT hoàn toàn bình thường.'
        ]
      },
      'alp-hepatic': {
        id: 'alp-hepatic',
        parentId: 'alp-root',
        label: 'GGT Tăng Đồng Thời: Khẳng Định Ứ Mật Gan',
        category: 'decision',
        level: 1,
        condition: 'Cả ALP và GGT cùng tăng cao',
        description: 'Xác định chắc chắn có ứ mật (Cholestasis). Chuyển sang Bước 2: Khảo sát hình ảnh học đường mật.',
        evidence: [
          'GGT gắn trên màng tế bào biểu mô đường mật và vi quản mật.',
          'Tổn thương đường mật kích thích tổng hợp và bài tiết ồ ạt ALP và GGT vào máu.'
        ],
        immediateOrders: [
          'Chỉ định ngay Siêu âm ổ bụng (USG Abdomen) khảo sát đường kính đường mật trong và ngoài gan.'
        ],
        clinicalPearls: [
          'Đường mật dãn: Ứ mật ngoài gan (Cơ học).',
          'Đường mật không dãn: Ứ mật trong gan (Nhu mô hoặc tự miễn).'
        ],
        childrenIds: ['bili-dilated-node', 'bili-nondilated-node']
      },
      'bili-dilated-node': {
        id: 'bili-dilated-node',
        parentId: 'alp-hepatic',
        label: 'Đường Mật Dãn: Tắc Mật Ngoài Gan',
        category: 'decision',
        level: 2,
        condition: 'Ống mật chủ > 6-7 mm (ở người còn túi mật) hoặc dãn đường mật trong gan',
        description: 'Tắc nghẽn cơ học dòng chảy dịch mật ngoài gan.',
        evidence: [
          'Sỏi ống mật chủ (Choledocholithiasis) - Phổ biến nhất.',
          'Khối u đầu tụy, u bóng Vater, ung thư đường mật (Cholangiocarcinoma / U Klatskin).',
          'Hẹp đường mật sau phẫu thuật cắt túi mật.'
        ],
        immediateOrders: [
          'Chụp cộng hưởng từ mật tụy (MRCP) hoặc CT ngực bụng cản quang.',
          'Nội soi mật tụy ngược dòng (ERCP) để lấy sỏi hoặc đặt stent giải áp.',
          'Khám tam chứng Charcot (Đau + Sốt + Vàng da) để phát hiện Viêm đường mật cấp.'
        ],
        clinicalPearls: [
          'Viêm đường mật cấp nhiễm trùng kèm sốc nhiễm trùng (Ngũ chứng Reynolds) là cấp cứu ngoại khoa tối khẩn!'
        ],
        childrenIds: ['diag-choledo', 'diag-tumor']
      },
      'bili-nondilated-node': {
        id: 'bili-nondilated-node',
        parentId: 'alp-hepatic',
        label: 'Đường Mật Không Dãn: Ứ Mật Trong Gan',
        category: 'decision',
        level: 2,
        condition: 'Nhu mô gan đồng nhất, không có bằng chứng dãn đường mật trên siêu âm',
        description: 'Tổn thương các đường mật nhỏ nội tại hoặc tổn thương vận chuyển muối mật ở màng tế bào.',
        evidence: [
          'Viêm đường mật tiên phát (Primary Biliary Cholangitis - PBC): Nữ giới trung niên, ngứa da.',
          'Viêm xơ đường mật tiên phát (Primary Sclerosing Cholangitis - PSC): Thường đi kèm Viêm loét đại tràng (IBD).',
          'DILI thể ứ mật (Amoxicillin-clavulanate, Anabolic steroid, Thuốc tránh thai).',
          'Ứ mật thai kỳ (Intrahepatic Cholestasis of Pregnancy - ICP).'
        ],
        immediateOrders: [
          'Xét nghiệm Kháng thể kháng ty thể (AMA) để chẩn đoán PBC.',
          'Chụp MRCP tìm hình ảnh hẹp dãn chuỗi hạt của PSC.',
          'Xét nghiệm Axit mật toàn phần huyết thanh (Total Bile Acids).'
        ],
        clinicalPearls: [
          'Bộ ba: Phụ nữ trung niên + Ngứa da dai dẳng + ALP tăng + AMA (+) -> Chẩn đoán xác định PBC mà không cần sinh thiết gan. Khởi trị ngay UDCA 13-15 mg/kg/ngày.'
        ],
        childrenIds: ['diag-pbc', 'diag-psc']
      },
      'diag-choledo': {
        id: 'diag-choledo',
        parentId: 'bili-dilated-node',
        label: 'Sỏi Ống Mật Chủ (Choledocholithiasis)',
        category: 'diagnosis',
        level: 3,
        description: 'Sỏi kẹt tại đoạn thấp OMC gây tắc nghẽn cơ học cấp/bán cấp.',
        evidence: ['Đau quặn gan hạ sườn phải, vàng da, sốt', 'Bilirubin trực tiếp tăng cao'],
        immediateOrders: ['Can thiệp ERCP lấy sỏi + Cắt cơ vòng Oddi', 'Kháng sinh phổ rộng nếu có sốt (Ceftriaxone + Metronidazole)'],
        clinicalPearls: ['Nội soi siêu âm (EUS) có độ nhạy >95% phát hiện sỏi bùn kích thước nhỏ < 3mm mà siêu âm thường bỏ sót.']
      },
      'diag-tumor': {
        id: 'diag-tumor',
        parentId: 'bili-dilated-node',
        label: 'Khối U Đầu Tụy / Ung Thư Đường Mật',
        category: 'diagnosis',
        level: 3,
        description: 'Tắc mật không đau (Painless Jaundice), sút cân, túi mật to không đau (Dấu Courvoisier).',
        evidence: ['Tuổi cao, Bilirubin tăng vọt liên tục', 'Chất chỉ điểm CA 19-9 tăng cao'],
        immediateOrders: ['CT bụng đa dãy có tiêm thuốc cản quang (Pancreas protocol)', 'Đặt stent đường mật dẫn lưu giải áp'],
        clinicalPearls: ['Vàng da tắc mật tiến triển không đau ở người trên 60 tuổi phải luôn nghĩ đến u đầu tụy cho đến khi có bằng chứng ngược lại.']
      },
      'diag-pbc': {
        id: 'diag-pbc',
        parentId: 'bili-nondilated-node',
        label: 'Viêm Đường Mật Tiên Phát (PBC)',
        category: 'diagnosis',
        level: 3,
        description: 'Bệnh tự miễn mạn tính phá hủy các ống mật nhỏ gian tiểu thùy.',
        evidence: ['ALP > 1.5x ULN', 'Kháng thể AMA (+) ở >95% bệnh nhân', 'Kháng thể ANA thể Sp100/gp210'],
        immediateOrders: ['Khởi trị ngay Ursodeoxycholic acid (UDCA)', 'Tầm soát loãng xương bằng đo mật độ xương DEXA'],
        clinicalPearls: ['UDCA làm chậm tiến triển xơ gan và cải thiện ngoạn mục thời gian sống thêm không cần ghép gan.']
      },
      'diag-psc': {
        id: 'diag-psc',
        parentId: 'bili-nondilated-node',
        label: 'Viêm Xơ Đường Mật Tiên Phát (PSC)',
        category: 'diagnosis',
        level: 3,
        description: 'Viêm xơ hóa tiến triển phá hủy toàn bộ hệ thống đường mật trong và ngoài gan.',
        evidence: ['70-80% bệnh nhân có kèm Viêm loét đại tràng (IBD)', 'Hình ảnh chuỗi hạt (Beading appearance) trên MRCP', 'Kháng thể AMA âm tính'],
        immediateOrders: ['Nội soi đại trực tràng toàn bộ tầm soát IBD', 'Tầm soát ung thư đường mật hàng năm bằng MRCP + CA 19-9'],
        clinicalPearls: ['Nguy cơ cao tiến triển thành ung thư đường mật (Cholangiocarcinoma) và ung thư đại tràng.']
      }
    },
    mermaidCode: `graph TD
  A[Tăng Phosphatase Kiềm ALP] --> B{Kiểm tra GGT hoặc 5'-NT}
  B -->|GGT Bình Thường| C[Nguồn Gốc Xương / Nhau Thai / Tuổi Dậy Thì]
  B -->|GGT Tăng Cao| D[Khẳng Định Ứ Mật Gan Mật]

  D --> E{Siêu Âm Ổ Bụng USG}
  E -->|Đường Mật Dãn| F[TẮC MẬT NGOÀI GAN: Sỏi OMC, U Đầu Tụy, U Đường Mật]
  E -->|Đường Mật Không Dãn| G[Ứ MẬT TRONG GAN: PBC, PSC, DILI, Thai Kỳ]

  F --> F1[Chỉ định MRCP hoặc can thiệp ERCP]
  G --> G1[Kháng thể AMA: Chẩn đoán PBC]
  G --> G2[MRCP: Tìm hình ảnh chuỗi hạt chẩn đoán PSC]`
  },
  {
    id: 'tree-bilirubin',
    title: 'Cây Quyết Định: Vàng Da & Tăng Bilirubin',
    subtitle: 'Phân đoạn Bilirubin Trực tiếp (liên hợp) vs Gián tiếp (tự do) và lưu đồ chẩn đoán',
    sourceGuideline: 'WHO Training Manual Session 4 & ACG',
    rootId: 'bili-root',
    nodes: {
      'bili-root': {
        id: 'bili-root',
        label: 'Vàng Da / Tăng Bilirubin (>1.2 mg/dL)',
        category: 'root',
        level: 0,
        description: 'Sắc tố mật lắng đọng ở kết mạc mắt (khi TBil > 2-3 mg/dL) và da (khi TBil > 4-5 mg/dL).',
        evidence: [
          'Bước tối quan trọng: Phân đoạn Bilirubin Trực Tiếp (Direct / Conjugated) và Bilirubin Toàn Phần (Total Bilirubin).',
          'Xác định tỷ lệ phần trăm liên hợp: % Liên hợp = (Direct / Total) * 100.'
        ],
        immediateOrders: [
          'Đo nồng độ Total Bilirubin và Direct Bilirubin.',
          'Xét nghiệm men gan toàn bộ: ALT, AST, ALP, GGT.',
          'Kiểm tra màu sắc nước tiểu và phân.'
        ],
        clinicalPearls: [
          'Bilirubin gián tiếp không tan trong nước -> Không thải qua nước tiểu -> Nước tiểu màu bình thường.',
          'Bilirubin trực tiếp tan trong nước -> Thải qua nước tiểu -> Nước tiểu vàng sẫm sủi bọt vàng (Bilirubinuria).'
        ],
        childrenIds: ['bili-unconj-branch', 'bili-conj-branch']
      },
      'bili-unconj-branch': {
        id: 'bili-unconj-branch',
        parentId: 'bili-root',
        label: 'Ưu Thế Bilirubin Gián Tiếp / Tự Do (<20% liên hợp)',
        category: 'decision',
        level: 1,
        condition: 'Bilirubin trực tiếp chiếm < 20% tổng lượng',
        description: 'Tăng sản xuất Bilirubin quá mức hoặc suy giảm quá trình thu nhận / liên hợp tại gan.',
        evidence: [
          'Tán huyết (Hemolysis): Hồng cầu bị vỡ ồ ạt vượt quá khả năng liên hợp của gan.',
          'Hội chứng Gilbert: Đột biến gen UGT1A1 làm giảm 70% hoạt tính men Glucuronosyltransferase.',
          'Hội chứng Crigler-Najjar (rất hiếm, thường phát hiện từ sơ sinh).'
        ],
        immediateOrders: [
          'Bilan tán huyết: Tổng phân tích tế bào máu, Hồng cầu lưới, Haptoglobin, LDH, Nghiệm pháp Coombs.',
          'Nếu men gan ALT, AST, ALP bình thường và KHÔNG có tán huyết -> Chẩn đoán Hội chứng Gilbert.'
        ],
        clinicalPearls: [
          'Hội chứng Gilbert là một biến thể di truyền hoàn toàn lành tính, tuổi thọ bình thường, không bao giờ tiến triển thành xơ gan hay suy gan!'
        ],
        childrenIds: ['diag-gilbert', 'diag-hemolysis']
      },
      'bili-conj-branch': {
        id: 'bili-conj-branch',
        parentId: 'bili-root',
        label: 'Ưu Thế Bilirubin Trực Tiếp / Liên Hợp (>50% liên hợp)',
        category: 'decision',
        level: 1,
        condition: 'Bilirubin trực tiếp chiếm > 50% tổng lượng',
        description: 'Bằng chứng chắc chắn của bệnh lý tế bào gan hoặc tắc nghẽn đường dẫn mật.',
        evidence: [
          'Bệnh lý tế bào gan: Viêm gan cấp, viêm gan do rượu, xơ gan mất bù.',
          'Bệnh lý tắc mật: Sỏi OMC, u đầu tụy, viêm đường mật.',
          'Rối loạn bài tiết mật bẩm sinh hiếm gặp: Dubin-Johnson, Rotor (men gan bình thường).'
        ],
        immediateOrders: [
          'Siêu âm ổ bụng ngay để loại trừ tắc nghẽn cơ học đường mật.',
          'So sánh R-ratio và men gan để phân định Tổn thương tế bào gan vs Tổn thương ứ mật.'
        ],
        clinicalPearls: [
          'Nếu Bilirubin > 30 mg/dL: Thường phối hợp giữa bệnh gan nặng + suy thận (giảm thải trừ qua nước tiểu) hoặc tán huyết đi kèm.'
        ],
        childrenIds: ['diag-hepatocellular-bili', 'diag-cholestatic-bili']
      },
      'diag-gilbert': {
        id: 'diag-gilbert',
        parentId: 'bili-unconj-branch',
        label: 'Hội Chứng Gilbert (Gilbert Syndrome)',
        category: 'diagnosis',
        level: 2,
        description: 'Bilirubin toàn phần thường tăng nhẹ (1.5 - 3.5 mg/dL), tăng rõ khi nhịn ăn, mất ngủ, nhiễm trùng, stress.',
        evidence: ['Men gan ALT, AST, ALP, GGT hoàn toàn bình thường', 'Không có tán huyết', 'Chỉ chiếm ưu thế gián tiếp'],
        immediateOrders: ['Trấn an bệnh nhân, không cần điều trị bằng thuốc', 'Tránh nhịn ăn kéo dài và kiệt sức'],
        clinicalPearls: ['Người mắc hội chứng Gilbert có nồng độ chất chống oxy hóa bilirubin cao, thậm chí có nguy cơ bệnh tim mạch xơ vữa thấp hơn người bình thường.']
      },
      'diag-hemolysis': {
        id: 'diag-hemolysis',
        parentId: 'bili-unconj-branch',
        label: 'Tán Huyết (Hemolytic Jaundice)',
        category: 'diagnosis',
        level: 2,
        description: 'Vỡ hồng cầu nội mạch hoặc ngoại mạch.',
        evidence: ['Thiếu máu, Haptoglobin giảm mạnh', 'LDH tăng cao', 'Hồng cầu lưới tăng > 2%'],
        immediateOrders: ['Hội chẩn chuyên khoa Huyết học', 'Kiểm tra thiếu men G6PD, Bệnh lý huyết sắc tố Thalassemia, Test Coombs'],
        clinicalPearls: ['Lách to thường đi kèm trong tán huyết mạn tính di truyền (như Hereditary Spherocytosis).']
      },
      'diag-hepatocellular-bili': {
        id: 'diag-conj-branch',
        parentId: 'bili-conj-branch',
        label: 'Tổn Thương Tế Bào Gan Nặng / Xơ Gan Mất Bù',
        category: 'diagnosis',
        level: 2,
        description: 'Khả năng bài tiết bilirubin của tế bào gan bị tê liệt.',
        evidence: ['ALT / AST tăng cao', 'Albumin giảm, INR kéo dài', 'Dấu sao mạch, lòng bàn tay son, cổ trướng'],
        immediateOrders: ['Bilan virus, rượu, tự miễn', 'Tính điểm MELD và Child-Pugh'],
        clinicalPearls: ['Vàng da ở bệnh nhân xơ gan mất bù là chỉ điểm tiên lượng nặng, cần theo dõi hội chứng gan thận.']
      },
      'diag-cholestatic-bili': {
        id: 'diag-cholestatic-bili',
        parentId: 'bili-conj-branch',
        label: 'Vàng Da Tắc Mật Cơ Học (Obstructive Jaundice)',
        category: 'diagnosis',
        level: 2,
        description: 'Mật bị chặn dòng chảy tràn ngược vào xoang mao mạch gan.',
        evidence: ['ALP và GGT tăng rất cao', 'Phân bạc màu (Acholic stool), nước tiểu sẫm màu', 'Ngứa da toàn thân do lắng đọng muối mật'],
        immediateOrders: ['Siêu âm khẩn tìm vị trí tắc', 'Chụp MRCP hoặc can thiệp ERCP'],
        clinicalPearls: ['Phân bạc màu như phân cò là dấu hiệu chỉ điểm tắc mật hoàn toàn (thường do u bóng Vater hoặc đầu tụy).']
      }
    },
    mermaidCode: `graph TD
  A[Vàng Da / Tăng Bilirubin] --> B{Phân đoạn Bilirubin}
  B -->|<20% Liên Hợp Gián Tiếp| C[Bilan Tán Huyết & Gilbert]
  B -->|>50% Liên Hợp Trực Tiếp| D[Bệnh Lý Gan Hoặc Tắc Đường Mật]

  C -->|Haptoglobin Giảm, LDH Tăng| C1[Tán Huyết: Huyết học, Coombs]
  C -->|Men Gan Bình Thường, Không Tán Huyết| C2[Hội Chứng Gilbert Lành Tính]

  D --> E{Siêu Âm Gan Mật}
  E -->|Đường Mật Dãn| D1[Tắc Mật Cơ Học: Sỏi OMC, U Tụy, U Đường Mật]
  E -->|Đường Mật Không Dãn| D2[Tổn Thương Nhu Mô Gan Nặng / Xơ Gan Mất Bù]`
  }
];

export interface DecisionTreeFlowProps {
  selectedTreeId?: string;
  onSelectTree?: (treeId: string) => void;
  hideHeader?: boolean;
  viewMode?: 'interactive' | 'mermaid';
  onViewModeChange?: (mode: 'interactive' | 'mermaid') => void;
}

export const DecisionTreeFlow: React.FC<DecisionTreeFlowProps> = ({
  selectedTreeId: propSelectedTreeId,
  onSelectTree: propOnSelectTree,
  hideHeader = false,
  viewMode: propViewMode,
  onViewModeChange: propOnViewModeChange
}) => {
  const [internalTreeId, setInternalTreeId] = useState<string>('tree-transaminases');
  const [internalViewMode, setInternalViewMode] = useState<'interactive' | 'mermaid'>('interactive');

  const selectedTreeId = propSelectedTreeId ?? internalTreeId;
  const viewMode = propViewMode ?? internalViewMode;

  const currentTree = DECISION_TREES.find(t => t.id === selectedTreeId) || DECISION_TREES[0];

  const [selectedNodeId, setSelectedNodeId] = useState<string>(currentTree.rootId);
  const [activePath, setActivePath] = useState<string[]>([currentTree.rootId]);
  const [copiedMermaid, setCopiedMermaid] = useState<boolean>(false);

  // Synchronize when selectedTreeId changes externally
  React.useEffect(() => {
    const tree = DECISION_TREES.find(t => t.id === selectedTreeId) || DECISION_TREES[0];
    setSelectedNodeId(tree.rootId);
    setActivePath([tree.rootId]);
  }, [selectedTreeId]);

  const setViewMode = (mode: 'interactive' | 'mermaid') => {
    if (propOnViewModeChange) {
      propOnViewModeChange(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  // When tree changes, reset to root
  const handleSelectTree = (treeId: string) => {
    if (propOnSelectTree) {
      propOnSelectTree(treeId);
    } else {
      setInternalTreeId(treeId);
    }
    const tree = DECISION_TREES.find(t => t.id === treeId) || DECISION_TREES[0];
    setSelectedNodeId(tree.rootId);
    setActivePath([tree.rootId]);
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    
    // Calculate path from root to this node
    const path: string[] = [];
    let curr: string | undefined = nodeId;
    while (curr) {
      path.unshift(curr);
      curr = currentTree.nodes[curr]?.parentId;
    }
    setActivePath(path);

    // On mobile screens, smoothly scroll to node detail card for immediate guidance
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        const detailEl = document.getElementById('node-detail-drawer');
        if (detailEl) {
          detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  const handleResetFlow = () => {
    setSelectedNodeId(currentTree.rootId);
    setActivePath([currentTree.rootId]);
  };

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(currentTree.mermaidCode);
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  const activeNode = currentTree.nodes[selectedNodeId] || currentTree.nodes[currentTree.rootId];

  // Group nodes by level for interactive graph display
  const level0Nodes = Object.values(currentTree.nodes).filter(n => n.level === 0);
  const level1Nodes = Object.values(currentTree.nodes).filter(n => n.level === 1);
  const level2Nodes = Object.values(currentTree.nodes).filter(n => n.level === 2);
  const level3Nodes = Object.values(currentTree.nodes).filter(n => n.level === 3);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
      
      {/* Header Banner - shown only if not hidden by parent */}
      {!hideHeader && (
        <>
          <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-teal-500/20 text-teal-300 rounded-lg border border-teal-500/30">
                  <Compass className="w-5 h-5" />
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Cây Quyết Định Lâm Sàng Tương Tác (Interactive Decision Tree)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-900 text-teal-300 border border-teal-700 uppercase">
                  ACG & WHO
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Nhấp chuột vào từng nút trên cây lưu đồ để phân nhánh quyết định, xem bằng chứng và chỉ định cận lâm sàng tiếp theo.
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center space-x-2 shrink-0">
              <div className="p-1 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center space-x-1 text-xs font-semibold">
                <button
                  onClick={() => setViewMode('interactive')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                    viewMode === 'interactive'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Sơ Đồ Luồng Tương Tác</span>
                </button>

                <button
                  onClick={() => setViewMode('mermaid')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                    viewMode === 'mermaid'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Mã Mermaid.js</span>
                </button>
              </div>

              <button
                onClick={handleResetFlow}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                title="Quay về gốc lưu đồ"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Algorithm Selector Bar */}
          <div className="px-5 flex items-center space-x-2 overflow-x-auto scrollbar-none">
            {DECISION_TREES.map((tree) => (
              <button
                key={tree.id}
                onClick={() => handleSelectTree(tree.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-2 ${
                  selectedTreeId === tree.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>{tree.title.replace('Cây Quyết Định: ', '')}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Dynamic Active Path Breadcrumb with Quick Reset */}
      <div className="mx-4 sm:mx-5 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="font-bold text-slate-500 shrink-0 text-[11px] uppercase tracking-wider">
            Lộ trình đã chọn:
          </span>
          {activePath.map((nodeId, idx) => {
            const n = currentTree.nodes[nodeId];
            if (!n) return null;
            const isCurrent = nodeId === selectedNodeId;
            return (
              <React.Fragment key={nodeId}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                <button
                  onClick={() => handleSelectNode(nodeId)}
                  className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    isCurrent 
                      ? 'bg-teal-600 text-white shadow-xs font-bold' 
                      : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {n.label}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <button
          onClick={handleResetFlow}
          className="shrink-0 flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          title="Quay về gốc lưu đồ"
        >
          <RotateCcw className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Về nút gốc</span>
        </button>
      </div>

      {/* MAIN VIEW: INTERACTIVE GRAPH OR MERMAID CODE */}
      {viewMode === 'interactive' ? (
        <div className="px-5 pb-6 space-y-6">
          
          {/* Interactive Flow Visual Canvas */}
          <div className="space-y-2">
            <div className="md:hidden flex items-center justify-between text-[11px] text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              <span>👉 Cuộn ngang để xem toàn bộ cây quyết định</span>
              <span className="text-teal-700 font-bold">Chạm để chọn nhánh</span>
            </div>

            <div className="p-4 sm:p-6 bg-slate-900/95 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto text-white">
              <div className="min-w-[700px] space-y-6">
              
              {/* Level 0: Root */}
              <div className="flex justify-center">
                {level0Nodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isActive = activePath.includes(node.id);
                  return (
                    <div
                      key={node.id}
                      onClick={() => handleSelectNode(node.id)}
                      className={`cursor-pointer max-w-sm w-full p-4 rounded-2xl border-2 transition-all text-center space-y-1.5 ${
                        isSelected
                          ? 'bg-teal-600 border-teal-300 shadow-lg shadow-teal-500/30 scale-102 ring-4 ring-teal-400/20'
                          : isActive
                          ? 'bg-slate-800 border-teal-500 text-white'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-1.5">
                        <Stethoscope className="w-4 h-4 text-teal-300" />
                        <span className="font-extrabold text-sm">{node.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {node.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Connecting arrow */}
              <div className="flex justify-center text-teal-400">
                <div className="w-0.5 h-6 bg-teal-500/60"></div>
              </div>

              {/* Level 1: Major Branches */}
              <div className="grid grid-cols-3 gap-4">
                {level1Nodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isActive = activePath.includes(node.id);
                  const isEmergency = node.category === 'emergency';
                  return (
                    <div
                      key={node.id}
                      onClick={() => handleSelectNode(node.id)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all space-y-2 relative flex flex-col justify-between ${
                        isSelected
                          ? isEmergency
                            ? 'bg-rose-950 border-rose-400 shadow-lg shadow-rose-500/30 ring-4 ring-rose-400/20'
                            : 'bg-teal-950 border-teal-400 shadow-lg shadow-teal-500/30 ring-4 ring-teal-400/20'
                          : isActive
                          ? 'bg-slate-800 border-teal-400'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isEmergency ? 'bg-rose-900 text-rose-200' : 'bg-teal-900 text-teal-200'
                          }`}>
                            {isEmergency ? 'Báo động cấp cứu' : 'Phân nhánh'}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                          )}
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-white">
                          {node.label}
                        </h4>
                        {node.condition && (
                          <p className="text-[11px] text-teal-300 font-mono mt-1">
                            {node.condition}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                          {node.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{node.childrenIds?.length || 0} hướng chẩn đoán</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Level 2: Specific Differential Diagnoses / Outcomes */}
              {level2Nodes.length > 0 && (
                <>
                  <div className="flex justify-center text-teal-400">
                    <div className="w-0.5 h-6 bg-teal-500/60"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                        Chẩn Đoán Xác Định & Chỉ Định Cận Lâm Sàng
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {level2Nodes.map((node) => {
                        const isSelected = selectedNodeId === node.id;
                        const isParentActive = node.parentId && activePath.includes(node.parentId);
                        const isEmergency = node.category === 'emergency';
                        return (
                          <div
                            key={node.id}
                            onClick={() => handleSelectNode(node.id)}
                            className={`cursor-pointer p-3 rounded-xl border transition-all text-xs space-y-1.5 ${
                              isSelected
                                ? isEmergency
                                  ? 'bg-rose-950 border-rose-400 shadow-md ring-2 ring-rose-400/20'
                                  : 'bg-teal-950 border-teal-400 shadow-md ring-2 ring-teal-400/20'
                                : isParentActive
                                ? 'bg-slate-800 border-teal-500/50 text-white'
                                : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`w-2 h-2 rounded-full ${
                                isEmergency ? 'bg-rose-400' : 'bg-teal-400'
                              }`}></span>
                              {isSelected && (
                                <span className="text-[9px] font-bold text-teal-300">Đang chọn</span>
                              )}
                            </div>
                            <h5 className="font-bold text-xs line-clamp-1 text-white">
                              {node.label}
                            </h5>
                            <p className="text-[10px] text-slate-300 line-clamp-2">
                              {node.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

        {/* Deep-Dive Active Node Information Card */}
          {activeNode && (
            <div id="node-detail-drawer" className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-5">
              
              {/* Node Title & Condition */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      activeNode.category === 'emergency'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : activeNode.category === 'root'
                        ? 'bg-teal-100 text-teal-800 border border-teal-200'
                        : 'bg-slate-200 text-slate-800'
                    }`}>
                      {activeNode.category === 'emergency' ? 'Cấp Cứu Tối Khẩn' : activeNode.category === 'root' ? 'Bước Khởi Đầu' : 'Phân Nhánh Quyết Định'}
                    </span>
                    <h4 className="text-base font-black text-slate-900">
                      {activeNode.label}
                    </h4>
                  </div>
                  {activeNode.condition && (
                    <p className="text-xs text-teal-800 font-semibold mt-1">
                      <strong>Tiêu chuẩn phân tầng: </strong>{activeNode.condition}
                    </p>
                  )}
                </div>

                <div className="text-xs text-slate-500">
                  <span>Tham chiếu: {currentTree.sourceGuideline}</span>
                </div>
              </div>

              {/* Red Flag Warning if present */}
              {activeNode.warning && (
                <div className="p-3.5 bg-rose-50 border-2 border-rose-500 rounded-xl flex items-start space-x-3 text-rose-900 text-xs">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold uppercase block">CẢNH BÁO LÂM SÀNG BÁO ĐỘNG:</span>
                    <p className="mt-0.5 font-medium">{activeNode.warning}</p>
                  </div>
                </div>
              )}

              {/* 3-Column Clinical Blueprint */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Evidence & Mechanism */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5 border-b border-slate-100 pb-2">
                    <Info className="w-4 h-4 text-teal-600" />
                    <span>Cơ Chế & Bằng Chứng Gợi Ý</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {activeNode.evidence.map((ev, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Immediate Diagnostic Orders */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5 border-b border-slate-100 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Chỉ Định & Hành Động Tiếp Theo</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {activeNode.immediateOrders.map((order, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[9px] mt-0.5">
                          {i + 1}
                        </span>
                        <span className="font-medium text-slate-800">{order}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Clinical Pearls */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5 border-b border-slate-100 pb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Ngọc Điểm Lâm Sàng & Bẫy Chẩn Đoán</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {activeNode.clinicalPearls.map((pearl, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-amber-500 font-bold">★</span>
                        <span className="italic">{pearl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}

        </div>
      ) : (
        /* MERMAID CODE VIEW */
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-black text-sm text-slate-900">
                Mã Nguồn Sơ Đồ Cây Quyết Định (Mermaid.js Syntax)
              </h4>
              <p className="text-xs text-slate-500">
                Bạn có thể sao chép đoạn mã này để dán vào bài thuyết trình lâm sàng, tài liệu đào tạo hoặc phần mềm hỗ trợ Mermaid.
              </p>
            </div>

            <button
              onClick={handleCopyMermaid}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              {copiedMermaid ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao Chép Mã Mermaid</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-slate-900 text-teal-200 rounded-2xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
            {currentTree.mermaidCode}
          </pre>
        </div>
      )}

    </div>
  );
};

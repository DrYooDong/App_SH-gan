import { 
  PatientLabs, 
  CDSSAnalysis, 
  InjuryPattern, 
  ElevationSeverity, 
  DeRitisStratification,
  DILIAnalysis,
  HysLawAssessment,
  DILIMechanism,
  DILIPhenotype
} from '../types/cdss';
import { ALL_DILI_AGENTS, DILI_PHENOTYPES } from '../data/diliDatabase';

/**
 * Calculates De Ritis stratification and clinical decision limits
 * Based on Ken Sikaris & Mona Botros (2013): "The De Ritis Ratio: The Test of Time" - Table 2
 */
export function evaluateDeRitisMatrix(
  ast: number, 
  alt: number, 
  labs: PatientLabs, 
  maxMultiple: number
): DeRitisStratification {
  const ratio = alt > 0 ? Number((ast / alt).toFixed(2)) : 0;
  const isAlcoholUser = (labs.alcoholIntake && labs.alcoholIntake > (labs.gender === 'male' ? 210 : 140)) || labs.suspectedAlcoholWithin24h;
  const isMuscleInjury = (labs.ck && labs.ck > 400) || labs.strenuousExercise;
  const isNeonate = labs.age !== undefined && labs.age <= 0.08; // <= 1 month
  const isChild = labs.age !== undefined && labs.age > 0.08 && labs.age <= 14;

  let category: DeRitisStratification['category'] = 'Healthy';
  let decisionLimitText = '';
  let clinicalMeaning = '';
  let riskSeverity: DeRitisStratification['riskSeverity'] = 'low';
  let pathophysiologicalMechanism = '';
  let vitaminB6Note: string | undefined = undefined;
  let prognosticAlert: string | undefined = undefined;

  // Evaluation logic according to Table 2
  if (isNeonate) {
    category = 'Pediatric/Neonate';
    if (ratio >= 2.0) {
      decisionLimitText = '≥ 2.0 (Sơ sinh bình thường lúc sinh > 3.0, giảm < 2.0 sau ngày thứ 5)';
      clinicalMeaning = 'Sinh lý sơ sinh bình thường hoặc cảnh báo ngạt sơ sinh (Neonatal asphyxia) nếu kéo dài';
      riskSeverity = ratio > 3.0 ? 'moderate' : 'low';
      pathophysiologicalMechanism = 'Tỷ lệ hoạt tính men gan ở trẻ sơ sinh cao gấp đôi người lớn do chuyển hóa sơ sinh và áp lực chuyển dạ sinh lý.';
    } else {
      decisionLimitText = '< 2.0';
      clinicalMeaning = 'Bình thường sau ngày thứ 5 sau sinh.';
      riskSeverity = 'low';
      pathophysiologicalMechanism = 'Đạt trạng thái cân bằng chuyển hóa sau sinh.';
    }
  } else if (isChild) {
    category = 'Pediatric/Neonate';
    if (ratio >= 1.5) {
      decisionLimitText = '1.5 đến < 2.0 (Trẻ em)';
      clinicalMeaning = 'Nhóm trẻ có nguy cơ bệnh gan tiến triển nếu không hạ dưới 1.5 trong theo dõi';
      riskSeverity = 'moderate';
      pathophysiologicalMechanism = 'Trẻ em bình thường có tỷ số AST/ALT cao hơn người lớn nhẹ do tăng trưởng mô.';
    } else {
      decisionLimitText = '< 1.5 (Trẻ em tiên lượng tốt)';
      clinicalMeaning = 'Tiên lượng phục hồi gan thuận lợi.';
      riskSeverity = 'low';
      pathophysiologicalMechanism = 'Tỷ số AST/ALT giảm dưới 1.5 phản ánh tiến triển tốt ở trẻ có bệnh lý gan mật.';
    }
  } else if (isMuscleInjury) {
    category = 'Muscle Disease';
    if (ratio >= 2.0) {
      decisionLimitText = '≥ 2.0 (Tổn thương cơ vân cấp tính / Tiêu cơ vân)';
      clinicalMeaning = 'Tổn thương cơ xương cấp (Acute skeletal muscle injury / Rhabdomyolysis)';
      riskSeverity = 'high';
      pathophysiologicalMechanism = 'Mô cơ vân chứa lượng AST áp đảo so với ALT (tỷ lệ mô 17:1). Phóng thích ồ ạt AST và Creatine Kinase (CK) vào máu.';
      prognosticAlert = 'Kiểm tra ngay CK huyết thanh và chức năng thận (nguy cơ suy thận cấp do Myoglobin).';
    } else if (ratio >= 1.0) {
      decisionLimitText = '1.0 đến < 1.5 (Giai đoạn đang hồi phục chấn thương cơ)';
      clinicalMeaning = 'Tổn thương cơ đang thoái lui (Resolving muscle injury)';
      riskSeverity = 'moderate';
      pathophysiologicalMechanism = 'AST có thời gian bán hủy ngắn (t½ = 18h) bị đào thải nhanh gấp đôi ALT (t½ = 36h), làm tỷ số giảm dần về 1:1 sau vài ngày.';
    } else {
      decisionLimitText = '< 1.0 (Tổn thương cơ mạn tính / Viêm đa cơ)';
      clinicalMeaning = 'Bệnh cơ mạn tính (Polymyositis / Chronic muscle injury)';
      riskSeverity = 'low';
      pathophysiologicalMechanism = 'Trong bệnh cơ mạn, ALT tồn lưu lâu hơn do thanh thải chậm, có thể gây nhầm lẫn với viêm gan nếu không đo CK.';
    }
  } else if (isAlcoholUser) {
    category = 'Alcoholic';
    if (ratio >= 2.0) {
      decisionLimitText = '≥ 2.0 (Dấu ấn kinh điển Viêm gan do rượu cấp tính)';
      clinicalMeaning = 'Viêm gan do rượu cấp / Nghiện rượu nặng tiến triển (Acute Alcoholic Hepatitis)';
      riskSeverity = 'high';
      pathophysiologicalMechanism = 'Cồn gây tổn thương đặc hiệu màng ty thể giải phóng mAST (chiếm 80% AST gan). Đồng thời rượu làm giảm thanh thải AST qua xoang gan.';
      vitaminB6Note = 'Tác động Vitamin B6: Người nghiện rượu thường suy dinh dưỡng thiếu hụt Pyridoxal-5-phosphate (B6), làm giảm hoạt tính tổng hợp ALT mạnh hơn AST, khuếch đại tỷ số AST/ALT lên cao.';
      prognosticAlert = 'Tỷ số AST/ALT > 2:1 ở người uống rượu có độ nhạy và đặc hiệu rất cao cho bệnh gan do rượu. Đánh giá chỉ số Maddrey DF nếu có vàng da.';
    } else if (ratio >= 1.5) {
      decisionLimitText = '1.5 đến < 2.0 (Lạm dụng rượu gần đây)';
      clinicalMeaning = 'Lạm dụng rượu gần đây (Recent alcohol abuse)';
      riskSeverity = 'moderate';
      pathophysiologicalMechanism = 'Phản ánh tổn thương tế bào gan do rượu trong vòng 24 - 48h qua trước khi AST bị thực bào.';
      vitaminB6Note = 'Có thể có thiếu hụt dinh dưỡng và giảm B6 đồng hành.';
    } else {
      decisionLimitText = '< 1.0 (Viêm gan do rượu đang thoái lui hoặc có bệnh gan mỡ chuyển hóa đi kèm)';
      clinicalMeaning = 'Đang hồi phục sau ngừng rượu hoặc thể tổn thương phối hợp';
      riskSeverity = 'low';
      pathophysiologicalMechanism = 'Sau khi ngừng uống vài ngày, AST đào thải nhanh (t½ 18h) khiến tỷ số tụt dưới 1.0.';
    }
  } else if (maxMultiple >= 5) {
    // Acute Viral or Severe transaminitis
    category = 'Acute Viral';
    if (ratio >= 2.0) {
      decisionLimitText = '≥ 2.0 (Viêm gan cấp thể bùng phát / Tối cấp - Fulminant Hepatitis)';
      clinicalMeaning = 'CẢNH BÁO NGUY CƠ VIÊM GAN TỐI CẤP (Fulminant Hepatitis) - Tiên lượng tử vong rất cao!';
      riskSeverity = 'critical';
      pathophysiologicalMechanism = 'Hoại tử hàng loạt tế bào gan giải phóng ồ ạt cả ty thể mAST. Nghiên cứu Sikaris 2013: 95% khoảng tin cậy tỷ số De Ritis ở bệnh nhân tử vong là 1.2 - 2.3 (so với 0.3 - 0.6 ở nhóm sống sót).';
      prognosticAlert = 'Hội chẩn khẩn cấp chuyên khoa gan mật / đơn vị ghép gan. Theo dõi sát PT/INR và bệnh não gan.';
    } else if (ratio >= 1.0) {
      decisionLimitText = '1.0 đến < 2.0 (Viêm gan cấp đang diễn tiến nặng / Worsening)';
      clinicalMeaning = 'Viêm gan virus cấp đang nặng lên (Worsening Acute Hepatitis)';
      riskSeverity = 'high';
      pathophysiologicalMechanism = 'Tỷ số không hạ xuống dưới 1.0 chứng tỏ tế bào gan tiếp tục bị phá hủy liên tục không hồi phục.';
      if (alt >= 200 && alt <= 500 && ratio > 1.5) {
        prognosticAlert = 'Nghiên cứu Botros & Sikaris (2013) ghi nhận: Khi ALT từ 200-500 U/L mà AST/ALT > 1.5, nguy cơ men gan bùng nổ vượt 1000 U/L trong 1-2 ngày tới tăng gấp 40 lần!';
      }
    } else {
      decisionLimitText = '< 1.0 (Khoảng điển hình 0.5 - 0.7: Viêm gan cấp đang thoái lui)';
      clinicalMeaning = 'Viêm gan virus cấp điển hình đang thoái lui / Hồi phục (Resolving acute viral hepatitis)';
      riskSeverity = 'low';
      pathophysiologicalMechanism = 'ALT bào tương tồn lưu lâu hơn trong tuần hoàn (t½ 47h vs 17h của AST), tạo nên hình ảnh ALT > AST kinh điển của De Ritis 1957.';
    }
  } else {
    // Chronic liver disease or baseline evaluation
    category = 'Chronic Liver';
    const normalCutoff = labs.gender === 'male' ? 1.3 : 1.7;
    if (ratio >= 2.0) {
      decisionLimitText = '≥ 2.0 (Bất thường nặng: Cần tìm nguyên nhân rượu, thuốc gây độc ty thể, hoặc xơ gan mất bù)';
      clinicalMeaning = 'Nghi ngờ bệnh gan do rượu, xơ gan tiến triển hoặc chấn thương cơ vân kết hợp';
      riskSeverity = 'high';
      pathophysiologicalMechanism = 'Xơ hóa phá hủy cấu trúc xoang gan làm suy giảm nghiêm trọng thụ thể bắt giữ và thanh thải AST.';
    } else if (ratio >= 1.09) {
      decisionLimitText = '≥ 1.09 - 1.16 (Dự báo nguy cơ Xơ gan tiến triển F4 & Giảm sống còn)';
      clinicalMeaning = 'Nguy cơ xơ hóa gan tiến triển F3-F4 / Xơ gan (Fibrosis/Cirrhosis risk)';
      riskSeverity = 'moderate';
      pathophysiologicalMechanism = 'Trong viêm gan C mạn và MASLD, AST tương quan chặt chẽ với xơ hóa hơn ALT (p < 0.002). Tỷ số > 1.09 dự báo tiến triển xơ gan; > 1.16 tương quan với Child-Pugh, MELD và tăng tử vong.';
      prognosticAlert = 'Khuyến cáo đánh giá xơ hóa không xâm lấn bằng FIB-4, APRI và đo độ đàn hồi thoáng qua (FibroScan / VCTE).';
    } else if (ratio >= 1.0) {
      decisionLimitText = '1.0 đến < 1.09 (Nguy cơ xơ hóa giai đoạn sớm F2)';
      clinicalMeaning = 'Theo dõi nguy cơ xơ hóa gan trong bệnh gan mạn tính';
      riskSeverity = 'moderate';
      pathophysiologicalMechanism = 'Bắt đầu có sự thay đổi tỷ lệ thải trừ AST ở màng xoang gan.';
    } else {
      decisionLimitText = `< 1.0 (Giới hạn bình thường: Nam ≤ 1.3, Nữ ≤ 1.7)`;
      clinicalMeaning = 'Bệnh gan mạn tính ổn định (Stable) hoặc Viêm gan nhiễm mỡ MASLD giai đoạn sớm (NASH thường De Ritis < 1.0)';
      riskSeverity = 'low';
      pathophysiologicalMechanism = 'Trong MASLD/NASH chưa có xơ hóa nặng, ALT luôn ưu thế hơn AST; tỷ số < 1.0 đặc biệt rõ rệt ở người thừa cân, béo phì hoặc đái tháo đường.';
    }
  }

  return {
    ratio,
    category,
    decisionLimitText,
    clinicalMeaning,
    riskSeverity,
    pathophysiologicalMechanism,
    vitaminB6Note,
    prognosticAlert
  };
}

/**
 * NEJM 2019 DILI & Phenotyping Evaluation Engine
 * Based on Hoofnagle JH, Björnsson ES. N Engl J Med 2019; 381:264-73
 */
export function evaluateDILI(
  labs: PatientLabs,
  rRatio: number,
  pattern: InjuryPattern,
  deRitis: number
): DILIAnalysis {
  const suspectedName = labs.suspectedDrug?.trim() || '';
  const latency = labs.drugLatencyDays;
  const isHighTransaminases = labs.alt >= 3 * labs.altUln || labs.ast >= 3 * labs.astUln;
  const isJaundice = labs.totalBilirubin >= 2.4; // >= 2x ULN (assuming ULN ~ 1.2 mg/dL)
  const isAlpNotDisproportionate = rRatio > 5 || (rRatio >= 2 && labs.ultrasoundBiliaryDilatation !== 'dilated');

  // 1. Hy's Law Assessment (Zimmerman / Temple / NEJM 2019)
  const hysLawAltMet = isHighTransaminases;
  const hysLawBiliMet = isJaundice;
  const hysLawAlpExcluded = isAlpNotDisproportionate;
  const isHysLawPositive = hysLawAltMet && hysLawBiliMet && hysLawAlpExcluded;
  const isHysLawBorderline = hysLawAltMet && labs.totalBilirubin >= 1.5 && labs.totalBilirubin < 2.4;

  const hysLaw: HysLawAssessment = {
    isPositive: isHysLawPositive,
    isBorderline: isHysLawBorderline,
    altMet: hysLawAltMet,
    biliMet: hysLawBiliMet,
    alpExcluded: hysLawAlpExcluded,
    message: isHysLawPositive
      ? 'CẢNH BÁO ĐỎ - ĐỊNH LUẬT HY (HY\'S LAW DƯƠNG TÍNH): Bệnh nhân có tổn thương tế bào gan do thuốc kèm vàng da thực sự (ALT ≥ 3x ULN, Total Bilirubin ≥ 2x ULN không có tắc mật). Tỷ lệ tử vong hoặc suy gan cấp cần ghép gan ≥ 10%!'
      : isHysLawBorderline
      ? 'CẢNH BÁO GIÁM SÁT: Men gan tăng ≥ 3x ULN kèm Bilirubin cận ngưỡng (1.5 - 2.4 mg/dL). Nguy cơ tiến triển thành tiêu chuẩn Hy\'s Law nếu tiếp tục dùng thuốc.'
      : 'Chưa thỏa tiêu chuẩn Hy\'s Law.',
    mortalityRisk: isHysLawPositive ? '≥ 10% (Nguy cơ tử vong hoặc ghép gan)' : isHysLawBorderline ? 'Đang gia tăng' : 'Thấp'
  };

  // 2. Identify Implicated Agent Entry if matched in DB
  const matchedAgent = ALL_DILI_AGENTS.find(a => 
    a.name.toLowerCase().includes(suspectedName.toLowerCase()) ||
    a.nameVi.toLowerCase().includes(suspectedName.toLowerCase())
  );

  // 3. Determine Mechanism (Direct, Idiosyncratic, Indirect)
  let mechanism: DILIMechanism = 'Idiosyncratic'; // Default for most prescription DILI
  let agentCategory = matchedAgent?.category || 'Other';

  if (
    labs.isUsingCheckpointInhibitor || 
    labs.isUsingImmunosuppressant || 
    (matchedAgent && matchedAgent.mechanism === 'Indirect')
  ) {
    mechanism = 'Indirect';
  } else if (
    matchedAgent?.mechanism === 'Direct' || 
    labs.hasLacticAcidosis || 
    labs.hasSinusoidalObstructionSigns ||
    suspectedName.toLowerCase().includes('paracetamol') ||
    suspectedName.toLowerCase().includes('acetaminophen') ||
    suspectedName.toLowerCase().includes('amiodarone') ||
    suspectedName.toLowerCase().includes('amanita')
  ) {
    mechanism = 'Direct';
  }

  // 4. Determine Specific Phenotype from 10 NEJM Phenotypes
  let phenotype: DILIPhenotype = 'Acute hepatocellular hepatitis';
  let phenotypeVi = 'Viêm gan tế bào gan cấp đặc ứng';
  const clinicalClues: string[] = [];
  const recommendedActions: string[] = [];

  if (labs.isUsingAnabolicSteroids || (labs.totalBilirubin > 5 && labs.alt < 3 * labs.altUln && labs.alp < 2 * labs.alpUln && labs.hasPruritus)) {
    phenotype = 'Bland cholestasis';
    phenotypeVi = 'Ứ mật đơn thuần không kèm hoại tử viêm (Bland Cholestasis)';
    clinicalClues.push('Bilirubin tăng rất cao và ngứa dữ dội kéo dài trong khi men gan ALT và ALP chỉ tăng nhẹ-vừa.');
    clinicalClues.push('Điển hình do lạm dụng Steroid đồng hóa (Anabolic Steroids) ở người tập thể hình hoặc Estrogen liều cao.');
    recommendedActions.push('Dừng ngay lập tức toàn bộ steroid đồng hóa, thuốc tăng cơ, hoặc thuốc tránh thai/estrogen.');
    recommendedActions.push('Trấn an bệnh nhân: Tình trạng vàng da và ngứa sẽ thoái lui tự nhiên nhưng chậm chạp (2 - 4 tháng). Dùng thuốc giảm ngứa (Cholestyramine/UDCA).');
  } else if (labs.hasLacticAcidosis) {
    phenotype = 'Acute fatty liver with lactic acidosis';
    phenotypeVi = 'Thoái hóa mỡ vi thể kèm toan lactic máu & suy gan';
    mechanism = 'Direct';
    clinicalClues.push('Độc tính ty thể ức chế chuỗi hô hấp tế bào và thoái hóa mỡ vi thể (Stavudine, Didanosine, Linezolid, Aspirin / Reye).');
    recommendedActions.push('CẤP CỨU: Ngừng ngay thuốc nghi ngờ, truyền Glucose ưu trương kiềm hóa máu điều chỉnh toan chuyển hóa.');
  } else if (labs.hasSinusoidalObstructionSigns) {
    phenotype = 'Sinusoidal obstruction syndrome (SOS/VOD)';
    phenotypeVi = 'Hội chứng tắc xoang gan (Veno-occlusive disease - SOS/VOD)';
    mechanism = 'Direct';
    clinicalClues.push('Tam chứng: Đau hạ sườn phải, gan to ứ máu, tăng cân nhanh do ứ dịch báng bụng sau dùng Busulfan/Cyclophosphamide/ghép tủy hoặc thảo dược chứa pyrrolizidine alkaloids.');
    recommendedActions.push('Hạn chế muối dịch, dùng lợi tiểu cẩn trọng. Cân nhắc dùng Defibrotide ở thể nặng có suy đa tạng.');
  } else if (labs.hasImmunoallergicFeatures) {
    phenotype = 'Immunoallergic hepatitis';
    phenotypeVi = 'Viêm gan quá mẫn dị ứng miễn dịch (Hội chứng DRESS / SJS)';
    clinicalClues.push('Có tam chứng dị ứng: Sốt cao, phát ban da toàn thân, tăng bạch cầu ái toan (Eosinophilia). Hay gặp do Allopurinol, Phenytoin, Carbamazepine, TMP-SMZ.');
    recommendedActions.push('Ngừng ngay lập tức toàn bộ thuốc nghi ngờ. Chỉ định Corticosteroid toàn thân liều cao cho hội chứng DRESS.');
  } else if (labs.alt > 15 * labs.altUln || labs.alt > 5000 || suspectedName.toLowerCase().includes('paracetamol')) {
    phenotype = 'Acute hepatic necrosis';
    phenotypeVi = 'Hoại tử tế bào gan cấp diện rộng (Acute hepatic necrosis)';
    mechanism = 'Direct';
    clinicalClues.push('ALT/AST tăng vọt hàng ngàn đến hàng vạn U/L; khởi phát đột ngột 1 - 5 ngày sau liều cao hoặc tăng liều (Paracetamol, Amiodarone IV, nấm độc Amanita).');
    recommendedActions.push('Với Paracetamol: Dùng ngay N-acetylcysteine (NAC) theo phác đồ đường tĩnh mạch.');
    recommendedActions.push('Đánh giá INR, toan kiềm, chức năng thận mỗi 6 - 12h; hội chẩn Trung tâm Ghép gan nếu INR ≥ 1.5.');
  } else if (labs.ana === 'positive' || labs.asma === 'positive' || (latency && latency > 90 && (suspectedName.toLowerCase().includes('nitrofurantoin') || suspectedName.toLowerCase().includes('minocycline')))) {
    phenotype = 'Chronic hepatitis / Drug-induced AIH';
    phenotypeVi = 'Viêm gan mạn tính / Viêm gan dạng tự miễn do thuốc (Drug-induced AIH)';
    clinicalClues.push('Dùng thuốc kéo dài hàng tháng/năm (Nitrofurantoin, Minocycline, Statins, Methyldopa). Tự kháng thể ANA/ASMA thường dương tính.');
    recommendedActions.push('Dừng vĩnh viễn thuốc liên quan. Nếu viêm gan nặng, dùng đợt ngắn Prednisone 20 - 60 mg/ngày.');
    recommendedActions.push('Theo dõi tối thiểu 6 tháng sau khi dừng corticoid: DILI tự miễn sẽ khỏi hoàn toàn và KHÔNG tái phát (khác biệt cốt lõi với AIH nguyên phát).');
  } else if (rRatio < 2 || labs.hasPruritus) {
    phenotype = 'Cholestatic hepatitis';
    phenotypeVi = 'Viêm gan ứ mật do thuốc (Cholestatic hepatitis)';
    clinicalClues.push('ALP tăng cao ưu thế (R < 2) kèm ngứa da xuất hiện sớm. Điển hình do Amoxicillin-clavulanate, Cefazolin, Terbinafine, Azathioprine.');
    recommendedActions.push('Ngừng thuốc nghi ngờ. Theo dõi sát Bilirubin và ALP; cảnh báo nguy cơ Hội chứng tiêu biến đường mật (VBDS) nếu ứ mật kéo dài > 6 tháng.');
  } else if (rRatio >= 2 && rRatio <= 5) {
    phenotype = 'Mixed hepatitis';
    phenotypeVi = 'Viêm gan hỗn hợp (Mixed hepatitis)';
    clinicalClues.push('Cả ALT và ALP đều tăng vừa phải (2 ≤ R ≤ 5). Hay gặp do TMP-SMZ, Phenytoin, Fluoroquinolones, Macrolides.');
    recommendedActions.push('Ngừng thuốc. Thể hỗn hợp thường có tiên lượng lành tính nhất, hiếm khi dẫn tới suy gan cấp.');
  } else if (rRatio > 5) {
    phenotype = 'Acute hepatocellular hepatitis';
    phenotypeVi = 'Viêm gan tế bào gan cấp đặc ứng (Acute hepatocellular hepatitis)';
    clinicalClues.push('ALT tăng cao gấp 5 đến 50 lần (R > 5) sau 5 - 90 ngày dùng Isoniazid, Diclofenac, tinh chất trà xanh.');
    recommendedActions.push('Đình chỉ ngay thuốc nghi ngờ. Theo dõi Dechallenge (ALT thường giảm > 50% trong 30 ngày).');
  }

  // 5. Special Indirect Hepatitis Notes
  if (labs.isUsingCheckpointInhibitor) {
    phenotypeVi = 'Viêm gan qua trung gian miễn dịch do thuốc ức chế điểm kiểm soát (ICI-mediated hepatitis)';
    mechanism = 'Indirect';
    clinicalClues.push('Tác động điều biến miễn dịch gián tiếp của thuốc kháng PD-1 / PD-L1 / CTLA-4 (Pembrolizumab, Nivolumab, Ipilimumab).');
    recommendedActions.push('Nếu ALT > 3 - 5x ULN: Tạm dừng chu kỳ truyền, chỉ định Prednisone 0.5 - 1 mg/kg/ngày.');
    recommendedActions.push('Nếu ALT > 5x ULN hoặc Hy\'s Law: Ngừng vĩnh viễn thuốc, Methylprednisolone 1 - 2 mg/kg/ngày; hội chẩn Ung bướu và Tiêu hóa.');
  }

  if (labs.isUsingImmunosuppressant) {
    clinicalClues.push('Nguy cơ tái hoạt virus Viêm gan B (HBV Reactivation) tiềm ẩn do suy giảm tế bào lympho (đặc biệt kháng CD20 Rituximab).');
    recommendedActions.push('Bắt buộc kiểm tra HBsAg, Anti-HBc và tải lượng HBV DNA; chỉ định thuốc kháng virus dự phòng (Entecavir / Tenofovir).');
  }

  // 6. Latency Assessment
  let latencyAssessment = '';
  if (latency !== undefined) {
    if (latency <= 5) {
      latencyAssessment = `Thời gian ủ bệnh rất ngắn (${latency} ngày): Phù hợp nhất với độc tính trực tiếp (Direct) do quá liều hoặc tăng liều đột ngột.`;
    } else if (latency <= 90) {
      latencyAssessment = `Thời gian ủ bệnh trung bình (${latency} ngày): Điển hình của độc tính đặc ứng (Idiosyncratic) hoặc kháng sinh đường uống.`;
    } else {
      latencyAssessment = `Thời gian ủ bệnh kéo dài (${latency} ngày): Điển hình của viêm gan mạn tính dạng tự miễn (Nitrofurantoin, Minocycline) hoặc tăng sản nốt tái tạo (NRH).`;
    }
  }

  // 7. General IsSuspected Flag
  const isSuspected = Boolean(
    suspectedName || 
    labs.isUsingAnabolicSteroids || 
    labs.isUsingHerbalSupplements || 
    labs.isUsingCheckpointInhibitor || 
    labs.isUsingImmunosuppressant || 
    labs.hasImmunoallergicFeatures || 
    labs.hasLacticAcidosis || 
    labs.hasSinusoidalObstructionSigns ||
    (isHighTransaminases && !labs.alcoholIntake)
  );

  return {
    isSuspected,
    mechanism,
    phenotype,
    phenotypeVi,
    hysLaw,
    implicatedAgent: suspectedName || matchedAgent?.name,
    agentCategory,
    latencyDays: latency,
    latencyAssessment: latencyAssessment || undefined,
    clinicalClues,
    recommendedActions,
    immunoallergicNote: labs.hasImmunoallergicFeatures ? 'Bệnh nhân có dấu hiệu quá mẫn miễn dịch dị ứng (sốt/ban da/eosinophilia)' : undefined,
    geneticHlaNote: matchedAgent?.hlaAssociation ? `Đặc điểm di truyền liên quan: ${matchedAgent.hlaAssociation}` : undefined
  };
}

/**
 * Main Comprehensive CDSS Analyzer Engine
 * Incorporates NEJM 2019 DILI Engine, 2024 Clinical Pathologist Review, Sikaris 2013, ACG 2017 & WHO

 */
export function calculateAnalysis(labs: PatientLabs): CDSSAnalysis {
  // 1. Establish True Healthy Normal ULN (ACG 2017 standard vs lab-specific)
  const defaultAltUln = labs.gender === 'male' ? 33 : 25;
  const defaultAstUln = labs.gender === 'male' ? 33 : 25;
  const defaultAlpUln = 120;

  const altUln = labs.altUln || defaultAltUln;
  const astUln = labs.astUln || defaultAstUln;
  const alpUln = labs.alpUln || defaultAlpUln;

  const altMultiples = Number((labs.alt / altUln).toFixed(2));
  const astMultiples = Number((labs.ast / astUln).toFixed(2));
  const alpMultiples = Number((labs.alp / alpUln).toFixed(2));

  // 2. R ratio calculation: (ALT / ULN) / (ALP / ULN)
  const rRatio = alpMultiples > 0 ? Number((altMultiples / alpMultiples).toFixed(2)) : 0;

  // 3. De Ritis ratio: AST / ALT
  const deRitisRatio = labs.alt > 0 ? Number((labs.ast / labs.alt).toFixed(2)) : 0;

  // 4. Bilirubin fractionation (WHO & ACG guideline)
  const conjugatedPercent = labs.totalBilirubin > 0 
    ? Number(((labs.directBilirubin / labs.totalBilirubin) * 100).toFixed(1)) 
    : 0;
  const isConjugatedPredominant = conjugatedPercent >= 50;
  const isUnconjugatedPredominant = conjugatedPercent < 20 && labs.totalBilirubin > 1.2;

  // 5. Severity evaluation (ACG 2017 multiples of ULN)
  const maxTransaminase = Math.max(labs.alt, labs.ast);
  const maxMultiple = Math.max(altMultiples, astMultiples);

  let severity: ElevationSeverity = 'Normal';
  if (maxTransaminase > 10000) {
    severity = 'Massive (>10,000 U/L)';
  } else if (maxMultiple > 15) {
    severity = 'Severe (>15x ULN)';
  } else if (maxMultiple >= 5) {
    severity = 'Moderate (5-15x ULN)';
  } else if (maxMultiple >= 2) {
    severity = 'Mild (2-5x ULN)';
  } else if (maxMultiple > 1) {
    severity = 'Borderline (<2x ULN)';
  }

  // 6. Pattern of Injury determination
  let pattern: InjuryPattern = 'Normal / Borderline';
  const isTransaminaseElevated = altMultiples > 1 || astMultiples > 1;
  const isAlpElevated = alpMultiples > 1;
  const isBilirubinElevated = labs.totalBilirubin > 1.2;

  if (isBilirubinElevated && !isTransaminaseElevated && !isAlpElevated) {
    pattern = 'Isolated Hyperbilirubinemia';
  } else if (isTransaminaseElevated || isAlpElevated) {
    if (rRatio > 5) {
      pattern = 'Hepatocellular';
    } else if (rRatio < 2 && isAlpElevated) {
      pattern = 'Cholestatic';
    } else if (rRatio >= 2 && rRatio <= 5) {
      pattern = 'Mixed';
    } else if (isTransaminaseElevated && !isAlpElevated) {
      pattern = 'Hepatocellular';
    } else if (isAlpElevated && !isTransaminaseElevated) {
      pattern = 'Cholestatic';
    }
  }

  // 7. De Ritis Matrix Evaluation (Sikaris 2013 Table 2)
  const deRitisDetail = evaluateDeRitisMatrix(labs.ast, labs.alt, labs, maxMultiple);

  // 8. Synthetic function & Acute Alerts
  const syntheticImpairment = (labs.albumin !== undefined && labs.albumin < 3.5) || 
                              (labs.inr !== undefined && labs.inr >= 1.5) ||
                              (labs.prothrombinTimeSeconds !== undefined && labs.prothrombinTimeSeconds > 12.5);
  
  const isAcuteLiverFailureWarning = Boolean(
    (labs.alt > 200 || labs.ast > 200) &&
    (labs.inr !== undefined && labs.inr >= 1.5) &&
    labs.hasEncephalopathy
  );

  const isMassiveTransaminitisWarning = maxTransaminase > 10000;

  // 9. FIB-4 Score Calculation
  let fib4Score: number | undefined;
  let fib4Stage: string | undefined;
  if (labs.age && labs.platelets && labs.platelets > 0 && labs.alt > 0) {
    fib4Score = Number(((labs.age * labs.ast) / (labs.platelets * Math.sqrt(labs.alt))).toFixed(2));
    const lowCutoff = labs.age > 65 ? 2.0 : 1.30;
    if (fib4Score < lowCutoff) {
      fib4Stage = `F0 - F1 (Nguy cơ xơ hóa tiến triển thấp, giá trị tiên đoán âm NPV ~90%)`;
    } else if (fib4Score >= lowCutoff && fib4Score <= 2.67) {
      fib4Stage = `Vùng xám không xác định (Khuyến cáo đo độ đàn hồi mô gan VCTE / FibroScan)`;
    } else {
      fib4Stage = `F3 - F4 (Nguy cơ xơ hóa tiến triển / xơ gan cao, PPV >65-80%)`;
    }
  }

  // 10. APRI Score Calculation
  let apriScore: number | undefined;
  let apriStage: string | undefined;
  if (labs.platelets && labs.platelets > 0 && astUln > 0) {
    apriScore = Number((((labs.ast / astUln) * 100) / labs.platelets).toFixed(2));
    if (apriScore < 0.5) {
      apriStage = 'F0 - F1 (Ít khả năng xơ hóa đáng kể, độ nhạy cao)';
    } else if (apriScore >= 0.5 && apriScore <= 1.5) {
      apriStage = 'F2 - F3 (Nghi ngờ xơ hóa có ý nghĩa lâm sàng)';
    } else {
      apriStage = 'F4 (Khả năng xơ gan cao, chuyên biệt >90%)';
    }
  }

  // 11. MELD Score Calculation
  let meldScore: number | undefined;
  if (labs.totalBilirubin > 0 && labs.inr && labs.inr > 0 && labs.creatinine && labs.creatinine > 0) {
    const bil = Math.max(1.0, labs.totalBilirubin);
    const inr = Math.max(1.0, labs.inr);
    const cr = Math.min(4.0, Math.max(1.0, labs.creatinine));
    const rawMeld = 3.78 * Math.log(bil) + 11.2 * Math.log(inr) + 9.57 * Math.log(cr) + 6.43;
    meldScore = Math.round(Math.min(40, Math.max(6, rawMeld)));
  }

  // 12. Pre-analytical & Interfering Factor Evaluation (Altaihani et al. 2024)
  const preAnalyticalAlerts: string[] = [];
  if (labs.sampleHemolysis) {
    preAnalyticalAlerts.push(
      'MẪU BỊ TÁN HUYẾT (Hemolysis Index dương tính): Hồng cầu chứa nồng độ AST cao gấp 40 lần huyết tương và giàu LDH. Tán huyết gây TĂNG GIẢ AST và LDH trong ống nghiệm! Khuyến cáo lấy lại mẫu máu mới.'
    );
  }
  if (labs.sampleLipemia) {
    preAnalyticalAlerts.push(
      'HUYẾT THANH ĐỤC MỠ (Lipemia): Sự tán xạ ánh sáng ảnh hưởng nghiêm trọng đến các phép đo quang phổ ở bước sóng 340 nm (phản ứng tiêu thụ NADH đo ALT và AST). Cần siêu ly tâm làm trong mẫu trước khi đo lại.'
    );
  }
  if (labs.sampleIcterus) {
    preAnalyticalAlerts.push(
      'VÀNG DA ĐẬM (Icterus): Bilirubin hấp thụ ánh sáng ở dải 400 - 540 nm, có thể can thiệp làm sai lệch kết quả định lượng Creatinine, GGT hoặc các enzyme màu.'
    );
  }
  if (labs.metronidazoleUse) {
    preAnalyticalAlerts.push(
      'ẢNH HƯỞNG CỦA THUỐC METRONIDAZOLE: Metronidazole có đỉnh hấp phụ quang học gần bước sóng 340 nm, có thể làm GIẢM GIẢ TẠO nồng độ ALT trên các hệ máy tự động dùng phương pháp IFCC.'
    );
  }
  if (labs.sampleDelayed) {
    preAnalyticalAlerts.push(
      'VI PHẠM BẢO QUẢN TIỀN PHÂN TÍCH: Huyết thanh để quá 8 giờ ở nhiệt độ phòng (+15°C đến +30°C). Quy chuẩn: Nếu quá 8h phải bảo quản ở +2°C đến +8°C (tối đa 48h); nếu kéo dài hơn phải trữ đông -15°C đến -20°C và chỉ rã đông 1 lần duy nhất!'
    );
  }
  if (labs.isNonFasting) {
    preAnalyticalAlerts.push(
      'MẪU LẤY SAU ĂN (Non-fasting): Bữa ăn giàu lipid có thể làm tăng ALT tạm thời lên tới 30 U/L (kéo dài tới 12h ở người nhóm máu B và O), đồng thời giải phóng enzyme ALP từ niêm mạc ruột. Nên lấy máu vào buổi sáng sau nhịn đói qua đêm.'
    );
  }
  if (labs.isSmoker) {
    preAnalyticalAlerts.push(
      'HÚT THUỐC LÁ: Có liên quan đến tăng phosphatase kiềm thể nhau thai (PLALP). Nồng độ này thường mất 1 - 2 tháng sau khi cai thuốc mới trở về bình thường.'
    );
  }
  if (labs.strenuousExercise) {
    preAnalyticalAlerts.push(
      'VẬN ĐỘNG CƯỜNG ĐỘ CAO: Tập thể hình hoặc chạy marathon giải phóng lượng lớn AST từ cơ bắp (tỷ lệ cơ vân AST:ALT là 17:1), làm tăng men gan giả. Cần nghỉ ngơi 48-72h và xét nghiệm kèm Creatine Kinase (CK).'
    );
  }

  // 13. Secondary Biomarkers & Tumor Markers Evaluation (Altaihani et al. 2024)
  const secondaryBiomarkerAlerts: string[] = [];
  if (labs.afp !== undefined) {
    if (labs.afp >= 400) {
      secondaryBiomarkerAlerts.push(
        `AFP TĂNG RẤT CAO (${labs.afp} ng/mL): Giá trị chẩn đoán xác định Ung thư biểu mô tế bào gan (HCC) hoặc Hepatoblastoma rất cao. Chỉ định khẩn cấp CT bụng 4 pha có cản quang hoặc MRI gan với thuốc đối quang từ chuyên biệt gan mật (Primovist).`
      );
    } else if (labs.afp > 20) {
      secondaryBiomarkerAlerts.push(
        `AFP tăng nhẹ đến vừa (${labs.afp} ng/mL): Có thể do hiện tượng tái tạo tế bào gan trong đợt viêm gan virus cấp/mạn tính bùng phát, hoặc tổn thương HCC giai đoạn sớm. Cần siêu âm Doppler gan và theo dõi động học AFP sau 1 - 3 tháng.`
      );
    } else {
      secondaryBiomarkerAlerts.push(`AFP trong giới hạn bình thường (${labs.afp} ng/mL).`);
    }
  }

  if (labs.ca199 !== undefined) {
    if (labs.ca199 > 100) {
      secondaryBiomarkerAlerts.push(
        `CA 19-9 TĂNG CAO (${labs.ca199} U/mL): Gợi ý nguy cơ Ung thư đường mật (Cholangiocarcinoma) hoặc ung thư tụy; đặc biệt cảnh giác nguy cơ thoái hóa ác tính ở bệnh nhân Viêm xơ đường mật tiên phát (PSC). Cần chụp MRCP hoặc CT đa dãy.`
      );
    } else if (labs.ca199 > 37) {
      secondaryBiomarkerAlerts.push(
        `CA 19-9 tăng vừa (${labs.ca199} U/mL): Lưu ý hiện tượng ứ mật hoặc viêm đường mật lành tính cũng có thể làm CA 19-9 tăng thứ phát.`
      );
    }
  }

  if (labs.ferritin !== undefined || labs.transferrinSat !== undefined) {
    const isIronOverload = (labs.transferrinSat && labs.transferrinSat >= 45) || (labs.ferritin && labs.ferritin > 1000);
    if (isIronOverload) {
      secondaryBiomarkerAlerts.push(
        `QUÁ TẢI SẮT (Độ bão hòa Transferrin ${labs.transferrinSat || 'N/A'}% [≥45%], Ferritin ${labs.ferritin || 'N/A'} ng/mL): Hướng dẫn ACG 2017 khuyến cáo chỉ định ngay xét nghiệm đột biến gen HFE (C282Y và H63D) để xác chẩn Bệnh ứ sắt mô di truyền (Hereditary Hemochromatosis).`
      );
    } else if (labs.ferritin && labs.ferritin > 300) {
      secondaryBiomarkerAlerts.push(
        `Ferritin tăng (${labs.ferritin} ng/mL): Lưu ý Ferritin là protein phản ứng viêm pha cấp (acute-phase reactant), thường tăng thứ phát trong viêm gan cấp, nhiễm trùng hoặc hoại tử tế bào gan mà không phải ứ sắt nguyên phát.`
      );
    }
  }

  if (labs.ceruloplasmin !== undefined) {
    if (labs.ceruloplasmin < 20) {
      secondaryBiomarkerAlerts.push(
        `CERULOPLASMIN GIẢM THẤP (${labs.ceruloplasmin} mg/dL): Gặp ở 85% bệnh nhân bệnh Wilson (rối loạn chuyển hóa đồng ATP7B di truyền lặn). Khuyến cáo khám mắt bằng đèn khe tìm vòng Kayser-Fleischer và định lượng đồng nước tiểu 24 giờ (>100 µg/ngày).`
      );
    }
  }

  if (labs.tsh !== undefined) {
    if (labs.tsh > 4.5) {
      secondaryBiomarkerAlerts.push(
        `TSH TĂNG (${labs.tsh} µIU/mL - Suy giáp): Suy giáp có thể gây tăng transaminase hoặc ứ mật, đi kèm tăng lipid máu và tăng men cơ (CK). Cần bổ sung Free T4/Free T3.`
      );
    } else if (labs.tsh < 0.3) {
      secondaryBiomarkerAlerts.push(
        `TSH GIẢM (${labs.tsh} µIU/mL - Cường giáp/Nhiễm độc giáp): Có thể gây tổn thương gan thể tế bào gan hoặc ứ mật do tăng chuyển hóa và thiếu oxy tương đối ở vùng trung tâm tiểu thùy Zone 3.`
      );
    }
  }

  // 14. Autoimmune Serology Alerts (Altaihani et al. 2024)
  const autoimmuneAlerts: string[] = [];
  if (labs.ama === 'positive') {
    autoimmuneAlerts.push(
      'KHÁNG THỂ KHÁNG TY THỂ (AMA) DƯƠNG TÍNH: Tiêu chuẩn vàng huyết thanh học cho Viêm đường mật tiên phát (Primary Biliary Cholangitis - PBC, độ đặc hiệu >95%). Phối hợp với ALP tăng khẳng định chẩn đoán mà không nhất thiết phải sinh thiết gan.'
    );
  }
  if (labs.ana === 'positive' || labs.asma === 'positive') {
    autoimmuneAlerts.push(
      `KHÁNG THỂ TỰ MIỄN DƯƠNG TÍNH (${labs.ana === 'positive' ? 'ANA +' : ''} ${labs.asma === 'positive' ? 'ASMA +' : ''}): Gợi ý Viêm gan tự miễn Type 1 (AIH-1). Tỷ lệ nữ:nam là 4:1. Khuyến cáo định lượng nồng độ IgG toàn phần và điện di protein huyết thanh tìm tăng gamma-globulin máu.`
    );
  }
  if (labs.antiLkm1 === 'positive') {
    autoimmuneAlerts.push(
      'ANTI-LKM1 DƯƠNG TÍNH: Dấu ấn huyết thanh đặc trưng của Viêm gan tự miễn Type 2 (AIH-2), thường gặp ở trẻ em gái và người trẻ tuổi, diễn tiến lâm sàng cấp tính và nặng nề hơn Type 1.'
    );
  }
  if (labs.pAnca === 'positive') {
    autoimmuneAlerts.push(
      'p-ANCA DƯƠNG TÍNH: Thường liên quan đến Viêm xơ đường mật tiên phát (PSC) và bệnh viêm ruột tự miễn (IBD / Viêm loét đại tràng chảy máu). Cần chỉ định chụp MRCP khảo sát hình thái cây đường mật.'
    );
  }
  if (labs.antiTtgIga === 'positive') {
    autoimmuneAlerts.push(
      'ANTI-tTG IgA DƯƠNG TÍNH: Gợi ý bệnh Celiac (nhạy cảm gluten). Celiac có thể gây tăng transaminase gan âm thầm; men gan thường trở về bình thường sau khi áp dụng chế độ ăn không gluten (Gluten-free diet).'
    );
  }

  // 15. Quality Control Guidance (Altaihani et al. 2024 & ACG 2017)
  const qualityControlGuidance: string[] = [
    'Quy chuẩn nội kiểm (QC): Các xét nghiệm không miễn trừ (non-waived) bắt buộc chạy tối thiểu 2 mức nồng độ chứng (control) mỗi 24 giờ.',
    'Áp dụng hệ thống quy tắc đa kiểm Westgard (Westgard Multi-rules) để phát hiện sai số ngẫu nhiên (1:3s, R:4s) và sai số hệ thống (2:2s, 4:1s, 10:x).',
    'Nếu phòng xét nghiệm áp dụng kế hoạch IQCP (Individualized Quality Control Plan), phải đánh giá toàn diện nguy cơ sai số ở cả 3 giai đoạn: Trước, Trong và Sau phân tích.',
    'Bảo quản mẫu thử: Huyết thanh tách rời không để quá 8h ở nhiệt độ 15-30°C. Bảo quản lạnh 2-8°C tối đa 48h. Đóng băng -15°C đến -20°C nếu lưu trữ lâu hơn và chỉ rã đông một lần.'
  ];

  // 16. Key Findings summary
  const keyFindings: string[] = [];
  keyFindings.push(`Kiểu tổn thương: ${pattern} (Chỉ số R = ${rRatio})`);
  keyFindings.push(`Mức độ tăng men gan: ${severity} (ALT ${altMultiples}x ULN [ULN: ${altUln}], AST ${astMultiples}x ULN [ULN: ${astUln}])`);
  keyFindings.push(`Tỷ số De Ritis (AST/ALT): ${deRitisRatio} - ${deRitisDetail.clinicalMeaning}`);

  if (labs.totalBilirubin > 1.2) {
    keyFindings.push(
      `Tăng Bilirubin: Toàn phần ${labs.totalBilirubin} mg/dL, Trực tiếp ${labs.directBilirubin} mg/dL (${conjugatedPercent}% liên hợp - ${
        isConjugatedPredominant 
          ? 'Ưu thế liên hợp/trực tiếp >50% [Bệnh lý gan mật]' 
          : isUnconjugatedPredominant 
            ? 'Ưu thế gián tiếp/tự do >80% [Tán huyết hoặc Gilbert]' 
            : 'Thể hỗn hợp'
      })`
    );
  } else {
    keyFindings.push(`Bilirubin toàn phần trong giới hạn bình thường (${labs.totalBilirubin} mg/dL)`);
  }

  if (syntheticImpairment) {
    const albDesc = labs.albumin && labs.albumin < 3.5 
      ? `Albumin máu giảm (${labs.albumin} g/dL, t½ ~21 ngày phản ánh tổn thương mạn tính)` 
      : '';
    const inrDesc = labs.inr && labs.inr >= 1.5 
      ? `INR kéo dài (${labs.inr}, phản ánh thiếu hụt yếu tố đông máu cấp/nặng)` 
      : '';
    const ptDesc = labs.prothrombinTimeSeconds && labs.prothrombinTimeSeconds > 12.5 
      ? `Thời gian Prothrombin kéo dài (${labs.prothrombinTimeSeconds}s / Bình thường 10.9-12.5s)` 
      : '';
    keyFindings.push(`Suy giảm chức năng tổng hợp của gan: ${albDesc} ${inrDesc} ${ptDesc}`);
  }

  if (isAcuteLiverFailureWarning) {
    keyFindings.push(
      `CẢNH BÁO NGUY CƠ SUY GAN CẤP (ALF): Tổn thương tế bào gan + Rối loạn đông máu (INR ≥ 1.5) + Bệnh não gan!`
    );
  }

  if (isMassiveTransaminitisWarning) {
    keyFindings.push(
      `TĂNG TRANSAMINASE MỨC ĐỘ KHỔNG LỒ (>10,000 U/L): Gợi ý ngộ độc Paracetamol, viêm gan thiếu máu cục bộ (Shock Liver), hoặc ngộ độc nấm độc Amanita phalloides.`
    );
  }

  if (labs.ck && labs.ck > 400 && labs.ast > labs.alt) {
    keyFindings.push(
      `Creatine Kinase (CK) tăng (${labs.ck} U/L) đi kèm AST > ALT: Phản ánh tổn thương cơ vân (Rhabdomyolysis / Chấn thương cơ) giải phóng AST cơ bắp.`
    );
  }

  // 17. Differential Diagnoses Engine
  const differentials: CDSSAnalysis['differentialDiagnoses'] = [];

  if (isMassiveTransaminitisWarning || maxMultiple > 15) {
    differentials.push({
      disease: 'Tổn thương gan do Acetaminophen (Ngộ độc Paracetamol)',
      likelihood: 'Rất cao',
      clues: 'ALT/AST tăng vọt cực nhanh (>15x đến >10,000 U/L), toan chuyển hóa, tăng lactate. Tiền sử dùng thuốc giảm đau quá liều hoặc dùng liều cao kéo dài ở người nghiện rượu.',
      recommendedNextStep: 'Định lượng nồng độ Paracetamol huyết thanh khẩn, khí máu động mạch, chỉ định ngay N-Acetylcysteine (NAC) đường tĩnh mạch theo phác đồ Rumack-Matthew.'
    });
    differentials.push({
      disease: 'Viêm gan thiếu máu cục bộ (Ischemic Hepatitis / Shock Liver)',
      likelihood: 'Rất cao',
      clues: 'AST thường tăng vọt trước và cao hơn ALT trong 24h đầu, LDH tăng rất cao, tiền sử tụt huyết áp, sốc tim, suy hô hấp nặng hoặc sau hồi sức cấp cứu.',
      recommendedNextStep: 'Khôi phục tưới máu huyết động học, siêu âm Doppler mạch máu gan (loại trừ huyết khối tĩnh mạch gan Budd-Chiari), theo dõi chức năng thận.'
    });
    differentials.push({
      disease: 'Viêm gan virus cấp bùng phát (Acute Viral Hepatitis A, B, C, D, E)',
      likelihood: 'Cao',
      clues: 'ALT > AST trong giai đoạn đầu (De Ritis < 1.0). Nếu De Ritis đảo chiều > 1.5 hoặc > 2.0 kèm INR kéo dài: cảnh báo viêm gan bùng phát thể tối cấp.',
      recommendedNextStep: 'Làm IgM anti-HAV, HBsAg, IgM anti-HBc, anti-HCV + HCV RNA, IgM anti-HEV (vùng dịch tễ). Khám dấu hiệu bệnh não gan.'
    });
  } else if (pattern === 'Hepatocellular') {
    if (deRitisRatio >= 2.0 && maxTransaminase <= 500) {
      differentials.push({
        disease: 'Bệnh gan do rượu (Alcoholic Liver Disease / Alcoholic Hepatitis)',
        likelihood: 'Rất cao',
        clues: `AST:ALT > 2:1 (do cồn gây độc ty thể giải phóng mAST + thiếu hụt Pyridoxine B6 ức chế tổng hợp ALT), AST hiếm khi vượt quá 400-500 U/L. GGT thường tăng cao kèm theo.`,
        recommendedNextStep: 'Khai thác lượng rượu tiêu thụ (>210g/tuần ở nam, >140g/tuần ở nữ), định lượng PEth nếu cần, bổ sung Vitamin B1 và B6, tính chỉ số Maddrey DF nếu vàng da nặng.'
      });
    }

    differentials.push({
      disease: 'Viêm gan virus mạn tính bùng phát (Chronic HBV/HCV Flare)',
      likelihood: 'Cao',
      clues: 'ALT ưu thế (De Ritis < 1.0 trong thể ổn định), tăng từ 2x đến 10x ULN. Nếu De Ritis > 1.09 gợi ý đã có xơ gan tiến triển.',
      recommendedNextStep: 'HBsAg, HBeAg, tải lượng HBV DNA định lượng, Anti-HCV, HCV RNA PCR, đánh giá AFP huyết thanh tầm soát HCC.'
    });

    differentials.push({
      disease: 'Bệnh gan nhiễm mỡ chuyển hóa (MASLD / MASH)',
      likelihood: 'Cao',
      clues: `Men gan tăng nhẹ đến vừa (<5x ULN), ALT thường > AST (De Ritis < 1.0), liên quan hội chứng chuyển hóa, thừa cân/béo phì (BMI ${labs.bmi || 'chưa ghi nhận'}), đái tháo đường, rối loạn lipid máu.`,
      recommendedNextStep: 'Siêu âm gan tìm hình ảnh tăng âm ("bright liver"), đo độ đàn hồi thoáng qua (FibroScan) đánh giá độ nhiễm mỡ CAP và độ cứng mô gan.'
    });

    differentials.push({
      disease: 'Tổn thương gan do thuốc / thảo dược (DILI / HDS)',
      likelihood: 'Cần loại trừ',
      clues: 'Khởi phát trong vòng vài ngày đến vài tuần sau khi dùng thuốc mới (kháng sinh như Augmentin, thuốc kháng lao, statin, thuốc chống co giật, thảo dược đông y, thực phẩm chức năng).',
      recommendedNextStep: 'Rà soát danh mục thuốc kê đơn và OTC, ngưng ngay chất nghi ngờ, tra cứu cơ sở dữ liệu LiverTox.nih.gov.'
    });

    if (labs.age && labs.age < 55) {
      differentials.push({
        disease: 'Bệnh Wilson (Wilson Disease)',
        likelihood: labs.ceruloplasmin && labs.ceruloplasmin < 20 ? 'Rất cao' : 'Cần loại trừ',
        clues: 'AST > ALT, ALP thường thấp bất thường (ALP/Bilirubin < 4), tán huyết Coombs âm tính, triệu chứng thần kinh ngoại tháp hoặc rối loạn tâm thần.',
        recommendedNextStep: 'Định lượng Ceruloplasmin huyết thanh, đồng niệu 24h, khám mắt đèn khe tìm vòng Kayser-Fleischer, phân tích đột biến gen ATP7B.'
      });
    }

    differentials.push({
      disease: 'Bệnh ứ sắt mô di truyền (Hereditary Hemochromatosis)',
      likelihood: (labs.transferrinSat && labs.transferrinSat >= 45) ? 'Cao' : 'Cần loại trừ',
      clues: 'Men gan tăng mạn tính nhẹ, có thể kèm sạm da màu đồng, đái tháo đường ("tiểu đường đồng"), đau khớp ngón tay, bệnh cơ tim.',
      recommendedNextStep: 'Độ bão hòa Transferrin (nếu ≥45%) và Ferritin huyết thanh; xét nghiệm đột biến gen HFE (C282Y, H63D).'
    });

    differentials.push({
      disease: 'Viêm gan tự miễn (Autoimmune Hepatitis - AIH)',
      likelihood: (labs.ana === 'positive' || labs.asma === 'positive' || labs.antiLkm1 === 'positive') ? 'Cao' : 'Cần loại trừ',
      clues: 'Thường gặp ở phụ nữ (tỷ lệ 4:1), tăng gamma-globulin / IgG huyết thanh, có thể đi kèm viêm tuyến giáp tự miễn, viêm khớp hoặc viêm loét đại tràng.',
      recommendedNextStep: 'Bộ kháng thể tự miễn: ANA, ASMA, Anti-LKM1, định lượng IgG toàn phần, cân nhắc sinh thiết gan xác định mô học.'
    });

    if (labs.tsh && (labs.tsh > 4.5 || labs.tsh < 0.3)) {
      differentials.push({
        disease: 'Bệnh lý tuyến giáp gây tổn thương gan (Thyroid Dysfunction)',
        likelihood: 'Cao',
        clues: `TSH bất thường (${labs.tsh} µIU/mL). Cả suy giáp và cường giáp đều có thể gây tăng transaminase hoặc ứ mật.`,
        recommendedNextStep: 'Đo Free T4, Free T3, kháng thể kháng giáp (Anti-TPO), điều trị ổn định chức năng tuyến giáp và theo dõi lại men gan.'
      });
    }
  } else if (pattern === 'Cholestatic') {
    if (labs.ultrasoundBiliaryDilatation === 'dilated') {
      differentials.push({
        disease: 'Tắc mật ngoài gan do sỏi hoặc khối u (Extrahepatic Biliary Obstruction)',
        likelihood: 'Rất cao',
        clues: 'ALP & GGT tăng cao, Bilirubin trực tiếp tăng ưu thế (>50%), siêu âm có hình ảnh dãn đường mật trong/ngoài gan.',
        recommendedNextStep: 'Chụp cộng hưởng từ mật tụy (MRCP) hoặc nội soi mật tụy ngược dòng (ERCP) cấp cứu nếu có nhiễm trùng đường mật (tam chứng Charcot).'
      });
    } else {
      differentials.push({
        disease: 'Ứ mật ngoài gan nghi ngờ (Sỏi ống mật chủ đoạn thấp / U bóng Vater)',
        likelihood: 'Cao',
        clues: 'ALP tăng ưu thế, phân bạc màu, nước tiểu sẫm màu, ngứa toàn thân.',
        recommendedNextStep: 'Siêu âm ổ bụng kiểm tra giãn đường mật. Nếu siêu âm âm tính nhưng lâm sàng nghi ngờ cao, chỉ định MRCP hoặc EUS.'
      });
    }

    differentials.push({
      disease: 'Viêm đường mật tiên phát (Primary Biliary Cholangitis - PBC)',
      likelihood: labs.ama === 'positive' ? 'Rất cao' : 'Cao',
      clues: 'Thường gặp ở phụ nữ trung niên, mệt mỏi mạn tính, ngứa da, ALP và GGT tăng kéo dài, đường mật không dãn trên siêu âm. Kháng thể AMA dương tính >95%.',
      recommendedNextStep: 'Xét nghiệm kháng thể kháng ty thể (AMA), định lượng IgM huyết thanh, điều trị đặc hiệu bằng Ursodeoxycholic acid (UDCA).'
    });

    differentials.push({
      disease: 'Viêm xơ đường mật tiên phát (Primary Sclerosing Cholangitis - PSC)',
      likelihood: (labs.ca199 && labs.ca199 > 37) ? 'Cao' : 'Trung bình',
      clues: 'Thường gặp ở nam giới, tiền sử viêm loét đại tràng (IBD), hình ảnh hẹp dãn xen kẽ hình chuỗi hạt trên cây đường mật, nguy cơ biến chứng Cholangiocarcinoma.',
      recommendedNextStep: 'Chụp MRCP đánh giá cây mật, định lượng IgG4 (loại trừ bệnh liên quan IgG4), theo dõi CA 19-9 định kỳ.'
    });

    differentials.push({
      disease: 'Ứ mật do thuốc (Drug-Induced Cholestasis)',
      likelihood: 'Cao',
      clues: 'Hay gặp do Amoxicillin-Clavulanate (Augmentin - tỷ lệ 19/100,000 dân), steroid đồng hóa, thuốc tránh thai uống, Cefazolin, Azithromycin, Macrolide.',
      recommendedNextStep: 'Rà soát tiền sử dùng thuốc trong vòng 1-6 tháng gần đây, ngừng thuốc và theo dõi ALP/GGT hạ dần.'
    });

    differentials.push({
      disease: 'Bệnh thâm nhiễm gan (Infiltrative Liver Disease)',
      likelihood: 'Trung bình',
      clues: 'ALP tăng rất cao đơn độc trong khi Bilirubin có thể bình thường hoặc tăng nhẹ: U hạt Sarcoidosis, lao gan, ung thư biểu mô tế bào gan hoặc ung thư di căn gan.',
      recommendedNextStep: 'CT ngực bụng cản quang, MRI gan, các dấu ấn sinh học khối u (AFP, CA 19-9), cân nhắc sinh thiết gan chẩn đoán mô học.'
    });
  } else if (pattern === 'Mixed') {
    differentials.push({
      disease: 'Tổn thương gan do thuốc thể hỗn hợp (Mixed DILI)',
      likelihood: 'Rất cao',
      clues: 'Chỉ số R từ 2 đến 5. Tác nhân thường gặp: Kháng sinh Fluoroquinolone, TMP-SMZ, Macrolide, Phenytoin, thuốc kháng nấm, thực phẩm chức năng.',
      recommendedNextStep: 'Rà soát kỹ tiền sử dùng thuốc và thực phẩm chức năng, ngừng ngay chất nghi ngờ, tra cứu LiverTox.'
    });
    differentials.push({
      disease: 'Tắc mật cấp tính giai đoạn sớm (Early Acute Choledocholithiasis)',
      likelihood: 'Cao',
      clues: 'Sỏi di chuyển đột ngột làm tăng thoáng qua transaminase do áp lực đường mật trước khi ALP tăng vọt, tạo hình ảnh tổn thương hỗn hợp.',
      recommendedNextStep: 'Siêu âm cấp cứu đường mật, theo dõi động học men gan sau 24-48 giờ.'
    });
    differentials.push({
      disease: 'Hội chứng chồng lấp tự miễn (Autoimmune Overlap Syndrome: AIH-PBC / AIH-PSC)',
      likelihood: 'Trung bình',
      clues: 'Đồng thời có đặc điểm viêm gan hoại tử tế bào gan và tổn thương ứ mật mạn tính.',
      recommendedNextStep: 'Kháng thể tự miễn toàn diện (ANA, ASMA, AMA, p-ANCA), định lượng IgG, IgM và chụp MRCP kết hợp sinh thiết gan.'
    });
  } else if (pattern === 'Isolated Hyperbilirubinemia') {
    if (isUnconjugatedPredominant) {
      if (labs.totalBilirubin < 4.0 && !labs.sampleHemolysis && (!labs.ldh || labs.ldh <= 200)) {
        differentials.push({
          disease: 'Hội chứng Gilbert (Gilbert Syndrome)',
          likelihood: 'Rất cao',
          clues: 'Tăng Bilirubin gián tiếp nhẹ (<3-4 mg/dL), các men ALT, AST, ALP, GGT hoàn toàn bình thường, tăng lên khi nhịn đói hoặc stress/nhiễm trùng nhẹ.',
          recommendedNextStep: 'Không cần làm thêm xét nghiệm xâm lấn nếu không có tán huyết. Tư vấn bệnh nhân đây là biến thể lành tính, không nguy hiểm.'
        });
      }
      differentials.push({
        disease: 'Tán huyết ngoại mạch hoặc nội mạch (Hemolysis)',
        likelihood: (labs.ldh && labs.ldh > 200) || (labs.reticulocytes && labs.reticulocytes > 2) ? 'Rất cao' : 'Cao',
        clues: 'Tăng sản xuất Bilirubin tự do vượt quá khả năng liên hợp của gan, có thể có thiếu máu, lách to, nước tiểu sẫm do Urobilinogen (không có bilirubin niệu).',
        recommendedNextStep: 'Tổng phân tích tế bào máu (Hb giảm), Haptoglobin (giảm), Hồng cầu lưới (tăng), LDH (tăng), nghiệm pháp Coombs trực tiếp/gián tiếp.'
      });
    } else if (isConjugatedPredominant) {
      differentials.push({
        disease: 'Hội chứng Dubin-Johnson / Rotor (Direct Hyperbilirubinemia)',
        likelihood: 'Trung bình',
        clues: 'Rối loạn bài tiết bilirubin liên hợp bẩm sinh hiếm gặp, bilirubin trực tiếp chiếm ~50%, men gan và ALP hoàn toàn bình thường.',
        recommendedNextStep: 'Loại trừ các bệnh lý ứ mật mắc phải trước khi nghĩ tới bất thường di truyền lành tính.'
      });
    }
  }

  // 18. Primary Impression formulation
  let primaryImpression = '';
  if (isAcuteLiverFailureWarning) {
    primaryImpression = 'TỔN THƯƠNG GAN CẤP NẶNG KÈM BỆNH NÃO GAN VÀ RỐI LOẠN ĐÔNG MÁU - NGUY CƠ SUY GAN CẤP (ALF)';
  } else if (isMassiveTransaminitisWarning) {
    primaryImpression = 'TĂNG MEN GAN MỨC ĐỘ KHỔNG LỒ (>10,000 U/L) - NGUY CƠ HOẠI TỬ TẾ BÀO GAN CẤP TÍNH';
  } else if (pattern === 'Hepatocellular') {
    if (deRitisRatio >= 2.0 && maxTransaminase <= 500) {
      primaryImpression = 'TỔN THƯƠNG HOẠI TỬ TẾ BÀO GAN ƯU THẾ AST (DE RITIS > 2) - GỢI Ý BỆNH GAN DO RƯỢU / XƠ GAN';
    } else {
      primaryImpression = `TỔN THƯƠNG HOẠI TỬ TẾ BÀO GAN (HEPATOCELLULAR INJURY, R = ${rRatio}) - MỨC ĐỘ ${severity.toUpperCase()}`;
    }
  } else if (pattern === 'Cholestatic') {
    primaryImpression = `HỘI CHỨNG Ứ MẬT (CHOLESTATIC PATTERN, R = ${rRatio}) - ${labs.ultrasoundBiliaryDilatation === 'dilated' ? 'TẮC MẬT NGOÀI GAN' : 'CẦN PHÂN BIỆT Ứ MẬT TRONG GAN VÀ NGOÀI GAN'}`;
  } else if (pattern === 'Mixed') {
    primaryImpression = `TỔN THƯƠNG GAN DẠNG HỖN HỢP (MIXED HEPATOCELLULAR-CHOLESTATIC, R = ${rRatio})`;
  } else if (pattern === 'Isolated Hyperbilirubinemia') {
    primaryImpression = `TĂNG BILIRUBIN ĐƠN ĐỘC (${isUnconjugatedPredominant ? 'ƯU THẾ GIÁN TIẾP - GỢI Ý GILBERT / TÁN HUYẾT' : 'ƯU THẾ LIÊN HỢP'})`;
  } else {
    primaryImpression = 'SINH HÓA GAN TRONG GIỚI HẠN BÌNH THƯỜNG HOẶC BIẾN THIÊN TỐI THIỂU';
  }

  // 19. Step-by-Step Recommendations
  const stepByStepRecommendations: string[] = [];

  if (isAcuteLiverFailureWarning) {
    stepByStepRecommendations.push('KHẨN CẤP: Chuyển ngay bệnh nhân đến trung tâm có Đơn vị Hồi sức Gan Mật / Ghép gan.');
    stepByStepRecommendations.push('Theo dõi sát tri giác, đường huyết mao mạch, đông máu toàn bộ (PT/INR, Fibrinogen), khí máu động mạch.');
    stepByStepRecommendations.push('Cân nhắc truyền N-Acetylcysteine tĩnh mạch sớm ngay cả khi không rõ tiền sử ngộ độc Paracetamol.');
  } else {
    stepByStepRecommendations.push('Rà soát và ngưng ngay tất cả các thuốc gây độc gan tiềm tàng, kháng sinh không cấp thiết, thực phẩm chức năng và rượu bia.');
    
    if (preAnalyticalAlerts.length > 0) {
      stepByStepRecommendations.push('Cảnh báo tiền phân tích: Lấy lại mẫu máu lúc sáng sớm sau nhịn đói qua đêm, tránh tán huyết và xử lý mẫu trong vòng 8 giờ để loại trừ sai số.');
    }

    if (pattern === 'Hepatocellular') {
      if (maxMultiple >= 5) {
        stepByStepRecommendations.push('Chỉ định bộ xét nghiệm viêm gan virus cấp: HBsAg, IgM anti-HBc, anti-HCV (kèm HCV RNA nếu nghi ngờ cấp), IgM anti-HAV, IgM anti-HEV.');
        stepByStepRecommendations.push('Xét nghiệm tầm soát độc chất (định lượng Paracetamol huyết thanh) và đánh giá tưới máu gan (siêu âm Doppler mạch máu gan).');
        stepByStepRecommendations.push('Xét nghiệm miễn dịch: ANA, ASMA, IgG toàn phần; Ceruloplasmin nếu tuổi < 55.');
      } else {
        stepByStepRecommendations.push('Chỉ định bilan cơ bản: Siêu âm bụng tổng quát (đánh giá cấu trúc gan, độ nhiễm mỡ, lách, tĩnh mạch cửa).');
        stepByStepRecommendations.push('Tầm soát viêm gan B, C mạn tính: HBsAg, anti-HCV.');
        stepByStepRecommendations.push('Đánh giá hội chứng chuyển hóa: Glucose đói, HbA1c, Lipid máu, BMI.');
        stepByStepRecommendations.push('Nếu tăng men kéo dài >3-6 tháng không rõ nguyên nhân: Bổ sung Ferritin, Độ bão hòa Transferrin, Kháng thể tự miễn (ANA, ASMA), Ceruloplasmin, Alpha-1 Antitrypsin, Kháng thể Celiac (anti-tTG IgA), chức năng giáp (TSH).');
      }
    } else if (pattern === 'Cholestatic') {
      stepByStepRecommendations.push('Khẳng định nguồn gốc gan của ALP: Kiểm tra GGT hoặc 5\'-Nucleotidase (nếu GGT bình thường, tìm nguyên nhân từ xương như Paget, loãng xương, cường cận giáp, hoặc tăng PLALP do hút thuốc/thai kỳ).');
      stepByStepRecommendations.push('Siêu âm hạ sườn phải khẩn: Phân biệt dãn đường mật (tắc mật ngoài gan do sỏi/u) hay không dãn đường mật (ứ mật trong gan).');
      if (labs.ultrasoundBiliaryDilatation === 'dilated') {
        stepByStepRecommendations.push('Nếu đường mật dãn: Chỉ định MRCP hoặc hội chẩn can thiệp ERCP lấy sỏi / đặt stent đường mật.');
      } else {
        stepByStepRecommendations.push('Nếu đường mật không dãn: Xét nghiệm kháng thể kháng ty thể (AMA) để chẩn đoán PBC, định lượng IgG4 để loại trừ viêm xơ đường mật liên quan IgG4.');
        stepByStepRecommendations.push('Nếu AMA âm tính và ALP vẫn tăng >2x ULN kéo dài: Chỉ định MRCP đánh giá nhánh mật nhỏ/vừa hoặc sinh thiết gan.');
      }
    } else if (pattern === 'Isolated Hyperbilirubinemia') {
      if (isUnconjugatedPredominant) {
        stepByStepRecommendations.push('Kiểm tra công thức máu, hồng cầu lưới, LDH, Haptoglobin để loại trừ tán huyết.');
        stepByStepRecommendations.push('Nếu không có tán huyết và các men gan bình thường: Hướng tới Hội chứng Gilbert, giải thích cơ chế lành tính và trấn an bệnh nhân.');
      } else {
        stepByStepRecommendations.push('Siêu âm bụng loại trừ tắc mật cơ học giai đoạn sớm.');
        stepByStepRecommendations.push('Đánh giá các bệnh di truyền bài tiết mật hiếm gặp (Dubin-Johnson, Rotor) hoặc ứ mật sau phẫu thuật.');
      }
    }

    if (fib4Score && fib4Score > 2.67) {
      stepByStepRecommendations.push(`Điểm FIB-4 (${fib4Score}) cảnh báo xơ hóa gan tiến triển: Hội chẩn chuyên khoa Tiêu hóa - Gan mật, chỉ định đo độ đàn hồi gan (FibroScan) và tầm soát giãn tĩnh mạch thực quản.`);
    }

    if (labs.afp && labs.afp > 20) {
      stepByStepRecommendations.push(`Chỉ định chẩn đoán hình ảnh chuyên biệt gan (CT 4 pha hoặc MRI cản từ) đánh giá tổn thương khu trú gan do nồng độ AFP tăng (${labs.afp} ng/mL).`);
    }

    if (labs.ca199 && labs.ca199 > 37) {
      stepByStepRecommendations.push(`Theo dõi sát cây đường mật và tụy (MRCP/EUS) do CA 19-9 tăng (${labs.ca199} U/mL).`);
    }
  }

  // 19b. NEJM 2019 DILI & Phenotyping Evaluation
  const diliAnalysis = evaluateDILI(labs, rRatio, pattern, deRitisRatio);

  if (diliAnalysis.isSuspected) {
    // If Hy's law is positive, prepend top emergency alert
    if (diliAnalysis.hysLaw.isPositive) {
      keyFindings.unshift(`🚨 ĐỊNH LUẬT HY (HY'S LAW DƯƠNG TÍNH): ALT/AST ≥ 3x ULN kèm Bilirubin ≥ 2x ULN không có tắc mật (R = ${rRatio}). Nguy cơ tử vong hoặc suy gan cấp cần ghép gan ≥ 10%!`);
      stepByStepRecommendations.unshift('🚨 CẤP CỨU (HY\'S LAW DƯƠNG TÍNH): Đình chỉ ngay lập tức thuốc/thảo dược nghi ngờ. Theo dõi đông máu (PT/INR) và khí máu động mạch mỗi 12-24h; sẵn sàng hội chẩn trung tâm ghép gan.');
      differentials.unshift({
        disease: `Tổn thương gan do thuốc (DILI) thể ${diliAnalysis.phenotypeVi} - Thỏa Định Luật Hy (NEJM 2019)`,
        likelihood: 'Rất cao',
        clues: `Thuốc nghi ngờ: ${diliAnalysis.implicatedAgent || 'Đang rà soát'}. Tiêu chuẩn Hy's Law dương tính với ALT ${labs.alt} U/L (${altMultiples}x ULN) + Bilirubin ${labs.totalBilirubin} mg/dL (R = ${rRatio}). ${diliAnalysis.clinicalClues.join(' ')}`,
        recommendedNextStep: 'Ngừng ngay thuốc nghi ngờ. Tránh thử lại thuốc (rechallenge). Theo dõi Dechallenge (men gan giảm >50% sau 30 ngày).'
      });
    } else {
      differentials.unshift({
        disease: `Tổn thương gan do thuốc/thảo dược (DILI) - Cơ chế: ${diliAnalysis.mechanism} [NEJM 2019]`,
        likelihood: 'Cao',
        clues: `Kiểu hình: ${diliAnalysis.phenotypeVi}. Thuốc/chất liên quan: ${diliAnalysis.implicatedAgent || 'Tiền sử dùng thuốc'}. ${diliAnalysis.latencyAssessment || ''} ${diliAnalysis.clinicalClues.join(' ')}`,
        recommendedNextStep: diliAnalysis.recommendedActions[0] || 'Ngừng thuốc nghi ngờ và đánh giá đáp ứng Dechallenge.'
      });
      diliAnalysis.recommendedActions.forEach(action => {
        if (!stepByStepRecommendations.includes(action)) {
          stepByStepRecommendations.push(action);
        }
      });
    }
  }

  // 20. Updated Literature References
  const guidelineReferences = [
    'Hoofnagle JH, Björnsson ES. Drug-Induced Liver Injury — Types and Phenotypes. N Engl J Med 2019; 381(3):264-273',
    'Altaihani MR, Alhazmi BF, Albagawi MG, et al. Liver Function Tests: An Updated Review Article for Clinical Pathologists. Rev Contemp Philos 2024; 23(2):1681-1691',
    'Botros M, Sikaris KA. The De Ritis Ratio: The Test of Time. Clin Biochem Rev 2013; 34(3):117-130',
    'Kwo PY, Cohen SM, Lim JK. ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries. Am J Gastroenterol 2017; 112(1):18-35',
    'WHO Training Workshop: Screening, Diagnosis and Treatment of Hepatitis B and C (Session 4: Interpretation of liver function tests)'
  ];

  return {
    pattern,
    rRatio,
    deRitisRatio,
    deRitisDetail,
    altMultiples,
    astMultiples,
    alpMultiples,
    severity,
    conjugatedPercent,
    isConjugatedPredominant,
    isUnconjugatedPredominant,
    syntheticImpairment,
    isAcuteLiverFailureWarning,
    isMassiveTransaminitisWarning,
    fib4Score,
    fib4Stage,
    apriScore,
    apriStage,
    meldScore,
    primaryImpression,
    keyFindings,
    differentialDiagnoses: differentials,
    stepByStepRecommendations,
    guidelineReferences,
    preAnalyticalAlerts,
    secondaryBiomarkerAlerts,
    autoimmuneAlerts,
    qualityControlGuidance,
    diliAnalysis
  };
}

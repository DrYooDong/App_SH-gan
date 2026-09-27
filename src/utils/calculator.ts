import { PatientLabs, CDSSAnalysis, InjuryPattern, ElevationSeverity } from '../types/cdss';

export function calculateAnalysis(labs: PatientLabs): CDSSAnalysis {
  const altUln = labs.altUln || (labs.gender === 'male' ? 33 : 25);
  const astUln = labs.astUln || (labs.gender === 'male' ? 33 : 25);
  const alpUln = labs.alpUln || 120;

  const altMultiples = Number((labs.alt / altUln).toFixed(2));
  const astMultiples = Number((labs.ast / astUln).toFixed(2));
  const alpMultiples = Number((labs.alp / alpUln).toFixed(2));

  // R ratio calculation: (ALT / ULN) / (ALP / ULN)
  const rRatio = alpMultiples > 0 ? Number((altMultiples / alpMultiples).toFixed(2)) : 0;

  // De Ritis ratio: AST / ALT
  const deRitisRatio = labs.alt > 0 ? Number((labs.ast / labs.alt).toFixed(2)) : 0;

  // Bilirubin fractionation
  const conjugatedPercent = labs.totalBilirubin > 0 
    ? Number(((labs.directBilirubin / labs.totalBilirubin) * 100).toFixed(1)) 
    : 0;
  const isConjugatedPredominant = conjugatedPercent >= 50;
  const isUnconjugatedPredominant = conjugatedPercent < 20 && labs.totalBilirubin > 1.2;

  // Severity evaluation (based on max transaminase)
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

  // Determine Pattern of Injury
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

  // Synthetic function & Alerts
  const syntheticImpairment = (labs.albumin !== undefined && labs.albumin < 3.5) || 
                              (labs.inr !== undefined && labs.inr >= 1.5);
  
  const isAcuteLiverFailureWarning = Boolean(
    (labs.alt > 200 || labs.ast > 200) &&
    (labs.inr !== undefined && labs.inr >= 1.5) &&
    labs.hasEncephalopathy
  );

  const isMassiveTransaminitisWarning = maxTransaminase > 10000;

  // FIB-4 calculation
  let fib4Score: number | undefined;
  let fib4Stage: string | undefined;
  if (labs.age && labs.platelets && labs.platelets > 0 && labs.alt > 0) {
    fib4Score = Number(((labs.age * labs.ast) / (labs.platelets * Math.sqrt(labs.alt))).toFixed(2));
    const lowCutoff = labs.age > 65 ? 2.0 : 1.30;
    if (fib4Score < lowCutoff) {
      fib4Stage = `F0 - F1 (Nguy cơ xơ hóa tiến triển thấp, NPV ~90%)`;
    } else if (fib4Score >= lowCutoff && fib4Score <= 2.67) {
      fib4Stage = `Vùng xám không xác định (Khuyến cáo đo độ đàn hồi mô gan - VCTE/FibroScan)`;
    } else {
      fib4Stage = `F3 - F4 (Nguy cơ xơ hóa tiến triển / xơ gan cao, PPV >65-80%)`;
    }
  }

  // APRI calculation
  let apriScore: number | undefined;
  let apriStage: string | undefined;
  if (labs.platelets && labs.platelets > 0 && astUln > 0) {
    apriScore = Number((((labs.ast / astUln) * 100) / labs.platelets).toFixed(2));
    if (apriScore < 0.5) {
      apriStage = 'F0 - F1 (Ít khả năng xơ hóa đáng kể)';
    } else if (apriScore >= 0.5 && apriScore <= 1.5) {
      apriStage = 'F2 - F3 (Nghi ngờ xơ hóa có ý nghĩa lâm sàng)';
    } else {
      apriStage = 'F4 (Khả năng xơ gan cao, chuyên biệt >90%)';
    }
  }

  // MELD calculation (if bilirubin, inr, creatinine provided)
  let meldScore: number | undefined;
  if (labs.totalBilirubin > 0 && labs.inr && labs.inr > 0 && labs.creatinine && labs.creatinine > 0) {
    const bil = Math.max(1.0, labs.totalBilirubin);
    const inr = Math.max(1.0, labs.inr);
    const cr = Math.min(4.0, Math.max(1.0, labs.creatinine));
    const rawMeld = 3.78 * Math.log(bil) + 11.2 * Math.log(inr) + 9.57 * Math.log(cr) + 6.43;
    meldScore = Math.round(Math.min(40, Math.max(6, rawMeld)));
  }

  // Generate Key Findings
  const keyFindings: string[] = [];
  keyFindings.push(`Kiểu tổn thương: ${pattern} (Chỉ số R = ${rRatio})`);
  keyFindings.push(`Mức độ tăng men gan: ${severity} (ALT ${altMultiples}x ULN, AST ${astMultiples}x ULN)`);
  keyFindings.push(`Tỷ số De Ritis (AST/ALT): ${deRitisRatio}`);

  if (labs.totalBilirubin > 1.2) {
    keyFindings.push(`Tăng Bilirubin: Toàn phần ${labs.totalBilirubin} mg/dL, Trực tiếp ${labs.directBilirubin} mg/dL (${conjugatedPercent}% liên hợp - ${isConjugatedPredominant ? 'Ưu thế liên hợp' : isUnconjugatedPredominant ? 'Ưu thế gián tiếp/tự do' : 'Thể hỗn hợp'})`);
  } else {
    keyFindings.push(`Bilirubin toàn phần trong giới hạn bình thường (${labs.totalBilirubin} mg/dL)`);
  }

  if (syntheticImpairment) {
    keyFindings.push(`Suy giảm chức năng tổng hợp của gan: ${labs.albumin && labs.albumin < 3.5 ? `Albumin máu giảm (${labs.albumin} g/dL, t½ ~21 ngày phản ánh tổn thương mạn tính)` : ''} ${labs.inr && labs.inr >= 1.5 ? `INR kéo dài (${labs.inr}, phản ánh thiếu hụt yếu tố đông máu cấp/nặng)` : ''}`);
  }

  if (isAcuteLiverFailureWarning) {
    keyFindings.push(`CẢNH BÁO NGUY CƠ SUY GAN CẤP (ALF): Tổn thương tế bào gan + Rối loạn đông máu (INR ≥ 1.5) + Bệnh não gan!`);
  }

  if (isMassiveTransaminitisWarning) {
    keyFindings.push(`TĂNG TRANSAMINASE MỨC ĐỘ KHỔNG LỒ (>10,000 U/L): Gợi ý ngộ độc Paracetamol, viêm gan thiếu máu cục bộ (Shock Liver), hoặc ngộ độc nấm độc.`);
  }

  if (labs.ck && labs.ck > 1000 && labs.ast > labs.alt) {
    keyFindings.push(`Creatine Kinase (CK) tăng rất cao (${labs.ck} U/L) đi kèm AST >> ALT: Cần đánh giá tiêu cơ vân (Rhabdomyolysis) trước khi kết luận tổn thương gan nguyên phát.`);
  }

  // Differential Diagnoses Engine
  const differentials: CDSSAnalysis['differentialDiagnoses'] = [];

  if (isMassiveTransaminitisWarning || maxMultiple > 15) {
    differentials.push({
      disease: 'Tổn thương gan do Acetaminophen (Ngộ độc Paracetamol)',
      likelihood: 'Rất cao',
      clues: 'ALT/AST tăng vọt cực nhanh (>15x đến >10,000 U/L), giảm nhanh sau ngừng độc chất, toan chuyển hóa, tăng lactate.',
      recommendedNextStep: 'Định lượng nồng độ Paracetamol huyết thanh khẩn, khí máu động mạch, chỉ định ngay N-Acetylcysteine (NAC) theo phác đồ Rumack-Matthew.'
    });
    differentials.push({
      disease: 'Viêm gan thiếu máu cục bộ (Ischemic Hepatitis / Shock Liver)',
      likelihood: 'Rất cao',
      clues: 'AST thường tăng vọt trước và cao hơn ALT, LDH tăng rất cao, tiền sử tụt huyết áp, sốc tim, suy hô hấp nặng hoặc hồi sức cấp cứu.',
      recommendedNextStep: 'Hồi phục huyết động học, siêu âm Doppler mạch máu gan (loại trừ huyết khối tĩnh mạch gan Budd-Chiari), theo dõi chức năng thận (nguy cơ hoại tử ống thận cấp đi kèm).'
    });
    differentials.push({
      disease: 'Viêm gan virus cấp (Acute Viral Hepatitis A, B, C, D, E)',
      likelihood: 'Cao',
      clues: 'ALT > AST (De Ritis < 1.0 trong giai đoạn cấp), vàng da xuất hiện trễ hơn men gan, sốt, mệt mỏi, chán ăn.',
      recommendedNextStep: 'Làm IgM anti-HAV, HBsAg, IgM anti-HBc, anti-HCV + HCV RNA, IgM anti-HEV (nếu có yếu tố dịch tễ vùng lưu hành).'
    });
  } else if (pattern === 'Hepatocellular') {
    if (deRitisRatio >= 2.0 && maxTransaminase <= 500) {
      differentials.push({
        disease: 'Bệnh gan do rượu (Alcoholic Liver Disease / Alcoholic Hepatitis)',
        likelihood: 'Rất cao',
        clues: `AST:ALT > 2:1 (do thiếu hụt Pyridoxine B6 ức chế tổng hợp ALT + tổn thương màng ty thể giải phóng mAST), AST hiếm khi vượt quá 400 U/L. GGT thường tăng kèm.`,
        recommendedNextStep: 'Khai thác lượng rượu tiêu thụ (>210g/tuần ở nam, >140g/tuần ở nữ), định lượng PEth nếu cần khách quan hóa, tính chỉ số Maddrey DF nếu vàng da nặng.'
      });
    }

    differentials.push({
      disease: 'Viêm gan virus mạn tính bùng phát (Chronic HBV/HCV Flare)',
      likelihood: 'Cao',
      clues: 'ALT ưu thế (De Ritis < 1.0), tăng từ 2x đến 10x ULN, có thể không triệu chứng hoặc mệt mỏi nhẹ.',
      recommendedNextStep: 'HBsAg, HBeAg, tải lượng HBV DNA định lượng, Anti-HCV, HCV RNA PCR.'
    });

    differentials.push({
      disease: 'Bệnh gan nhiễm mỡ chuyển hóa (MASLD / MASH)',
      likelihood: 'Cao',
      clues: `Men gan tăng nhẹ đến vừa (<5x ULN), ALT thường > AST (trừ khi có xơ gan tiến triển), liên quan hội chứng chuyển hóa, thừa cân/béo phì (BMI ${labs.bmi || 'chưa ghi nhận'}), đái tháo đường.`,
      recommendedNextStep: 'Siêu âm gan tìm hình ảnh tăng âm ("bright liver"), đo độ đàn hồi thoáng qua (FibroScan) đánh giá độ nhiễm mỡ CAP và xơ hóa mô gan.'
    });

    differentials.push({
      disease: 'Tổn thương gan do thuốc / thảo dược (DILI / HDS)',
      likelihood: 'Cần loại trừ',
      clues: 'Khởi phát trong vòng vài ngày đến vài tuần sau khi dùng thuốc mới (kháng sinh, thuốc kháng lao, statin, thuốc chống co giật, thực phẩm chức năng giảm cân).',
      recommendedNextStep: 'Rà soát danh mục thuốc kê đơn và OTC, ngưng ngay chất nghi ngờ, tra cứu cơ sở dữ liệu LiverTox.nih.gov.'
    });

    if (labs.age && labs.age < 55) {
      differentials.push({
        disease: 'Bệnh Wilson (Wilson Disease)',
        likelihood: 'Cần loại trừ',
        clues: 'AST > ALT, ALP thường thấp bất thường (ALP/Bilirubin < 4), tán huyết Coombs âm tính, triệu chứng thần kinh/tâm thần.',
        recommendedNextStep: 'Định lượng Ceruloplasmin huyết thanh, đồng niệu 24h, khám mắt đèn khe tìm vòng Kayser-Fleischer.'
      });
    }

    differentials.push({
      disease: 'Bệnh ứ sắt mô di truyền (Hereditary Hemochromatosis)',
      likelihood: 'Cần loại trừ',
      clues: 'Men gan tăng mạn tính nhẹ, có thể kèm sạm da, đái tháo đường, đau khớp, bệnh cơ tim.',
      recommendedNextStep: 'Bộ xét nghiệm sắt: Độ bão hòa Transferrin (nếu ≥45%) và Ferritin huyết thanh; xét nghiệm đột biến gen HFE (C282Y, H63D).'
    });

    differentials.push({
      disease: 'Viêm gan tự miễn (Autoimmune Hepatitis - AIH)',
      likelihood: 'Cần loại trừ',
      clues: 'Thường gặp ở phụ nữ (tỷ lệ 4:1), tăng gamma-globulin/IgG huyết thanh, có thể có các bệnh tự miễn đi kèm.',
      recommendedNextStep: 'Kháng thể tự miễn: ANA, ASMA (Anti-Smooth Muscle), Anti-LKM1, định lượng IgG.'
    });
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
        clues: 'ALP tăng ưu thế, phân bạc màu, nước tiểu sẫm màu, ngứa.',
        recommendedNextStep: 'Siêu âm ổ bụng kiểm tra giãn đường mật. Nếu siêu âm âm tính nhưng lâm sàng nghi ngờ cao, chỉ định MRCP hoặc EUS.'
      });
    }

    differentials.push({
      disease: 'Viêm đường mật tiên phát (Primary Biliary Cholangitis - PBC)',
      likelihood: 'Cao',
      clues: 'Thường gặp ở phụ nữ trung niên, mệt mỏi mạn tính, ngứa, ALP và GGT tăng kéo dài, đường mật không dãn trên siêu âm.',
      recommendedNextStep: 'Định lượng kháng thể kháng ty thể (AMA - Anti-mitochondrial antibody, dương tính >95% ở PBC), IgM huyết thanh.'
    });

    differentials.push({
      disease: 'Viêm xơ đường mật tiên phát (Primary Sclerosing Cholangitis - PSC)',
      likelihood: 'Trung bình',
      clues: 'Nam giới, có tiền sử viêm loét đại tràng (IBD), hình ảnh hẹp dãn xen kẽ hình chuỗi hạt trên cây đường mật.',
      recommendedNextStep: 'Chụp MRCP đánh giá hình thái cây mật, định lượng IgG4 (loại trừ bệnh xơ hóa liên quan IgG4).'
    });

    differentials.push({
      disease: 'Ứ mật do thuốc (Drug-Induced Cholestasis)',
      likelihood: 'Cao',
      clues: 'Hay gặp do Amoxicillin-Clavulanate, steroid đồng hóa, thuốc tránh thai uống, Cefazolin, Azithromycin.',
      recommendedNextStep: 'Rà soát tiền sử dùng thuốc trong vòng 1-6 tháng gần đây, ngừng thuốc và theo dõi ALP/GGT hạ dần.'
    });

    differentials.push({
      disease: 'Bệnh thâm nhiễm gan (Infiltrative Liver Disease)',
      likelihood: 'Trung bình',
      clues: 'ALP tăng rất cao đơn độc trong khi Bilirubin có thể bình thường hoặc tăng nhẹ: Sarcoidosis, lao gan, ung thư biểu mô gan hoặc di căn gan.',
      recommendedNextStep: 'CT ngực bụng cản quang, MRI gan, dấu ấn sinh học ung thư (AFP, CA 19-9), cân nhắc sinh thiết gan.'
    });
  } else if (pattern === 'Mixed') {
    differentials.push({
      disease: 'Tổn thương gan do thuốc thể hỗn hợp (Mixed DILI)',
      likelihood: 'Rất cao',
      clues: 'Chỉ số R từ 2 đến 5. Tác nhân thường gặp: Fluoroquinolone, TMP-SMZ, Macrolide, Phenytoin, thảo dược.',
      recommendedNextStep: 'Rà soát kỹ tiền sử dùng thuốc và thực phẩm chức năng, ngừng chất gây nghi ngờ.'
    });
    differentials.push({
      disease: 'Tắc mật cấp tính giai đoạn sớm (Early Acute Choledocholithiasis)',
      likelihood: 'Cao',
      clues: 'Sỏi di chuyển có thể làm transaminase phóng thích đột ngột trước khi ALP tăng vọt, tạo hình ảnh tổn thương hỗn hợp thoáng qua.',
      recommendedNextStep: 'Siêu âm cấp cứu đường mật, theo dõi động học men gan sau 24-48 giờ.'
    });
    differentials.push({
      disease: 'Hội chứng chồng lấp tự miễn (Autoimmune Overlap Syndrome: AIH-PBC / AIH-PSC)',
      likelihood: 'Trung bình',
      clues: 'Đồng thời có đặc điểm viêm gan hoại tử tế bào gan và tổn thương đường mật mạn tính.',
      recommendedNextStep: 'Đo kháng thể ANA, ASMA, AMA, IgG, IgM và chụp MRCP kết hợp sinh thiết gan chuyên khoa.'
    });
  } else if (pattern === 'Isolated Hyperbilirubinemia') {
    if (isUnconjugatedPredominant) {
      if (labs.totalBilirubin < 4.0) {
        differentials.push({
          disease: 'Hội chứng Gilbert (Gilbert Syndrome)',
          likelihood: 'Rất cao',
          clues: 'Tăng Bilirubin gián tiếp nhẹ (<3-4 mg/dL), các men ALT, AST, ALP, GGT hoàn toàn bình thường, tăng lên khi nhịn đói hoặc stress/nhiễm trùng nhẹ.',
          recommendedNextStep: 'Không cần làm thêm xét nghiệm xâm lấn nếu không có tán huyết. Tư vấn bệnh nhân đây là biến thể lành tính, không nguy hiểm.'
        });
      }
      differentials.push({
        disease: 'Tán huyết ngoại mạch hoặc nội mạch (Hemolysis)',
        likelihood: 'Cao',
        clues: 'Tăng sản xuất Bilirubin tự do vượt quá khả năng liên hợp của tế bào gan, có thể có thiếu máu, lách to.',
        recommendedNextStep: 'Tổng phân tích tế bào máu (Hb giảm), Haptoglobin (giảm), Reticulocyte count (tăng), LDH (tăng), nghiệm pháp Coombs.'
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

  // Primary Impression summary
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

  // Step-by-Step Recommendations according to ACG & WHO
  const stepByStepRecommendations: string[] = [];

  if (isAcuteLiverFailureWarning) {
    stepByStepRecommendations.push('KHẨN CẤP: Chuyển ngay bệnh nhân đến trung tâm có Đơn vị Hồi sức Gan Mật / Ghép gan.');
    stepByStepRecommendations.push('Theo dõi sát tri giác, đường huyết mao mạch, đông máu toàn bộ (PT/INR, Fibrinogen), khí máu động mạch.');
    stepByStepRecommendations.push('Cân nhắc truyền N-Acetylcysteine tĩnh mạch sớm ngay cả khi không rõ tiền sử ngộ độc Paracetamol.');
  } else {
    stepByStepRecommendations.push('Rà soát và ngưng ngay tất cả các thuốc gây độc gan tiềm tàng, kháng sinh không cấp thiết, thực phẩm chức năng và rượu bia.');
    
    if (pattern === 'Hepatocellular') {
      if (maxMultiple >= 5) {
        stepByStepRecommendations.push('Chỉ định bộ xét nghiệm viêm gan virus cấp: HBsAg, IgM anti-HBc, anti-HCV (kèm HCV RNA nếu nghi ngờ cấp), IgM anti-HAV.');
        stepByStepRecommendations.push('Xét nghiệm tầm soát độc chất (định lượng Paracetamol huyết thanh) và đánh giá tưới máu gan (siêu âm Doppler mạch máu gan).');
        stepByStepRecommendations.push('Xét nghiệm miễn dịch: ANA, ASMA, IgG toàn phần; Ceruloplasmin nếu tuổi < 55.');
      } else {
        stepByStepRecommendations.push('Chỉ định bilan cơ bản: Siêu âm bụng tổng quát (đánh giá cấu trúc gan, độ nhiễm mỡ, lách, tĩnh mạch cửa).');
        stepByStepRecommendations.push('Tầm soát viêm gan B, C mạn tính: HBsAg, anti-HCV.');
        stepByStepRecommendations.push('Đánh giá hội chứng chuyển hóa: Glucose đói, HbA1c, Lipid máu, BMI.');
        stepByStepRecommendations.push('Nếu tăng men kéo dài >3-6 tháng không rõ nguyên nhân: Bổ sung Ferritin, Độ bão hòa Transferrin, Kháng thể tự miễn (ANA, ASMA), Ceruloplasmin, Alpha-1 Antitrypsin, Kháng thể Celiac (anti-tTG IgA).');
      }
    } else if (pattern === 'Cholestatic') {
      stepByStepRecommendations.push('Khẳng định nguồn gốc gan của ALP: Kiểm tra GGT hoặc 5\'-Nucleotidase (nếu GGT bình thường, tìm nguyên nhân từ xương như Paget, loãng xương, cường cận giáp).');
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
  }

  const guidelineReferences = [
    'ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries (Am J Gastroenterol 2017; 112:18-35)',
    'WHO Training Workshop: Interpretation of Liver Function Tests (Session 4: Hepatic Architecture & Diagnostic Pathways)',
    'The De Ritis Ratio: The Test of Time (Clin Biochem Rev 2013; 34:117-130)',
    'AASLD Practice Guidance on Abnormal Liver Biochemical Test Results (Gastroenterology 2026; 170:1457-1472)'
  ];

  return {
    pattern,
    rRatio,
    deRitisRatio,
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
    guidelineReferences
  };
}

import { jsPDF } from 'jspdf';
import { PatientLabs, CDSSAnalysis } from '../types/cdss';
import { HospitalHeaderConfig } from '../types/settings';

function removeVietnameseTones(str: string): string {
  // Converts accented characters to safe ASCII for standard jsPDF text rendering if custom TTF is not loaded
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
}

export function generateConsultationPDF(labs: PatientLabs, analysis: CDSSAnalysis, headerConfig?: HospitalHeaderConfig): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  // Hospital / Clinic Header if configured
  if (headerConfig?.hospitalName) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(removeVietnameseTones(headerConfig.hospitalName.toUpperCase()), margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const subHeader = `${headerConfig.department || ''} | ${headerConfig.doctorName || ''} (${headerConfig.licenseNumber || ''})`;
    doc.text(removeVietnameseTones(subHeader), margin, y);
    y += 6;
  }

  // Header Banner
  doc.setFillColor(15, 76, 129); // Medical Deep Slate Blue
  doc.rect(margin, y, contentWidth, 16, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('HEPACDSS - CLINICAL DECISION SUPPORT REPORT', margin + 4, y + 6.5);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('PHIEU HOI CHAN & PHAN TICH SINH HOA GAN THEO ACG 2017 & WHO', margin + 4, y + 12);

  y += 21;

  // Patient & Analysis Info Box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  const currentDate = new Date().toLocaleString('vi-VN');
  doc.text(`Ngay phan tich: ${currentDate}`, margin + 4, y + 6);
  doc.text(`Gioi tinh: ${labs.gender === 'male' ? 'Nam' : 'Nu'}`, margin + 100, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.text(`Tuoi: ${labs.age || 'Chua ro'} | BMI: ${labs.bmi || 'Chua ghi nhan'} kg/m2`, margin + 4, y + 12);
  doc.text(`Tieu thu con: ${labs.alcoholIntake ? `${labs.alcoholIntake} g/tuan` : 'Khong'}`, margin + 100, y + 12);
  doc.text(`Tieu chuan huong dan: ACG 2017 & WHO LFTs Guidelines (ULN ALT: ${labs.altUln} U/L, AST: ${labs.astUln} U/L, ALP: ${labs.alpUln} U/L)`, margin + 4, y + 18);

  y += 27;

  // Laboratory Parameters Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 76, 129);
  doc.text('1. KET QUA SINH HOA GAN & CHI SO HUYET THANH', margin, y);
  y += 5;

  // Table header
  doc.setFillColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('Xet nghiem', margin + 4, y + 4.5);
  doc.text('Ket qua', margin + 60, y + 4.5);
  doc.text('Khoang tham chieu / ULN', margin + 95, y + 4.5);
  doc.text('Boi so / Danh gia', margin + 145, y + 4.5);

  y += 6;

  const labRows = [
    { name: 'ALT (Alanine Aminotransferase)', val: `${labs.alt} U/L`, ref: `ULN: ${labs.altUln} U/L`, interp: `${analysis.altMultiples}x ULN` },
    { name: 'AST (Aspartate Aminotransferase)', val: `${labs.ast} U/L`, ref: `ULN: ${labs.astUln} U/L`, interp: `${analysis.astMultiples}x ULN` },
    { name: 'ALP (Alkaline Phosphatase)', val: `${labs.alp} U/L`, ref: `ULN: ${labs.alpUln} U/L`, interp: `${analysis.alpMultiples}x ULN` },
    { name: 'GGT (Gamma-GT)', val: labs.ggt ? `${labs.ggt} U/L` : 'Chua lam', ref: 'ULN: ~35-50 U/L', interp: labs.ggt ? (labs.ggt > (labs.ggtUln || 50) ? 'Tang cao' : 'Binh thuong') : '-' },
    { name: 'Total Bilirubin', val: `${labs.totalBilirubin} mg/dL`, ref: '< 1.2 mg/dL', interp: labs.totalBilirubin > 1.2 ? 'Tang' : 'Binh thuong' },
    { name: 'Direct Bilirubin (Lien hop)', val: `${labs.directBilirubin} mg/dL`, ref: '< 0.3 mg/dL', interp: `${analysis.conjugatedPercent}% tong luong` },
    { name: 'Albumin Mau', val: labs.albumin ? `${labs.albumin} g/dL` : 'Chua lam', ref: '3.5 - 5.0 g/dL', interp: labs.albumin ? (labs.albumin < 3.5 ? 'Giam (t1/2 ~21d)' : 'Binh thuong') : '-' },
    { name: 'PT / INR', val: labs.inr ? `INR ${labs.inr}` : (labs.prothrombinTimeSeconds ? `${labs.prothrombinTimeSeconds}s` : 'Chua lam'), ref: 'INR 0.85-1.15 (10.9-12.5s)', interp: labs.inr ? (labs.inr >= 1.5 ? 'Keo dai - Canh bao ALF' : 'Binh thuong') : '-' },
    { name: 'So luong Tieu cau', val: labs.platelets ? `${labs.platelets} x10^9/L` : 'Chua lam', ref: '150 - 450 x10^9/L', interp: labs.platelets ? (labs.platelets < 150 ? 'Giam tieu cau' : 'Binh thuong') : '-' },
    ...(labs.afp !== undefined ? [{ name: 'AFP (Alpha-fetoprotein)', val: `${labs.afp} ng/mL`, ref: '< 20 ng/mL', interp: labs.afp > 400 ? 'Tang rat cao - HCC' : (labs.afp > 20 ? 'Tang vua / Tai tao' : 'Binh thuong') }] : []),
    ...(labs.ca199 !== undefined ? [{ name: 'CA 19-9 (U/mL)', val: `${labs.ca199} U/mL`, ref: '< 37 U/mL', interp: labs.ca199 > 37 ? 'Tang cao - Nghi ngo PSC/U mat' : 'Binh thuong' }] : []),
    ...(labs.ferritin !== undefined ? [{ name: 'Ferritin (ng/mL)', val: `${labs.ferritin} ng/mL`, ref: '30 - 400 ng/mL', interp: labs.ferritin > 1000 ? 'Tang rat cao - U sat HFE' : (labs.ferritin > 400 ? 'Tang' : 'Binh thuong') }] : []),
    ...(labs.ceruloplasmin !== undefined ? [{ name: 'Ceruloplasmin (mg/dL)', val: `${labs.ceruloplasmin} mg/dL`, ref: '20 - 40 mg/dL', interp: labs.ceruloplasmin < 20 ? 'Giam - T/S Wilson' : 'Binh thuong' }] : [])
  ];

  doc.setFont('helvetica', 'normal');
  labRows.forEach((row, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.2, 'F');
    }
    doc.text(removeVietnameseTones(row.name), margin + 4, y + 3.8);
    doc.text(row.val, margin + 65, y + 3.8);
    doc.text(row.ref, margin + 105, y + 3.8);
    doc.text(removeVietnameseTones(row.interp), margin + 148, y + 3.8);
    y += 5.2;
  });

  y += 3;

  // CDSS Core Metrics Summary Box
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 27, 75);
  doc.text('2. PHAN TICH CDSS & DONG HOC DE RITIS (SIKARIS 2013 & ALTAIHANI 2024)', margin + 4, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`- Kieu ton thuong gan: ${analysis.pattern.toUpperCase()}`, margin + 4, y + 9.5);
  doc.text(`- Chi so R (R-ratio): ${analysis.rRatio} (${analysis.rRatio > 5 ? 'Tebao gan >5' : analysis.rRatio < 2 ? 'U mat <2' : 'Hon hop 2-5'})`, margin + 98, y + 9.5);
  
  const deRitisDesc = `AST/ALT = ${analysis.deRitisRatio} [${analysis.deRitisDetail.category} - ${analysis.deRitisDetail.decisionLimitText}]`;
  doc.text(`- De Ritis Matrix: ${removeVietnameseTones(deRitisDesc)}`, margin + 4, y + 14.5);
  doc.text(`- Muc do tang men: ${removeVietnameseTones(analysis.severity)}`, margin + 98, y + 14.5);
  
  if (analysis.fib4Score) {
    doc.text(`- Diem FIB-4: ${analysis.fib4Score} -> ${removeVietnameseTones(analysis.fib4Stage || '')}`, margin + 4, y + 19.5);
  } else {
    doc.text(`- Phan do Bilirubin: ${analysis.conjugatedPercent}% lien hop (${analysis.isConjugatedPredominant ? 'Uu the truc tiep' : analysis.isUnconjugatedPredominant ? 'Uu the gian tiep' : 'Hon hop'})`, margin + 4, y + 19.5);
  }

  y += 27;

  // Pre-analytical Warning Banner in PDF if any
  // Pre-analytical Warning Banner
  if (analysis.preAnalyticalAlerts.length > 0) {
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(margin, y, contentWidth, 10, 1.5, 1.5, 'F');
    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('CANH BAO TIEN PHAN TICH & YEU TO GAY NHIEU MAU THU (Altaihani et al. 2024):', margin + 3, y + 4);
    doc.setFont('helvetica', 'normal');
    const firstAlert = removeVietnameseTones(analysis.preAnalyticalAlerts[0]);
    doc.text(doc.splitTextToSize(firstAlert, contentWidth - 6)[0], margin + 3, y + 7.5);
    y += 12;
  }

  // NEJM 2019 Hy's Law Alert
  if (analysis.diliAnalysis?.hysLaw.isPositive) {
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(margin, y, contentWidth, 11, 2, 2, 'F');
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('BAO DONG DO: THOA TIEU CHUAN DINH LUAT HY (HY\'S LAW - NEJM 2019)!', margin + 4, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Nguy co tu vong / suy gan cap >= 10%. Dinh chi ngay thuoc nghi ngo va hoi chan chuyen khoa!', margin + 4, y + 8.5);
    y += 13;
  } else if (analysis.diliAnalysis?.isSuspected) {
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(margin, y, contentWidth, 9, 1.5, 1.5, 'F');
    doc.setTextColor(159, 18, 57);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    const diliTitle = `DILI (NEJM 2019): [Co che: ${analysis.diliAnalysis.mechanism}] - Kieu hinh: ${removeVietnameseTones(analysis.diliAnalysis.phenotypeVi)}`;
    doc.text(diliTitle, margin + 3, y + 4);
    doc.setFont('helvetica', 'normal');
    const drugNote = `Tac nhan: ${removeVietnameseTones(analysis.diliAnalysis.implicatedAgent || 'Thuoc/thao duoc')} | U benh: ${analysis.diliAnalysis.latencyDays || 'Chua ro'} ngay`;
    doc.text(drugNote, margin + 3, y + 7);
    y += 11;
  }

  // Alerts if present
  if (analysis.isAcuteLiverFailureWarning || analysis.isMassiveTransaminitisWarning) {
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(margin, y, contentWidth, 11, 2, 2, 'F');
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    if (analysis.isAcuteLiverFailureWarning) {
      doc.text('CANH BAO NGUY CO SUY GAN CAP (ACUTE LIVER FAILURE - ALF)!', margin + 4, y + 4.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Benh nhan co ton thuong te bao gan + INR >= 1.5 + roi loan tri giac. Chuyen gap don vi hoi suc ghep gan!', margin + 4, y + 8.5);
    } else {
      doc.text('CANH BAO TRANSAMINASE KHONG LO (>10,000 U/L)!', margin + 4, y + 4.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Goi y ngo doc Acetaminophen, soc gan do thieu mau cuc bo hoac doc chat nam.', margin + 4, y + 8.5);
    }
    y += 13;
  }

  // Differential Diagnoses
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 76, 129);
  doc.text('3. CHAN DOAN PHAN BIET XEP THEO XAC SUAT', margin, y);
  y += 4.5;

  analysis.differentialDiagnoses.slice(0, 3).forEach((d) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`* [${d.likelihood.toUpperCase()}] ${removeVietnameseTones(d.disease)}`, margin + 2, y);
    y += 3.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`  Dau hieu: ${removeVietnameseTones(d.clues)}`, margin + 2, y);
    y += 3.5;
    doc.text(`  De xuat: ${removeVietnameseTones(d.recommendedNextStep)}`, margin + 2, y);
    y += 4.5;
  });

  y += 2;

  // Next Step Recommendations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 76, 129);
  doc.text('4. KHUYEN CAO XET NGHIEM TIEP THEO (THEO ACG, WHO & SIKARIS)', margin, y);
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  analysis.stepByStepRecommendations.slice(0, 4).forEach((rec) => {
    const safeRec = removeVietnameseTones(rec);
    const splitLines = doc.splitTextToSize(`- ${safeRec}`, contentWidth - 4);
    doc.text(splitLines, margin + 2, y);
    y += splitLines.length * 3.6;
  });

  // Doctor Signature & Stamp Area
  if (headerConfig?.showDoctorSignature) {
    y = Math.max(y + 4, 258);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('Xac nhan cua Bac si dieu tri / Hoi chan:', margin + 110, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(removeVietnameseTones(headerConfig.doctorName || 'Bac si chuyen khoa'), margin + 110, y + 14);
    if (headerConfig.licenseNumber) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(removeVietnameseTones(headerConfig.licenseNumber), margin + 110, y + 18);
    }
  }

  // Footer Disclaimer & References
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Tai lieu tham khao: Altaihani et al. Rev Contemp Philos 2024 | Sikaris KA. Clin Biochem Rev 2013 | ACG Guideline 2017 | WHO Training Workshop.', margin, 289);
  doc.text('Luu y: Bao cao nay duoc tao tu He thong CDSS sinh hoa gan nham ho tro tra cuu kinh nghiem lam sang chuyen khoa.', margin, 292);

  doc.save(`HepaCDSS_Report_${Date.now()}.pdf`);
}

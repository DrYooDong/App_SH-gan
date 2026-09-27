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
    { name: 'PT / INR', val: labs.inr ? `INR ${labs.inr}` : 'Chua lam', ref: '0.85 - 1.15', interp: labs.inr ? (labs.inr >= 1.5 ? 'Keo dai - Canh bao' : 'Binh thuong') : '-' },
    { name: 'So luong Tieu cau', val: labs.platelets ? `${labs.platelets} x10^9/L` : 'Chua lam', ref: '150 - 450 x10^9/L', interp: labs.platelets ? (labs.platelets < 150 ? 'Giam tieu cau' : 'Binh thuong') : '-' }
  ];

  doc.setFont('helvetica', 'normal');
  labRows.forEach((row, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.5, 'F');
    }
    doc.text(removeVietnameseTones(row.name), margin + 4, y + 4);
    doc.text(row.val, margin + 60, y + 4);
    doc.text(row.ref, margin + 95, y + 4);
    doc.text(removeVietnameseTones(row.interp), margin + 145, y + 4);
    y += 5.5;
  });

  y += 4;

  // CDSS Core Metrics Summary Box
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 27, 75);
  doc.text('2. PHAN TICH CDSS & CAC CHI SO CHUYEN KHOA TINH TOAN', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`- Kieu ton thuong gan: ${analysis.pattern.toUpperCase()}`, margin + 4, y + 10);
  doc.text(`- Chi so R (R-ratio): ${analysis.rRatio} (${analysis.rRatio > 5 ? 'Hepatocellular >5' : analysis.rRatio < 2 ? 'Cholestatic <2' : 'Mixed 2-5'})`, margin + 100, y + 10);
  doc.text(`- Ty so De Ritis (AST/ALT): ${analysis.deRitisRatio} (${analysis.deRitisRatio >= 2 ? 'De Ritis >2: ALD/Wilson/Cirrhosis' : analysis.deRitisRatio < 1 ? 'De Ritis <1: Acute Viral/MASLD' : 'Binh thuong ~1.0'})`, margin + 4, y + 15);
  doc.text(`- Muc do tang Transaminase: ${removeVietnameseTones(analysis.severity)}`, margin + 100, y + 15);
  
  if (analysis.fib4Score) {
    doc.text(`- Diem FIB-4: ${analysis.fib4Score} -> ${removeVietnameseTones(analysis.fib4Stage || '')}`, margin + 4, y + 20);
  } else {
    doc.text(`- Phan do Bilirubin: ${analysis.conjugatedPercent}% lien hop (${analysis.isConjugatedPredominant ? 'Uu the truc tiep' : analysis.isUnconjugatedPredominant ? 'Uu the gian tiep' : 'Hon hop'})`, margin + 4, y + 20);
  }

  y += 28;

  // Alerts if present
  if (analysis.isAcuteLiverFailureWarning || analysis.isMassiveTransaminitisWarning) {
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    if (analysis.isAcuteLiverFailureWarning) {
      doc.text('CANH BAO NGUY CO SUY GAN CAP (ACUTE LIVER FAILURE - ALF)!', margin + 4, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.text('Benh nhan co ton thuong te bao gan + INR >= 1.5 + roi loan tri giac. Chuyen gap don vi hoi suc ghep gan!', margin + 4, y + 9);
    } else {
      doc.text('CANH BAO TRANSAMINASE KHONG LO (>10,000 U/L)!', margin + 4, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.text('Goi y ngo doc Acetaminophen, soc gan do thieu mau cuc bo hoac doc chat nam.', margin + 4, y + 9);
    }
    y += 15;
  }

  // Differential Diagnoses
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 76, 129);
  doc.text('3. CHAN DOAN PHAN BIET XEP THEO XAC SUAT', margin, y);
  y += 5;

  analysis.differentialDiagnoses.slice(0, 4).forEach((d) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`* [${d.likelihood.toUpperCase()}] ${removeVietnameseTones(d.disease)}`, margin + 2, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`  Dau hieu: ${removeVietnameseTones(d.clues)}`, margin + 2, y);
    y += 4;
    doc.text(`  De xuat: ${removeVietnameseTones(d.recommendedNextStep)}`, margin + 2, y);
    y += 5.5;
  });

  y += 2;

  // Next Step Recommendations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 76, 129);
  doc.text('4. KHUYEN CAO XET NGHIEM TIEP THEO (THEO ACG & WHO)', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  analysis.stepByStepRecommendations.slice(0, 5).forEach((rec) => {
    const safeRec = removeVietnameseTones(rec);
    const splitLines = doc.splitTextToSize(`- ${safeRec}`, contentWidth - 4);
    doc.text(splitLines, margin + 2, y);
    y += splitLines.length * 4;
  });

  // Doctor Signature & Stamp Area
  if (headerConfig?.showDoctorSignature) {
    y = Math.max(y + 6, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Xac nhan cua Bac si dieu tri / Hoi chan:', margin + 110, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(removeVietnameseTones(headerConfig.doctorName || 'Bac si chuyen khoa'), margin + 110, y + 16);
    if (headerConfig.licenseNumber) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(removeVietnameseTones(headerConfig.licenseNumber), margin + 110, y + 20);
    }
  }

  // Footer Disclaimer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Luu y: Bao cao nay duoc tao tu He thong CDSS sinh hoa gan nham ho tro tra cuu kinh nghiem lam sang chuyen khoa.', margin, 287);
  doc.text('Tham khao: ACG Guideline 2017 (Am J Gastroenterol) & WHO LFTs Training Manual.', margin, 291);

  doc.save(`HepaCDSS_Report_${Date.now()}.pdf`);
}

import React from 'react';
import { PatientLabs, CDSSAnalysis } from '../types/cdss';
import { AppSettings } from '../types/settings';
import { generateConsultationPDF } from '../utils/pdfGenerator';
import { 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Activity,
  FileSpreadsheet
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  labs: PatientLabs;
  analysis: CDSSAnalysis;
  settings?: AppSettings;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  labs,
  analysis,
  settings
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleString('vi-VN');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="bg-slate-900 px-6 py-3.5 text-white flex items-center justify-between print:hidden shrink-0">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-sm">Xem Bản In / Xuất Phiếu Hội Chẩn Chuyên Khoa</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors border border-slate-700 shadow-2xs"
              title="In ngay hoặc lưu PDF bằng trình duyệt"
              aria-label="In phiếu hoặc lưu PDF trình duyệt"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => generateConsultationPDF(labs, analysis, settings?.headerInfo)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center space-x-1.5 transition-colors shadow-sm"
              title="Tải tệp PDF trực tiếp về thiết bị"
            >
              <Download className="w-4 h-4" />
              <span>Tải File .PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              title="Đóng cửa sổ"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div id="printable-report" className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-900 text-xs sm:text-sm print:p-0 print:m-0 print:overflow-visible">
          
          {/* Hospital / Clinic Custom Header */}
          {settings?.headerInfo.hospitalName && (
            <div className="border-b border-slate-200 pb-2 text-xs text-slate-600 flex justify-between items-center">
              <div>
                <span className="font-extrabold uppercase text-slate-900 block text-sm">
                  {settings.headerInfo.hospitalName}
                </span>
                <span className="text-slate-500">
                  {settings.headerInfo.department}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                <span>BS phụ trách: <strong>{settings.headerInfo.doctorName}</strong></span>
                {settings.headerInfo.licenseNumber && (
                  <span className="block">{settings.headerInfo.licenseNumber}</span>
                )}
              </div>
            </div>
          )}

          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 uppercase">
                HỆ THỐNG HỖ TRỢ RA QUYẾT ĐỊNH LÂM SÀNG SINH HÓA GAN
              </h1>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                HepaCDSS - Clinical Decision Support System for Liver Chemistries
              </p>
              <p className="text-[11px] text-slate-500">
                Chuẩn hóa theo NEJM 2019 (DILI Phenotypes), ACG Clinical Guideline 2017, Altaihani et al. 2024 &amp; Sikaris 2013
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ngày thực hiện</span>
              <span className="text-xs font-mono font-bold text-slate-800 block">{currentDate}</span>
              <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-teal-50 text-teal-800 border border-teal-200 rounded">
                Bản Tóm Tắt Chuyên Khoa Toàn Diện
              </span>
            </div>
          </div>

          {/* Patient Profile Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Giới tính</span>
              <span className="font-bold text-slate-900">{labs.gender === 'male' ? 'Nam' : 'Nữ'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Tuổi &amp; Thể trạng</span>
              <span className="font-bold text-slate-900">
                {labs.age ? `${labs.age} tuổi` : 'Chưa rõ'} | BMI: {labs.bmi || 'Chưa ghi nhận'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Thuốc / Thảo dược</span>
              <span className="font-bold text-rose-800 truncate block">
                {labs.suspectedDrug || 'Không ghi nhận'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Ngưỡng ALT ULN</span>
              <span className="font-bold text-teal-800">
                {labs.altUln} U/L (ACG 2017)
              </span>
            </div>
          </div>

          {/* NEJM 2019 Hy's Law Critical Alert Banner */}
          {analysis.diliAnalysis?.hysLaw.isPositive && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-600 rounded-xl text-xs text-rose-950 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between font-black text-rose-900">
                <span className="flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>BÁO ĐỘNG ĐỎ: BỆNH NHÂN THỎA TIÊU CHUẨN ĐỊNH LUẬT HY (HY'S LAW - NEJM 2019)</span>
                </span>
                <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] uppercase font-bold">
                  Tử vong / Ghép gan ≥ 10%
                </span>
              </div>
              <p className="font-semibold leading-relaxed">
                {analysis.diliAnalysis.hysLaw.message}
              </p>
              <div className="text-[11px] text-rose-900 bg-white/80 p-2 rounded-lg border border-rose-200">
                • Tiêu chuẩn: ALT {labs.alt} U/L (≥ 3x ULN) + Bilirubin {labs.totalBilirubin} mg/dL (≥ 2x ULN) + Không tắc mật (R = {analysis.rRatio} &gt; 5).
                <br />• Xử trí: <strong>ĐÌNH CHỈ NGAY THUỐC NGHI NGỜ</strong>. Hội chẩn khẩn cấp chuyên khoa Gan mật!
              </div>
            </div>
          )}

          {/* Pre-analytical Alerts Banner */}
          {analysis.preAnalyticalAlerts && analysis.preAnalyticalAlerts.length > 0 && (

            <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-xl text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="uppercase tracking-wider">Cảnh báo Tiền Phân Tích &amp; Khả Năng Nhiễu Mẫu (Altaihani et al. 2024):</span>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.preAnalyticalAlerts.map((alert, idx) => (
                  <li key={idx} className="font-medium text-amber-900 leading-relaxed">{alert}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Red Flag Box if acute liver failure */}
          {analysis.isAcuteLiverFailureWarning && (
            <div className="p-3 bg-rose-50 border border-rose-400 rounded-xl text-xs text-rose-900 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>CẢNH BÁO NGUY CƠ SUY GAN CẤP (ACUTE LIVER FAILURE - ALF):</span>
              </div>
              <p>
                Bệnh nhân có tăng men gan hoại tử tế bào gan + rối loạn đông máu (INR ≥ 1.5) + biểu hiện bệnh não gan / asterixis. Khẩn cấp hội chẩn Trung tâm Ghép Gan!
              </p>
            </div>
          )}

          {/* Table of Biomarkers */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              1. Bảng Kết Quả Định Lượng Sinh Hóa Gan &amp; Dấu Ấn Chuyên Khoa
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Tên Xét Nghiệm</th>
                    <th className="py-2 px-3">Kết Quả</th>
                    <th className="py-2 px-3">Khoảng Tham Chiếu / ULN</th>
                    <th className="py-2 px-3">Đánh Giá &amp; Bội Số</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">ALT (Alanine Aminotransferase)</td>
                    <td className="py-2 px-3 font-bold text-rose-700">{labs.alt} U/L</td>
                    <td className="py-2 px-3 text-slate-500">ULN: {labs.altUln} U/L</td>
                    <td className="py-2 px-3">{analysis.altMultiples}x ULN</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">AST (Aspartate Aminotransferase)</td>
                    <td className="py-2 px-3 font-bold text-rose-700">{labs.ast} U/L</td>
                    <td className="py-2 px-3 text-slate-500">ULN: {labs.astUln} U/L</td>
                    <td className="py-2 px-3">{analysis.astMultiples}x ULN</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Alkaline Phosphatase (ALP)</td>
                    <td className="py-2 px-3 font-bold text-amber-700">{labs.alp} U/L</td>
                    <td className="py-2 px-3 text-slate-500">ULN: {labs.alpUln} U/L</td>
                    <td className="py-2 px-3">{analysis.alpMultiples}x ULN</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Gamma-GT (GGT)</td>
                    <td className="py-2 px-3">{labs.ggt ? `${labs.ggt} U/L` : 'Chưa làm'}</td>
                    <td className="py-2 px-3 text-slate-500">ULN: ~35-50 U/L</td>
                    <td className="py-2 px-3">{labs.ggt ? (labs.ggt > (labs.ggtUln || 50) ? 'Tăng' : 'Bình thường') : '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Bilirubin Toàn Phần</td>
                    <td className="py-2 px-3 font-bold">{labs.totalBilirubin} mg/dL</td>
                    <td className="py-2 px-3 text-slate-500">&lt; 1.2 mg/dL</td>
                    <td className="py-2 px-3">{labs.totalBilirubin > 1.2 ? 'Tăng' : 'Bình thường'}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Bilirubin Trực Tiếp (Liên hợp)</td>
                    <td className="py-2 px-3">{labs.directBilirubin} mg/dL</td>
                    <td className="py-2 px-3 text-slate-500">&lt; 0.3 mg/dL</td>
                    <td className="py-2 px-3">{analysis.conjugatedPercent}% tổng bilirubin</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Albumin Máu (Tổng hợp gan)</td>
                    <td className="py-2 px-3">{labs.albumin ? `${labs.albumin} g/dL` : 'Chưa làm'}</td>
                    <td className="py-2 px-3 text-slate-500">3.5 - 5.0 g/dL (t½ = 21 ngày)</td>
                    <td className="py-2 px-3">{labs.albumin ? (labs.albumin < 3.5 ? 'Giảm (bệnh mạn/suy gan)' : 'Bình thường') : '-'}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">PT / INR (Đông máu ngoại sinh)</td>
                    <td className="py-2 px-3 font-bold">{labs.inr ? `INR ${labs.inr}` : 'Chưa làm'}</td>
                    <td className="py-2 px-3 text-slate-500">0.85 - 1.15</td>
                    <td className="py-2 px-3">{labs.inr ? (labs.inr >= 1.5 ? 'Kéo dài có ý nghĩa' : 'Bình thường') : '-'}</td>
                  </tr>
                  {labs.platelets && (
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Số Lượng Tiểu Cầu</td>
                      <td className="py-2 px-3 font-bold">{labs.platelets} x10⁹/L</td>
                      <td className="py-2 px-3 text-slate-500">150 - 450 x10⁹/L</td>
                      <td className="py-2 px-3">{labs.platelets < 150 ? 'Giảm (nghi ngờ tăng áp cửa)' : 'Bình thường'}</td>
                    </tr>
                  )}
                  {/* Additional Biomarkers Rows */}
                  {labs.afp !== undefined && (
                    <tr className="bg-purple-50/40">
                      <td className="py-2 px-3 font-semibold text-purple-900">Alpha-fetoprotein (AFP)</td>
                      <td className="py-2 px-3 font-bold text-purple-800">{labs.afp} ng/mL</td>
                      <td className="py-2 px-3 text-slate-500">&lt; 10 ng/mL (Ngưỡng HCC: &gt; 400)</td>
                      <td className="py-2 px-3">{labs.afp > 400 ? 'Tăng rất cao (Nghi HCC)' : labs.afp > 10 ? 'Tăng nhẹ/tái tạo mô' : 'Bình thường'}</td>
                    </tr>
                  )}
                  {labs.ca199 !== undefined && (
                    <tr className="bg-purple-50/40">
                      <td className="py-2 px-3 font-semibold text-purple-900">CA 19-9 (Khối u đường mật)</td>
                      <td className="py-2 px-3 font-bold text-purple-800">{labs.ca199} U/mL</td>
                      <td className="py-2 px-3 text-slate-500">&lt; 37 U/mL (Ngưỡng cảnh báo: &gt; 100)</td>
                      <td className="py-2 px-3">{labs.ca199 > 100 ? 'Nghi ung thư biểu mô đường mật' : labs.ca199 > 37 ? 'Tăng nhẹ' : 'Bình thường'}</td>
                    </tr>
                  )}
                  {labs.ferritin !== undefined && (
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Ferritin Huyết Thanh</td>
                      <td className="py-2 px-3 font-bold">{labs.ferritin} ng/mL</td>
                      <td className="py-2 px-3 text-slate-500">30 - 300 ng/mL</td>
                      <td className="py-2 px-3">{labs.ferritin > 1000 ? 'Rất cao (Nguy cơ xơ hóa/ứ sắt)' : labs.ferritin > 300 ? 'Tăng' : 'Bình thường'}</td>
                    </tr>
                  )}
                  {labs.transferrinSat !== undefined && (
                    <tr className="bg-slate-50/50">
                      <td className="py-2 px-3 font-semibold text-slate-900">Bão Hòa Transferrin (TSAT)</td>
                      <td className="py-2 px-3 font-bold">{labs.transferrinSat}%</td>
                      <td className="py-2 px-3 text-slate-500">20 - 45% (Chỉ định gen HFE nếu ≥ 45%)</td>
                      <td className="py-2 px-3">{labs.transferrinSat >= 45 ? 'Chỉ định xét nghiệm gen HFE' : 'Bình thường'}</td>
                    </tr>
                  )}
                  {labs.ceruloplasmin !== undefined && (
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Ceruloplasmin (Wilson)</td>
                      <td className="py-2 px-3 font-bold">{labs.ceruloplasmin} mg/dL</td>
                      <td className="py-2 px-3 text-slate-500">20 - 40 mg/dL</td>
                      <td className="py-2 px-3">{labs.ceruloplasmin < 20 ? 'Giảm rõ (Nghi bệnh Wilson)' : 'Bình thường'}</td>
                    </tr>
                  )}
                  {labs.ck !== undefined && (
                    <tr className="bg-slate-50/50">
                      <td className="py-2 px-3 font-semibold text-slate-900">Creatine Kinase (CK)</td>
                      <td className="py-2 px-3 font-bold">{labs.ck} U/L</td>
                      <td className="py-2 px-3 text-slate-500">30 - 200 U/L</td>
                      <td className="py-2 px-3">{labs.ck > 1000 ? 'Tăng vọt (Hủy cơ vân / tổn thương cơ)' : labs.ck > 200 ? 'Tăng nhẹ' : 'Bình thường'}</td>
                    </tr>
                  )}
                  {labs.ldh !== undefined && (
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Lactate Dehydrogenase (LDH)</td>
                      <td className="py-2 px-3 font-bold">{labs.ldh} U/L</td>
                      <td className="py-2 px-3 text-slate-500">50 - 150 U/L (Altaihani 2024)</td>
                      <td className="py-2 px-3">{labs.ldh > 150 ? 'Tăng' : 'Bình thường'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: CDSS Core Calculations & Sikaris 2013 De Ritis Matrix */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              2. Đánh Giá Các Chỉ Số Tính Toán &amp; Phân Tầng De Ritis (Sikaris 2013)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-bold">Kiểu Tổn Thương</span>
                <span className="text-sm font-extrabold text-teal-800 mt-0.5 block">{analysis.pattern}</span>
                <span className="text-[10px] text-slate-500">Chỉ số R = {analysis.rRatio}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-bold">Tỷ số De Ritis (AST/ALT)</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">{analysis.deRitisRatio}</span>
                <span className="text-[10px] text-slate-500">{analysis.deRitisDetail?.decisionLimit || (analysis.deRitisRatio >= 2 ? 'Rượu / Xơ gan' : 'Virus / MASLD')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-bold">Mức Độ Tăng Men</span>
                <span className="text-sm font-extrabold text-rose-800 mt-0.5 block">{analysis.severity}</span>
                <span className="text-[10px] text-slate-500">Max: {Math.max(analysis.altMultiples, analysis.astMultiples)}x ULN</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-bold">
                  {analysis.fib4Score ? 'Điểm FIB-4' : 'Phân đoạn Bilirubin'}
                </span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  {analysis.fib4Score ? analysis.fib4Score : `${analysis.conjugatedPercent}%`}
                </span>
                <span className="text-[10px] text-slate-500">{analysis.fib4Stage || 'Liên hợp'}</span>
              </div>
            </div>

            {/* In-depth De Ritis & Kinetic Box */}
            {analysis.deRitisDetail && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Ma Trận Quyết Định Lâm Sàng De Ritis (Bảng 2 Sikaris 2013):</span>
                  <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-mono">
                    Khung phân loại: {analysis.deRitisDetail.decisionLimit}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {analysis.deRitisDetail.interpretation}
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div><strong>Động học bán hủy &amp; cơ chế: </strong>{analysis.deRitisDetail.halfLifeKineticNote}</div>
                  <div><strong>Ý nghĩa tiên lượng: </strong>{analysis.deRitisDetail.prognosticSignificance}</div>
                  {analysis.deRitisDetail.kineticAlert && (
                    <div className="p-2 bg-rose-50 border border-rose-300 rounded font-bold text-rose-800 mt-1">
                      ⚠️ {analysis.deRitisDetail.kineticAlert}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section: Secondary & Autoimmune Biomarker Alerts */}
          {((analysis.secondaryBiomarkerAlerts && analysis.secondaryBiomarkerAlerts.length > 0) || 
            (analysis.autoimmuneAlerts && analysis.autoimmuneAlerts.length > 0)) && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Dấu Ấn Khối U &amp; Huyết Thanh Miễn Dịch Chuyên Khoa
              </h3>
              <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl text-xs space-y-1.5">
                {analysis.secondaryBiomarkerAlerts?.map((a, i) => (
                  <p key={i} className="text-purple-950 font-medium">🔬 {a}</p>
                ))}
                {analysis.autoimmuneAlerts?.map((a, i) => (
                  <p key={i} className="text-purple-950 font-medium">🛡️ {a}</p>
                ))}
              </div>
            </div>
          )}

          {/* Section: NEJM 2019 DILI Phenotype Evaluation */}
          {analysis.diliAnalysis?.isSuspected && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Đánh Giá Độc Tính Gan Do Thuốc / Thảo Dược (DILI - NEJM 2019)
              </h3>
              <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-rose-950">
                    Kiểu hình: <strong>{analysis.diliAnalysis.phenotypeVi}</strong> ({analysis.diliAnalysis.phenotype})
                  </span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] uppercase font-bold border border-rose-200">
                    Cơ chế: {analysis.diliAnalysis.mechanism}
                  </span>
                </div>
                <div className="text-slate-700 space-y-1">
                  {analysis.diliAnalysis.implicatedAgent && (
                    <div>• Tác nhân nghi ngờ: <strong>{analysis.diliAnalysis.implicatedAgent}</strong></div>
                  )}
                  {analysis.diliAnalysis.latencyDays !== undefined && (
                    <div>• Thời gian ủ bệnh: <strong>{analysis.diliAnalysis.latencyDays} ngày</strong> {analysis.diliAnalysis.latencyAssessment && `(${analysis.diliAnalysis.latencyAssessment})`}</div>
                  )}
                  <div>• Khuyến cáo hành động: {analysis.diliAnalysis.recommendedActions.join(' ')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Differential Diagnoses */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              3. Chẩn Đoán Phân Biệt Sắp Xếp Theo Mức Độ Phù Hợp
            </h3>

            <div className="space-y-2">
              {analysis.differentialDiagnoses.map((d, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">{i + 1}. {d.disease}</span>
                    <span className="text-teal-700">[{d.likelihood}]</span>
                  </div>
                  <p className="text-slate-600">
                    <strong>Cơ sở: </strong>{d.clues}
                  </p>
                  <p className="text-teal-800 font-medium">
                    <strong>Đề xuất: </strong>{d.recommendedNextStep}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Recommended Action Plan */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              4. Kế Hoạch Xét Nghiệm Bổ Sung &amp; Xử Trí Theo Hướng Dẫn ACG
            </h3>

            <ul className="space-y-1 text-xs text-slate-700 bg-teal-50/40 p-3 rounded-xl border border-teal-100">
              {analysis.stepByStepRecommendations.map((r, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5: QC & Pre-analytical Guidance for Clinicians */}
          {analysis.qualityControlGuidance && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-600">
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
                Khuyến Nghị Tiêu Chuẩn Phòng Xét Nghiệm (Altaihani et al. 2024):
              </span>
              <p className="leading-relaxed">
                {analysis.qualityControlGuidance}
              </p>
            </div>
          )}

          {/* Signatures box */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 text-center text-xs">
            <div>
              <span className="font-bold text-slate-700 block">KỸ THUẬT VIÊN / LAB THỰC HIỆN</span>
              <span className="text-slate-400 italic text-[11px] block mt-12">(Ký và ghi rõ họ tên)</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block">BÁC SĨ CHUYÊN KHOA ĐIỀU TRỊ</span>
              <div className="mt-8">
                {settings?.headerInfo.doctorName ? (
                  <>
                    <span className="font-extrabold text-slate-900 block text-xs">
                      {settings.headerInfo.doctorName}
                    </span>
                    {settings.headerInfo.licenseNumber && (
                      <span className="text-[10px] text-slate-500 block">
                        {settings.headerInfo.licenseNumber}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-slate-400 italic text-[11px] block mt-4">(Ký và ghi rõ họ tên)</span>
                )}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
            HepaCDSS là công cụ hỗ trợ ra quyết định lâm sàng và lưu trữ tri thức chuyên môn cho nhân viên y tế. Quyết định chẩn đoán và điều trị cuối cùng thuộc về bác sĩ lâm sàng phụ trách ca bệnh.
          </div>
        </div>

      </div>
    </div>
  );
};


export type Gender = 'male' | 'female';

export interface PatientLabs {
  age?: number;
  gender: Gender;
  bmi?: number;
  
  // Transaminases
  alt: number; // Alanine aminotransferase (U/L)
  altUln: number; // Upper limit of normal for ALT (U/L)
  ast: number; // Aspartate aminotransferase (U/L)
  astUln: number; // Upper limit of normal for AST (U/L)
  
  // Cholestasis markers
  alp: number; // Alkaline phosphatase (U/L)
  alpUln: number; // Upper limit of normal for ALP (U/L)
  ggt?: number; // Gamma-glutamyl transferase (U/L)
  ggtUln?: number;
  
  // Bilirubin
  totalBilirubin: number; // mg/dL
  directBilirubin: number; // mg/dL (conjugated)
  
  // Synthetic function & Proteins
  albumin?: number; // g/dL (hoặc g/L quy đổi)
  totalProtein?: number; // g/dL
  globulin?: number; // g/dL
  inr?: number; // Prothrombin Time INR
  prothrombinTimeSeconds?: number; // Prothrombin time in seconds (Normal 10.9 - 12.5s)
  
  // Hematology & Fibrosis
  platelets?: number; // 10^9 / L
  
  // Advanced Secondary Biochemical & Tumor Markers (Altaihani et al. 2024)
  afp?: number; // Alpha-fetoprotein (ng/mL) - HCC, Hepatoblastoma, regeneration
  ca199?: number; // CA 19-9 (U/mL) - Cholangiocarcinoma, PSC progression
  ferritin?: number; // ng/mL - Hemochromatosis / acute phase reactant
  transferrinSat?: number; // % - Transferrin saturation (>=45% triggers HFE gene testing)
  ceruloplasmin?: number; // mg/dL - Wilson disease (<20 mg/dL abnormal)
  urineCopper24h?: number; // µg/24h (>100 µg supports Wilson)
  a1at?: number; // mg/dL - Alpha-1 antitrypsin deficiency
  
  // Thyroid & Endocrine
  tsh?: number; // µIU/mL - Thyroid-stimulating hormone (0.4 - 4.0)
  freeT4?: number; // ng/dL (0.8 - 1.8)
  
  // Autoimmune Liver Serology (Altaihani et al. 2024)
  ana?: 'positive' | 'negative' | 'unknown'; // Antinuclear antibodies (AIH-1)
  asma?: 'positive' | 'negative' | 'unknown'; // Anti-smooth muscle antibodies (AIH-1)
  ama?: 'positive' | 'negative' | 'unknown'; // Antimitochondrial antibodies (PBC hallmark >95%)
  antiLkm1?: 'positive' | 'negative' | 'unknown'; // Anti-LKM1 (AIH-2)
  pAnca?: 'positive' | 'negative' | 'unknown'; // p-ANCA (PSC, autoimmune cholangitis)
  antiTtgIga?: 'positive' | 'negative' | 'unknown'; // Anti-tissue transglutaminase IgA (Celiac)
  igg?: number; // IgG (mg/dL) - Hypergammaglobulinemia in AIH
  
  // Hemolysis & Muscle Markers
  creatinine?: number; // mg/dL
  sodium?: number; // mEq/L
  ck?: number; // Creatine kinase U/L (Rhabdomyolysis / muscle injury)
  ldh?: number; // Lactate dehydrogenase U/L (50-150 IU/L - Hemolysis, ischemia, tissue injury)
  haptoglobin?: number; // mg/dL (decreased in hemolysis)
  reticulocytes?: number; // % (elevated in hemolysis)
  
  // Pre-analytical & Specimen Interfering Factors (Altaihani et al. 2024)
  sampleHemolysis?: boolean; // Tán huyết ống nghiệm: giải phóng AST từ hồng cầu (AST RBC > 40x huyết thanh)
  sampleLipemia?: boolean; // Đục mỡ huyết thanh: tán xạ bước sóng 340 nm ảnh hưởng phản ứng đo quang ALT/AST
  sampleIcterus?: boolean; // Vàng da mẫu máu: hấp phụ quang 400 - 540 nm
  sampleDelayed?: boolean; // Mẫu để quá 8h ở nhiệt độ phòng (15-30°C) không bảo quản lạnh
  isNonFasting?: boolean; // Mẫu lấy sau ăn mỡ (tăng ALT đến 30 U/L ở nhóm máu B/O, tăng ALP ruột)
  metronidazoleUse?: boolean; // Thuốc Metronidazole hấp phụ 340 nm gây giảm giả tạo ALT
  isSmoker?: boolean; // Hút thuốc làm tăng PLALP giả
  strenuousExercise?: boolean; // Vận động cường độ cao trong 24-48h (tăng AST, CK cơ bắp)
  suspectedAlcoholWithin24h?: boolean; // Uống rượu trong vòng 24h (AST tăng cao nhất thời điểm này)
  
  // DILI & Drug History (NEJM 2019 - Hoofnagle & Björnsson)
  suspectedDrug?: string; // Tên thuốc / thảo dược nghi ngờ gây độc gan
  drugLatencyDays?: number; // Thời gian từ khi bắt đầu dùng thuốc tới khi xuất hiện tổn thương (ngày)
  hasPruritus?: boolean; // Ngứa da sớm và dữ dội (gợi ý thể ứ mật / bland cholestasis)
  hasImmunoallergicFeatures?: boolean; // Sốt, phát ban da, tăng bạch cầu ái toan (DRESS, SJS/TEN)
  isUsingCheckpointInhibitor?: boolean; // Thuốc ức chế điểm kiểm soát miễn dịch ung thư (Anti-PD1/PD-L1, Anti-CTLA4)
  isUsingImmunosuppressant?: boolean; // Thuốc ức chế miễn dịch (Anti-CD20 Rituximab, Corticoid liều cao -> nguy cơ tái hoạt HBV)
  isUsingAnabolicSteroids?: boolean; // Steroid đồng hóa tăng cơ ở người tập thể hình (Bland cholestasis)
  isUsingHerbalSupplements?: boolean; // Tinh chất trà xanh, thảo dược giảm cân, thực phẩm bổ sung (HDS)
  hasLacticAcidosis?: boolean; // Toan lactic máu, tổn thương ty thể (Stavudine, Didanosine, Linezolid, Aspirin)
  hasSinusoidalObstructionSigns?: boolean; // Đau HSP, gan to, tăng cân/báng bụng sau hóa trị/ghép tủy (SOS/VOD)

  // Clinical Flags
  alcoholIntake?: number; // grams/week (>140 for females, >210 for males)
  hasEncephalopathy?: boolean;
  hasAscites?: boolean;
  pregnant?: boolean;
  ultrasoundBiliaryDilatation?: 'dilated' | 'non-dilated' | 'not-done';
  notes?: string;
}

export type InjuryPattern = 'Hepatocellular' | 'Cholestatic' | 'Mixed' | 'Isolated Hyperbilirubinemia' | 'Normal / Borderline';

export type ElevationSeverity = 'Normal' | 'Borderline (<2x ULN)' | 'Mild (2-5x ULN)' | 'Moderate (5-15x ULN)' | 'Severe (>15x ULN)' | 'Massive (>10,000 U/L)';

// NEJM 2019 DILI Classifications
export type DILIMechanism = 'Direct' | 'Idiosyncratic' | 'Indirect' | 'Unknown';

export type DILIPhenotype = 
  | 'Acute hepatic necrosis'
  | 'Asymptomatic enzyme elevations'
  | 'Acute hepatocellular hepatitis'
  | 'Cholestatic hepatitis'
  | 'Mixed hepatitis'
  | 'Chronic hepatitis / Drug-induced AIH'
  | 'Bland cholestasis'
  | 'Acute fatty liver with lactic acidosis'
  | 'Sinusoidal obstruction syndrome (SOS/VOD)'
  | 'Nodular regenerative hyperplasia (NRH)'
  | 'Immunoallergic hepatitis';

export interface HysLawAssessment {
  isPositive: boolean;
  isBorderline: boolean;
  altMet: boolean; // ALT >= 3x ULN
  biliMet: boolean; // Total Bilirubin >= 2x ULN
  alpExcluded: boolean; // Không tắc mật (R > 5 hoặc ALP không tăng tương ứng)
  message: string;
  mortalityRisk: string; // Tỷ lệ tử vong hoặc ghép gan >= 10%
}

export interface DILIAnalysis {
  isSuspected: boolean;
  mechanism: DILIMechanism;
  phenotype: DILIPhenotype | string;
  phenotypeVi: string;
  hysLaw: HysLawAssessment;
  implicatedAgent?: string;
  agentCategory?: string;
  latencyDays?: number;
  latencyAssessment?: string;
  clinicalClues: string[];
  recommendedActions: string[];
  immunoallergicNote?: string;
  geneticHlaNote?: string;
}

export interface DeRitisStratification {
  ratio: number;
  category: 'Healthy' | 'Acute Viral' | 'Alcoholic' | 'Chronic Liver' | 'Muscle Disease' | 'Pediatric/Neonate';
  decisionLimitText: string;
  clinicalMeaning: string;
  riskSeverity: 'low' | 'moderate' | 'high' | 'critical';
  pathophysiologicalMechanism: string;
  vitaminB6Note?: string;
  prognosticAlert?: string;
}

export interface CDSSAnalysis {
  pattern: InjuryPattern;
  rRatio: number;
  deRitisRatio: number;
  deRitisDetail: DeRitisStratification;
  altMultiples: number;
  astMultiples: number;
  alpMultiples: number;
  severity: ElevationSeverity;
  conjugatedPercent: number;
  isConjugatedPredominant: boolean;
  isUnconjugatedPredominant: boolean;
  syntheticImpairment: boolean;
  isAcuteLiverFailureWarning: boolean;
  isMassiveTransaminitisWarning: boolean;
  fib4Score?: number;
  fib4Stage?: string;
  apriScore?: number;
  apriStage?: string;
  meldScore?: number;
  primaryImpression: string;
  keyFindings: string[];
  differentialDiagnoses: {
    disease: string;
    likelihood: 'Rất cao' | 'Cao' | 'Trung bình' | 'Cần loại trừ';
    clues: string;
    recommendedNextStep: string;
  }[];
  stepByStepRecommendations: string[];
  guidelineReferences: string[];
  
  // New upgraded analysis outputs from 2024 review & Sikaris 2013
  preAnalyticalAlerts: string[];
  secondaryBiomarkerAlerts: string[];
  autoimmuneAlerts: string[];
  qualityControlGuidance: string[];

  // NEJM 2019 DILI Engine
  diliAnalysis?: DILIAnalysis;
}

export interface ClinicalCase {
  id: string;
  title: string;
  patientProfile: string;
  category: 'Viral' | 'Alcohol' | 'Metabolic' | 'Biliary' | 'Toxic/DILI' | 'Autoimmune' | 'Genetic' | 'Emergency' | 'Pre-analytical' | 'DILI';
  history: string;
  labs: PatientLabs;
  teachingPoints: string[];
  expertCommentary: string;
}

export interface BiomarkerInfo {
  id: string;
  code: string;
  nameVi: string;
  nameEn: string;
  category: 'Hepatocellular' | 'Cholestatic' | 'Bilirubin' | 'Synthetic' | 'Specialized' | 'Non-hepatic' | 'Tumor & Serology';
  normalRangeMale: string;
  normalRangeFemale: string;
  halfLife: string;
  cellularOrigin: string;
  physiologicalRole: string;
  causesOfElevation: string[];
  causesOfReduction?: string[];
  clinicalPearls: string[];
  testingPitfalls: string[];
}

export interface AlgorithmStep {
  id: string;
  title: string;
  description: string;
  condition?: string;
  actions: string[];
  substeps?: AlgorithmStep[];
}


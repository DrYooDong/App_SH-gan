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
  // Synthetic function
  albumin?: number; // g/dL
  inr?: number; // Prothrombin Time INR
  // Hematology & Fibrosis
  platelets?: number; // 10^9 / L
  // Additional specialized markers
  ferritin?: number; // ng/mL
  transferrinSat?: number; // %
  creatinine?: number; // mg/dL
  sodium?: number; // mEq/L
  ck?: number; // Creatine kinase U/L
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

export interface CDSSAnalysis {
  pattern: InjuryPattern;
  rRatio: number;
  deRitisRatio: number;
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
}

export interface ClinicalCase {
  id: string;
  title: string;
  patientProfile: string;
  category: 'Viral' | 'Alcohol' | 'Metabolic' | 'Biliary' | 'Toxic/DILI' | 'Autoimmune' | 'Genetic' | 'Emergency';
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
  category: 'Hepatocellular' | 'Cholestatic' | 'Bilirubin' | 'Synthetic' | 'Specialized' | 'Non-hepatic';
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

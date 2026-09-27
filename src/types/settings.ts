export interface HospitalHeaderConfig {
  hospitalName: string;
  department: string;
  doctorName: string;
  doctorTitle: string;
  licenseNumber: string;
  showDoctorSignature: boolean;
  showOfficialStamp: boolean;
}

export type UlnStandard = 'acg2017' | 'who' | 'custom';

export interface CustomUlnConfig {
  altMale: number;
  altFemale: number;
  astMale: number;
  astFemale: number;
  alp: number;
  ggt: number;
}

export interface UnitConfig {
  enzyme: 'u_l' | 'ukat_l';
  bilirubin: 'mg_dl' | 'umol_l';
  albumin: 'g_dl' | 'g_l';
}

export interface ClinicalOptionsConfig {
  autoCalculate: boolean;
  enableRedFlagAlerts: boolean;
  viewMode: 'clinical' | 'academic';
  fib4CutoffStyle: 'age_adjusted' | 'standard';
}

export interface AppSettings {
  headerInfo: HospitalHeaderConfig;
  ulnStandard: UlnStandard;
  customUln: CustomUlnConfig;
  units: UnitConfig;
  clinicalOptions: ClinicalOptionsConfig;
}

export const DEFAULT_SETTINGS: AppSettings = {
  headerInfo: {
    hospitalName: 'Bệnh Viện Đa Khoa Trung Ương / Phòng Khám Chuyên Khoa',
    department: 'Khoa Tiêu Hóa - Gan Mật',
    doctorName: 'BS.CKII / TS.BS Phan Duy',
    doctorTitle: 'Bác sĩ chuyên khoa Gan Mật',
    licenseNumber: 'CCHN: 018429/BYT',
    showDoctorSignature: true,
    showOfficialStamp: true
  },
  ulnStandard: 'acg2017',
  customUln: {
    altMale: 33,
    altFemale: 25,
    astMale: 33,
    astFemale: 25,
    alp: 120,
    ggt: 50
  },
  units: {
    enzyme: 'u_l',
    bilirubin: 'mg_dl',
    albumin: 'g_dl'
  },
  clinicalOptions: {
    autoCalculate: true,
    enableRedFlagAlerts: true,
    viewMode: 'clinical',
    fib4CutoffStyle: 'age_adjusted'
  }
};

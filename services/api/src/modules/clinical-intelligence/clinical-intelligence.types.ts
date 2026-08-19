export interface PatientClinicalSummary {
  patientId: string;

  totalResults: number;

  normal: number;

  altered: number;

  critical: number;

  lastCollection?: Date;

  cardiovascularRisk?: string;

  diabetesRisk?: string;

  renalRisk?: string;

  hepaticRisk?: string;
}
// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/biotechnology/_mock/biotechnologyData.ts

export interface AssessmentCard {
  id: string;
  title: string;
  tag: string;
  subtitle: string;
  description: string;
  category: string;
}

// Base mock data - exact same cards for all sections
const baseCards: Omit<AssessmentCard, "category">[] = [
  {
    id: "a1",
    title: "Magstim TMS",
    tag: "TMS",
    subtitle: "Magstim/ Neurosoft",
    description: "Transcranial Magnetic Stimulation (clinical & research)",
  },
  {
    id: "a2",
    title: "Magstim TMS",
    tag: "TMS",
    subtitle: "Magstim/ Neurosoft",
    description: "Transcranial Magnetic Stimulation (clinical & research)",
  },
  {
    id: "a3",
    title: "Magstim TMS",
    tag: "TMS",
    subtitle: "Magstim/ Neurosoft",
    description: "Transcranial Magnetic Stimulation (clinical & research)",
  },
  {
    id: "a4",
    title: "Magstim TMS",
    tag: "TMS",
    subtitle: "Behavior Assessment System for Children",
    description: "Transcranial Magnetic Stimulation (clinical & research)",
  },
  {
    id: "a5",
    title: "Magstim TMS",
    tag: "TMS",
    subtitle: "Magstim/ Neurosoft",
    description: "Transcranial Magnetic Stimulation (clinical & research)",
  },
  {
    id: "a6",
    title: "Magstim TMS",
    tag: "TMS",
    subtitle: "Magstim/ Neurosoft",
    description: "Transcranial Magnetic Stimulation (clinical & research)",
  },
  {
    id: "a7",
    title: "Magstim TMS",
    tag: "TMS",
    subtitle: "Magstim/ Neurosoft",
    description: "Transcranial Magnetic Stimulation (clinical & research)",
  },
  {
    id: "a8",
    title: "Magstim TMS",
    tag: "TMS",
    subtitle: "Magstim/ Neurosoft",
    description: "Transcranial Magnetic Stimulation (clinical & research)",
  },
];

// Helper to assign categories
function createCardsWithCategories(categories: string[]): AssessmentCard[] {
  return baseCards.map((card, index) => ({
    ...card,
    category: categories[index % categories.length],
  }));
}

// Section 1: Diagnostic Imaging
export const diagnosticImagingCategories = [
  { id: "all", label: "All" },
  { id: "fMRI", label: "fMRI" },
  { id: "Diagnostic Ultrasounds", label: "Diagnostic Ultrasounds" },
  { id: "Fluoroscopy Stretchers", label: "Fluoroscopy Stretchers" },
  { id: "Other", label: "Other" },
] as const;

export const diagnosticImagingCards = createCardsWithCategories([
  "fMRI",
  "fMRI",
  "Diagnostic Ultrasounds",
  "Fluoroscopy Stretchers",
  "Other",
  "fMRI",
  "Diagnostic Ultrasounds",
  "Fluoroscopy Stretchers",
]);

// Section 2: Assessment Instruments (ECG, PSG, etc.)
export const assessmentInstrumentCategories = [
  { id: "all", label: "All" },
  { id: "ECG", label: "ECG" },
  { id: "PSG", label: "PSG" },
  { id: "EMG", label: "EMG" },
  { id: "IOM", label: "IOM" },
  { id: "ICP Monitors", label: "ICP Monitors" },
  { id: "TCD", label: "TCD" },
  { id: "Other", label: "Other" },
] as const;

export const assessmentInstrumentCards = createCardsWithCategories([
  "ECG",
  "PSG",
  "EMG",
  "IOM",
  "ICP Monitors",
  "TCD",
  "Other",
  "ECG",
]);

// Section 3: Experimental Apparatus
export const experimentalApparatusCategories = [
  { id: "all", label: "All" },
  { id: "Operant Testing Systems", label: "Operant Testing Systems" },
  { id: "Mazes", label: "Mazes" },
  { id: "Social Interaction Tests", label: "Social Interaction Tests" },
  { id: "Eye-Tracking/Pupillometry", label: "Eye-Tracking/Pupillometry" },
  { id: "Other", label: "Other" },
] as const;

export const experimentalApparatusCards = createCardsWithCategories([
  "Operant Testing Systems",
  "Mazes",
  "Social Interaction Tests",
  "Eye-Tracking/Pupillometry",
  "Other",
  "Operant Testing Systems",
  "Mazes",
  "Social Interaction Tests",
]);

// Section 4: General Lab and Clinical Infrastructure
export const labInfrastructureCategories = [
  { id: "all", label: "All" },
  { id: "Surgical Power Tools", label: "Surgical Power Tools" },
  { id: "Micromanipulators", label: "Micromanipulators" },
  { id: "Stereotaxic Frames", label: "Stereotaxic Frames" },
  { id: "Microinjection Systems", label: "Microinjection Systems" },
  { id: "Microscopes", label: "Microscopes" },
  { id: "Other", label: "Other" },
] as const;

export const labInfrastructureCards = createCardsWithCategories([
  "Surgical Power Tools",
  "Micromanipulators",
  "Stereotaxic Frames",
  "Microinjection Systems",
  "Microscopes",
  "Other",
  "Surgical Power Tools",
  "Micromanipulators",
]);

// Keep old exports for backward compatibility
export const assessmentCards = diagnosticImagingCards;
export const assessmentFilterCategories = diagnosticImagingCategories;
export type AssessmentFilterCategory =
  (typeof diagnosticImagingCategories)[number]["id"];

export const filterCategories = [
  { id: "all", label: "All" },
  { id: "brain-scanners", label: "Brain Scanners" },
  { id: "physiological-monitoring", label: "Physiological Monitoring Devices" },
] as const;

export type FilterCategory = (typeof filterCategories)[number]["id"];

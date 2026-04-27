export interface EquipmentCard {
  id: string;
  image: string;
  title: string;
  manufacturer: string;
  description: string;
  category: "all" | "brain-scanners" | "physiological-monitoring";
}
export interface AssessmentCard {
  id: string;
  title: string;
  tag: string;
  subtitle: string;
  description: string;
  category:
    | "all"
    | "intelligence-cognitive"
    | "personality"
    | "neuropsychological"
    | "emotional-behavioral";
}
export interface ApparatusCard {
  id: string;
  image: string;
  title: string;
  tag: string;
  manufacturer: string;
  description: string;
  category:
    | "all"
    | "stimulus-generation"
    | "response-recording"
    | "motor-sensory";
}
export interface LabInfrastructureCard {
  id: string;
  icon: string;
  title: string;
  tag: string;
  description: string;
  category: "all" | "general-supplies" | "environmental-controls";
}
export const equipmentCards: EquipmentCard[] = [
  {
    id: "1",
    image: "/xray.jpg",
    title: "MP160 System with AcqKnowledge",
    manufacturer: "BioPac Systems",
    description: "Wireless physiological monitoring (ECG, EMG, EDA/GSR)",
    category: "physiological-monitoring",
  },
  {
    id: "2",
    image: "/xray.jpg",
    title: "MP160 System with AcqKnowledge",
    manufacturer: "Siemens Healthineers",
    description:
      "High-resolution functional brain imaging with real-time analysis",
    category: "brain-scanners",
  },
  {
    id: "3",
    image: "/xray.jpg",
    title: "MP160 System with AcqKnowledge",
    manufacturer: "Brain Products",
    description: "64-channel active electrode system for cognitive research",
    category: "brain-scanners",
  },
  {
    id: "4",
    image: "/xray.jpg",
    title: "MP160 System with AcqKnowledge",
    manufacturer: "Brain Products",
    description: "Wearable eye tracking for natural behavior studies",
    category: "physiological-monitoring",
  },
];

export const filterCategories = [
  { id: "all", label: "All" },
  { id: "brain-scanners", label: "Brain Scanners" },
  { id: "physiological-monitoring", label: "Physiological Monitoring Devices" },
] as const;

export type FilterCategory = (typeof filterCategories)[number]["id"];

export const assessmentCards: AssessmentCard[] = [
  {
    id: "a1",
    title: "Rorschach",
    tag: "Projective",
    subtitle: "Rorschach Inkblot Test",
    description: "Exner or R-PAS system for personality assessment",
    category: "personality",
  },
  {
    id: "a2",
    title: "WAIS-IV",
    tag: "Cognitive",
    subtitle: "Wechsler Adult Intelligence Scale",
    description: "Comprehensive measure of cognitive ability in adults",
    category: "intelligence-cognitive",
  },
  {
    id: "a3",
    title: "MMPI-3",
    tag: "Clinical",
    subtitle: "Minnesota Multiphasic Personality Inventory",
    description: "Widely used psychometric test for adult psychopathology",
    category: "personality",
  },
  {
    id: "a4",
    title: "BASC-3",
    tag: "Behavioral",
    subtitle: "Behavior Assessment System for Children",
    description: "Comprehensive set of rating scales for behavioral assessment",
    category: "emotional-behavioral",
  },
  {
    id: "a5",
    title: "WCST",
    tag: "Executive",
    subtitle: "Wisconsin Card Sorting Test",
    description: "Measures executive function and cognitive flexibility",
    category: "neuropsychological",
  },
  {
    id: "a6",
    title: "TAT",
    tag: "Projective",
    subtitle: "Thematic Apperception Test",
    description: "Reveals underlying motives, concerns, and social perceptions",
    category: "personality",
  },
  {
    id: "a7",
    title: "RBANS",
    tag: "Screening",
    subtitle: "Repeatable Battery for Neuropsychological Status",
    description: "Brief cognitive screening for dementia and disorders",
    category: "neuropsychological",
  },
  {
    id: "a8",
    title: "Conners-4",
    tag: "ADHD",
    subtitle: "Conners' Rating Scales",
    description: "Assessment for ADHD and related behavioral disorders",
    category: "emotional-behavioral",
  },
];

export const assessmentFilterCategories = [
  { id: "all", label: "All" },
  { id: "intelligence-cognitive", label: "Intelligence and Cognitive Tests" },
  { id: "personality", label: "Personality Assessments" },
  { id: "neuropsychological", label: "Neuropsychological assessment" },
  { id: "emotional-behavioral", label: "Emotional and Behavioral evaluations" },
] as const;

export type AssessmentFilterCategory =
  (typeof assessmentFilterCategories)[number]["id"];

export const apparatusCards: ApparatusCard[] = [
  {
    id: "ap1",
    image: "/lab.jpg",
    title: "EyeLink 1000 Plus",
    tag: "Eye Tracking",
    manufacturer: "SR Research",
    description: "High-precision eye tracking for reading & cognition",
    category: "response-recording",
  },
  {
    id: "ap2",
    image: "/lab.jpg",
    title: "PsychoPy",
    tag: "Stimulus",
    manufacturer: "Open Science Tools",
    description: "Open-source stimulus presentation and experimental control",
    category: "stimulus-generation",
  },
  {
    id: "ap3",
    image: "/lab.jpg",
    title: "Cedrus RB Series",
    tag: "Response",
    manufacturer: "Cedrus Corporation",
    description: "Millisecond-accurate response pads for behavioral research",
    category: "response-recording",
  },
  {
    id: "ap4",
    image: "/lab.jpg",
    title: "BioPac MP160",
    tag: "Motor",
    manufacturer: "BioPac Systems",
    description: "Multi-channel physiological and motor response recording",
    category: "motor-sensory",
  },
  {
    id: "ap5",
    image: "/lab.jpg",
    title: "E-Prime 4.0",
    tag: "Stimulus",
    manufacturer: "Psychology Software Tools",
    description: "Professional stimulus presentation and experiment design",
    category: "stimulus-generation",
  },
  {
    id: "ap6",
    image: "/lab.jpg",
    title: "Serial Response Box",
    tag: "Response",
    manufacturer: "Psychology Software Tools",
    description: "Precision response timing for reaction time experiments",
    category: "response-recording",
  },
  {
    id: "ap7",
    image: "/lab.jpg",
    title: "Force Transducer",
    tag: "Motor",
    manufacturer: "ADInstruments",
    description: "Precise measurement of grip strength and motor control",
    category: "motor-sensory",
  },
  {
    id: "ap8",
    image: "/lab.jpg",
    title: "Psychtoolbox",
    tag: "Stimulus",
    manufacturer: "PTB Developers",
    description:
      "Free MATLAB toolbox for visual and auditory stimulus generation",
    category: "stimulus-generation",
  },
];

export const apparatusFilterCategories = [
  { id: "all", label: "All" },
  { id: "stimulus-generation", label: "Stimulus Generation Instrument" },
  { id: "response-recording", label: "Response Recording Instruments" },
  { id: "motor-sensory", label: "Motor Sensory equipment" },
] as const;

export type ApparatusFilterCategory =
  (typeof apparatusFilterCategories)[number]["id"];

export const labInfrastructureCards: LabInfrastructureCard[] = [
  {
    id: "l1",
    icon: "/public/svgIcons/fileIcon.svg",
    title: "Stimulus Card Sets",
    tag: "Materials",
    description:
      "Standardized visual stimuli, flashcards, and testing materials",
    category: "general-supplies",
  },
  {
    id: "l2",
    icon: "/fileIcon.svg",
    title: "Sound-Attenuating Chambers",
    tag: "Environmental",
    description:
      "Acoustic isolation booths for auditory and behavioral testing",
    category: "environmental-controls",
  },
  {
    id: "l3",
    icon: "/fileIcon.svg",
    title: "Response Pads & Keyboards",
    tag: "Hardware",
    description: "Precision input devices for reaction time experiments",
    category: "general-supplies",
  },
  {
    id: "l4",
    icon: "/fileIcon.svg",
    title: "Lighting Control Systems",
    tag: "Environmental",
    description: "Programmable ambient lighting for chronobiology research",
    category: "environmental-controls",
  },
  {
    id: "l5",
    icon: "/fileIcon.svg",
    title: "Observational Mirrors",
    tag: "Hardware",
    description: "One-way mirrors for behavioral observation setups",
    category: "general-supplies",
  },
  {
    id: "l6",
    icon: "/fileIcon.svg",
    title: "Temperature Controllers",
    tag: "Environmental",
    description: "Precise environmental control for animal research facilities",
    category: "environmental-controls",
  },
  {
    id: "l7",
    icon: "/fileIcon.svg",
    title: "EEG Consumables",
    tag: "Supplies",
    description: "Electrode gels, caps, and cleaning solutions",
    category: "general-supplies",
  },
  {
    id: "l8",
    icon: "/fileIcon.svg",
    title: "Faraday Cages",
    tag: "Environmental",
    description: "Electromagnetic shielding for sensitive electrophysiology",
    category: "environmental-controls",
  },
];

export const labInfrastructureFilterCategories = [
  { id: "all", label: "All" },
  { id: "general-supplies", label: "General Supplies" },
  { id: "environmental-controls", label: "Environmental Controls" },
] as const;

export type LabInfrastructureFilterCategory =
  (typeof labInfrastructureFilterCategories)[number]["id"];

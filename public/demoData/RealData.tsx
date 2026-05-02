export const degreeOptions = [
  { value: "High School", label: "High School" },
  { value: "Associates Degree", label: "Associates Degree" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: "PsyD", label: "PsyD" },
  { value: "PhD", label: "PhD" },
  { value: "DO", label: "DO" },
  { value: "MD", label: "MD" },
  { value: "MD-DO", label: "MD-DO" },
  { value: "MD-PhD", label: "MD-PhD" },
  { value: "Other", label: "Other" },
];

export const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((month) => ({ value: month, label: month }));

export const yearOptions = [
  "2027",
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
].map((year) => ({ value: year, label: year }));

export const employmentTypeOptions = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Self-employed", label: "Self-employed" },
  { value: "Freelance", label: "Freelance" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Apprenticeship", label: "Apprenticeship" },
  { value: "Seasonal", label: "Seasonal" },
];



export const locationTypeOptions = [
  { value: "On-site", label: "On-site" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Remote", label: "Remote" },
];



export const monthAliasMap: Record<string, string> = {
  jan: "January",
  january: "January",
  feb: "February",
  february: "February",
  mar: "March",
  march: "March",
  apr: "April",
  april: "April",
  may: "May",
  jun: "June",
  june: "June",
  jul: "July",
  july: "July",
  aug: "August",
  august: "August",
  sep: "September",
  sept: "September",
  september: "September",
  oct: "October",
  october: "October",
  nov: "November",
  november: "November",
  dec: "December",
  december: "December",
};
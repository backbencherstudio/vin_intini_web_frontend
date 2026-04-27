
export interface PublicationCard {
  id: string;
  journal: string;
  tag: string;
  title: string;
  date: string;
  meta: string;
}

// 8 identical items
export const publicationsData: PublicationCard[] = Array.from(
  { length: 8 },
  (_, i) => ({
    id: `p${i + 1}`,
    journal: "Psychological Science",
    tag: "TMS",
    title:
      "Verbal fluency selectively predicts survival in old and very old age",
    date: "Feb 2026",
    meta: "Most downloaded APS article of 2025",
  }),
);

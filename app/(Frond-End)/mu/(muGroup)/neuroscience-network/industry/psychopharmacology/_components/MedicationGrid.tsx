import { medicationCards } from "../_mock/psychopharmacologyData";
import { MedicationCard } from "./MedicationCard";

export const MedicationGrid = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {medicationCards.map((card) => (
        <MedicationCard key={card.id} card={card} />
      ))}
    </div>
  );
};

import CustomTitleDescription from '@/components/reusable/dashboard/CustomTitleDes'
import { PlusIcon } from 'lucide-react'
import FilterTabs from '@/components/reusable/dashboard/FilterTabs';
import CustomButton from '@/components/reusable/dashboard/CustomButton';
import PsychologySectionCard, { PsychologySection } from './PsychologySectionCard';

interface PsychologyStructurePageProps {
    activeTab?: string;
}

const sections: PsychologySection[] = [
    {
        id: "experimental-tools",
        category: "biotechnology",
        categoryLabel: "Biotechnologies",
        title: "Experimental Tools for Behavioral and Cognitive Studies",
        subsections: [
            "Stimulus Generation Tools",
            "Response Measurement Devices",
            "Motor Sensory Equipment",
        ],
        hasMore: true,
    },
    {
        id: "laboratory-setup",
        category: "biotechnology",
        categoryLabel: "Biotechnologies",
        title: "General Laboratory and Clinical Setup",
        subsections: [
            "General Supplies",
            "Environmental Control Systems",
        ],
    },
    {
        id: "assessment-tools",
        category: "psychotropics",
        categoryLabel: "Psychotropics",
        title: "Psychological Assessment Tools",
        subsections: [
            "Cognitive and Intelligence Assessments",
            "Personality Evaluation Tools",
            "Neuropsychological Evaluation Tools",
        ],
        hasMore: true,
    },
];

export default function PsychologyStructurePage({
    activeTab = "all",
}: PsychologyStructurePageProps) {

    const tabs = [
        { id: "all", label: "All" },
        { id: "biotechnology", label: "Biotechnology" },
        { id: "psychotropics", label: "Psychotropics" },
    ];
    const visibleSections = activeTab === "all"
        ? sections
        : sections.filter((section) => section.category === activeTab);

    return (
        <>

            <div className=' pb-4 border-b border-[#E0E0E0]'>
                <CustomTitleDescription
                    title="Psychology Structure"
                    description="Manage your industry sections and tabs."
                    action={
                        <CustomButton size="lg">
                            <PlusIcon className="h-4 w-4" />
                            Add New Section
                        </CustomButton>
                    }
                />
            </div>



            <FilterTabs tabs={tabs} paramKey="tab" className="my-4" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleSections.map((section) => (
                    <PsychologySectionCard key={section.id} section={section} />
                ))}
            </div>


        </>
    )
}

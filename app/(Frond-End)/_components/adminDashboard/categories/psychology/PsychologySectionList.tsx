"use client";

import { useState } from "react";
import PsychologySectionCard, { PsychologySection } from "./PsychologySectionCard";
import ViewSectionDetailsModal from "./ViewSectionDetailsModal";
import CreateTabModal from "./CreateTabModal";

interface PsychologySectionListProps {
    sections: PsychologySection[];
    activeTab?: string;
}

export default function PsychologySectionList({
    sections: initialSections,
    activeTab = "all",
}: PsychologySectionListProps) {
    
    const [sections, setSections] = useState(initialSections);
    const visibleSections =
        activeTab === "all"
            ? sections
            : sections.filter((section) => section.category === activeTab);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [tabModalOpen, setTabModalOpen] = useState(false);
    const [editingTab, setEditingTab] = useState<string | undefined>();

    const selectedSection =
        sections.find((section) => section.id === selectedSectionId) ?? null;

    const openDetails = (section: PsychologySection) => {
        setSelectedSectionId(section.id);
        setDetailsOpen(true);
    };

    const openCreateTab = (section?: PsychologySection) => {
        if (section) setSelectedSectionId(section.id);
        setEditingTab(undefined);
        setTabModalOpen(true);
    };

    const openEditTab = (section: PsychologySection | string, tabName?: string) => {
        if (typeof section === "string") {
            setEditingTab(section);
        } else {
            setSelectedSectionId(section.id);
            setEditingTab(tabName);
        }
        setTabModalOpen(true);
    };

    const handleSaveTab = (tabName: string) => {
        if (!selectedSectionId) return;

        setSections((prev) =>
            prev.map((section) => {
                if (section.id !== selectedSectionId) return section;

                if (editingTab) {
                    return {
                        ...section,
                        subsections: section.subsections.map((item) =>
                            item === editingTab ? tabName : item,
                        ),
                    };
                }

                return {
                    ...section,
                    subsections: [...section.subsections, tabName],
                    hasMore: section.subsections.length + 1 > 3,
                };
            }),
        );
    };

    const handleDeleteTab = (
        sectionOrTabName: PsychologySection | string,
        tabName?: string,
    ) => {
        const sectionId =
            typeof sectionOrTabName === "string"
                ? selectedSectionId
                : sectionOrTabName.id;
        const name =
            typeof sectionOrTabName === "string" ? sectionOrTabName : tabName;

        if (!sectionId || !name) return;

        setSections((prev) =>
            prev.map((section) =>
                section.id === sectionId
                    ? {
                          ...section,
                          subsections: section.subsections.filter(
                              (item) => item !== name,
                          ),
                      }
                    : section,
            ),
        );
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleSections.map((section) => (
                    <PsychologySectionCard
                        key={section.id}
                        section={section}
                        onCreateTab={openCreateTab}
                        onSeeMore={openDetails}
                        onEditTab={openEditTab}
                        onDeleteTab={handleDeleteTab}
                    />
                ))}
            </div>

            <ViewSectionDetailsModal
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                section={selectedSection}
                onEditTab={(tabName) => {
                    if (selectedSection) openEditTab(selectedSection, tabName);
                }}
                onDeleteTab={(tabName) => {
                    if (selectedSection) handleDeleteTab(selectedSection, tabName);
                }}
            />

            <CreateTabModal
                open={tabModalOpen}
                onOpenChange={setTabModalOpen}
                initialValue={editingTab}
                onSubmit={handleSaveTab}
            />
        </>
    );
}

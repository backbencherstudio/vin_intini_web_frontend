"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        id: "1",
        question: "What is Mind Unite?",
        answer: "Mind Unite is a professional networking and collaboration platform designed for individuals and organizations to connect, grow, and succeed together.",
    },
    {
        id: "2",
        question: "Who can join Mind Unite?",
        answer: "Anyone can join Mind Unite — students, professionals, entrepreneurs, freelancers, and organizations.",
    },
    {
        id: "3",
        question: "What membership plans are available?",
        answer: "Mind Unite offers Standard, Premium, and Industry Pro memberships. Each plan provides different levels of networking, collaboration, job, and business features.",
    },
    {
        id: "4",
        question: "How do I apply for jobs on Mind Unite?",
        answer: "You can browse available jobs in the Jobs section and apply directly through your profile with one click.",
    },
    {
        id: "5",
        question: "How can I connect with other professionals?",
        answer: "You can send connection requests, join communities, participate in discussions, and attend virtual events.",
    },
    {
        id: "6",
        question: "Can organizations post jobs or advertise products?",
        answer: "Yes, organizations can post jobs and advertise products/services through our Business & Enterprise plans.",
    },
    {
        id: "7",
        question: "How can I contact the Mind Unite support team?",
        answer: "You can reach our support team via the Help Center, email at support@mindunite.com, or through live chat.",
    },
];

export default function FAQ() {
    return (
        <div className="w-full py-8 md:py-12 lg:py-25 ">
            <div className="mx-auto ">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-primaryColor text-xl font-semibold leading-5 ">FAQ's</p>
                    <h2 className="text-center text-black text-3xl md:text-4xl lg:text-5xl font-semibold leading-[130%] mt-4">
                        Frequently Asking Questions
                    </h2>
                </div>

                {/* FAQ Accordion */}
                <Accordion type="single" collapsible defaultValue="item-3" className="space-y-3">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={faq.id}
                            value={`item-${faq.id}`}
                            className="border border-gray-100 rounded-sm overflow-hidden data-[state=open]:bg-[#ECEFF3]"
                        >
                            <AccordionTrigger className="px-8 py-4 text-left hover:no-underline text-[20px] font-semibold leading-[26px] text-[#1D1F2C]">
                                {index + 1}. {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6 text-[16px] leading-[24px] text-[#777980]">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
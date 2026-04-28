"use client"

import { IoMenu } from "react-icons/io5";
import Sidebar from "./Sidebar";
import { useState } from "react";


export default function StateLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    return (
        <div className="relative grid xl:grid-cols-[auto_1fr] grid-rows-[auto_1fr] xl:grid-rows-1 h-full min-h-0">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="xl:hidden h-fit">
                <div className="flex justify-end">
                    <button type="button" onClick={()=>setIsOpen(prev => !prev)} className="relative cursor-pointer">
                        <IoMenu className="text-3xl text-headerColor" />
                    </button>
                </div>
            </div>
            <div className="h-full grid">
                {children}
            </div>
        </div>
    )
}
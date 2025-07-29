import React from "react";

interface ContentContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function ContentContainer({ children, className=''}: ContentContainerProps) {
    return (
        <div
            className={`
                w-11/12 md:w-3/4 lg:w-2/3 xl:max-w-6xl
                min-h-[300px]
                p-6 sm:p-8
                bg-slate-800/60
                backdrop-filter backdrop-blur-lg
                rounded-2xl
                shadow-xl
                ${className}`
            }
            >
                {children}
        </div>
    );
}
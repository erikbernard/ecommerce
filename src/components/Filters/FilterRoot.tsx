import type { ReactNode } from "react";

export const FilterRoot = ({ children }: { children: ReactNode }) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                {children}
            </div>
        </div>
    );
};
'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

interface SearchInputProps {
    onSearchChange?: (query: string) => void; //TODO front-back
    className?: string;
}

export default function SearchInput({ onSearchChange, className='' }: SearchInputProps) {
    const [query, setQuery] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value;
        setQuery(newQuery);
        if (onSearchChange) {
            onSearchChange(newQuery);
        }
    };

    return (
        <div className={`relative flex items-center ${className}`}>
            <input 
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder='busca por título'
                className="
                    w-full
                    py-1.5 pl-10 pr-4
                    text-neutral-800
                    bg-white/20
                    border border-neutral-600
                    rounded-4xl
                    focus:ring-2 focus: ring-sky-500
                    focus:border-sky-500
                    focus:outline-none
                    placeholder:text-neutral-400
                    font-sans
                    "
             />
            <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400"/>
            </div>
        </div>
       )
}
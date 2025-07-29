import Image from 'next/image';
import React from 'react';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface MovieCardProps {
    id: number | string;
    title: string;
    posterUrl: string;
    isActive?: boolean;
    onCardClick?: (id: number | string) => void;
    onViewDetailsClick?: (id: number | string) => void;
    onEditClick?: (id: number | string) => void;
    onDeleteClick?: (id: number | string) => void;
}

export default function MovieCard({ id, title, posterUrl, isActive = false, onCardClick,onViewDetailsClick,onEditClick,onDeleteClick }: MovieCardProps) {
    
    const handleCardBaseClick = () => {
        if (onCardClick) {
            onCardClick(id);
        }
    };
    const handleIconClick = (e: React.MouseEvent, action?: (id: number | string) => void) => {
        e.stopPropagation();
        if (action) {
            action(id);
        }
    };
    const cardCursorClass = onCardClick ? 'cursor-pointer' : '';
    return (
        <div 
            className={`
                group
                relative
                aspect-[2/3]
                w-full
                bg-neutral-800
                overflow-hidden
                shadow-lg
                transition-all duration-300 ease-in-out
                ${isActive ? 'scale-105 shadow-2xl' : `hover:scale-105 hover:shadow-2xl`}
                ${cardCursorClass}
            `}
            onClick={handleCardBaseClick}
            role={onCardClick ? 'button' : undefined}
            tabIndex={onCardClick ? 0 : undefined}
            onKeyDown={onCardClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleCardBaseClick(); } : undefined}
        >
            <Image 
                src={posterUrl}
                alt={`Poster do filme ${title}`}
                fill
                className={`
                    object-cover
                    transition-all duration-300 ease-in-out
                    ${isActive ? 'filter blur-sm' : 'group-hover:opacity-80'}
                `}
                priority // se for para os primeiros filmes vísiveiis (LCP)
            />
            {isActive && (
                <div className="flex flex-col absolute inset-0 items-center justify-center space-y-4 bg-black/50">
                    <div className="w-full flex justify-center">
                        <button
                            onClick={(e) => handleIconClick(e, onViewDetailsClick)}
                            className="p-3 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                            aria-label="Ver detalhes"
                            title='Ver detalhes'
                        >
                            <EyeIcon className="h-7 w-7 text-white" />
                        </button>
                    </div>
                    <div className='w-full flex justify-center'>
                        <button
                            onClick={(e) => handleIconClick(e, onEditClick)}
                            className="p-3 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                            aria-label="Editar"
                            title="Editar"
                        >
                            <PencilSquareIcon className="h-7 w-7 text-white" />
                        </button>
                        <button
                            onClick={(e) => handleIconClick(e, onDeleteClick)}
                            className="p-3 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                            aria-label="Deletar"
                            title="Deletar"
                        >
                            <TrashIcon className="h-7 w-7 text-white" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
'use client';

import React from 'react';
import BaseModal from './BaseModal'; 
import { FilmeData } from '@/types/filme.types'; 
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface MovieDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    movie: FilmeData | null;
}

export default function MovieDetailsModal({
    isOpen,
    onClose,
    movie,
}: MovieDetailsModalProps) {
    const t = useTranslations('DetailsModal');
    
    if (!movie) {
        return null;
    }

    const modalOverallBgWithOpacity = 'bg-neutral-900/85';
    const modalContentSolidBg = 'bg-neutral-900';

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className={`
                relative
                ${modalOverallBgWithOpacity}
                backdrop-filter backdrop-blur-md
                w-11/12 md:w-3/4 lg:w-[700px] xl:w-[800px] 2xl:w-[900px]
                max-h-[90vh]
                overflow-hidden
                rounded-2xl
                shadow-2xl
                text-white
                flex flex-col
                `}
            >
                <button
                    onClick={onClose}
                    className="
                        absolute
                        top-3
                        left-3
                        sm:top-4
                        sm:left-4
                        p-2
                        bg-black/40
                        rounded-full
                        hover:bg-white/20
                        transition-colors
                        z-30"
                    aria-label="Voltar e fechar modal"
                    title='Voltar'
                >
                    <ArrowLeftIcon className="h-6 w-6 text-white"/>
                </button>
                <div className='flex-grow overflow-y-auto'>
                    <div className='grid grid-cols-1 md:grid-cols-2'>
                        <div className='relative h-64 md:h-auto md:min-h-full'>
                            {movie.backdropUrl && (
                                <Image
                                    src={movie.backdropUrl}
                                    alt={`Cena do filme ${movie.titulo}`}
                                    fill
                                    className='object-cover'
                                    priority
                                />
                            )}
                            {/* Degradê para MOBILE (imagem em cima, texto embaixo) */}
                            <div
                                className="
                                    absolute
                                    inset-x-0
                                    bottom-0
                                    h-1/2
                                    bg-gradient-to-t
                                    from-neutral-900
                                    via-neutral-900/70
                                    to-transparent
                                    pointer-events-none
                                    md:hidden"
                            ></div>

                            {/* Degradê para DESKTOP (imagem à esquerda, texto à direita) */}
                            <div
                                className="absolute
                                    inset-y-0
                                    right-0
                                    w-1/2
                                    bg-gradient-to-r
                                    from-transparent
                                    via-neutral-900/20
                                    to-neutral-900
                                    pointer-events-none
                                    hidden
                                    md:block"
                            ></div>
                        </div>
                        <div className={`p-6 sm:p-8 ${modalContentSolidBg}`}>
                            <h2 className='text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 leading-tight pt-6 md:pt-0'>
                                {movie.titulo}
                            </h2>
                            <p className="text-sm text-neutral-400 mb-4">
                                {movie.ano && <span>{movie.ano}</span>}
                                {movie.duracao && <span className="ml-2">&bull; {movie.duracao} { t('minutes')}</span>}
                                {movie.classificacao && <span className="ml-2">&bull; {movie.classificacao}</span>}
                            </p>

                            {movie.sinopse && (
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold mb-1">{ t('synopsis')}</h3>
                                    <p className="text-neutral-300 text-sm leading-relaxed text-justify">{movie.sinopse}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mt-4">
                                {movie.diretor && <div><strong className="font-semibold text-neutral-200 block mb-0.5">{ t('director')}</strong> <span className="text-neutral-300">{movie.diretor}</span></div>}
                                {movie.genero && <div><strong className="font-semibold text-neutral-200 block mb-0.5">{ t('genre')}</strong> <span className="text-neutral-300">{movie.genero}</span></div>}
                                {movie.elenco && <div className="sm:col-span-2"><strong className="font-semibold text-neutral-200 block mb-0.5">{ t('cast')}</strong> <span className="text-neutral-300">{movie.elenco}</span></div>}
                                {movie.notaUsuario && <div><strong className="font-semibold text-neutral-200 block mb-0.5">{ t('rate')}</strong> <span className="text-neutral-300">{movie.notaUsuario}/5</span></div>}
                                {movie.dataAdicao && <div><strong className="font-semibold text-neutral-200 block mb-0.5">{ t('added')}</strong> <span className="text-neutral-300">{new Date(movie.dataAdicao).toLocaleDateString('pt-BR')}</span></div>}
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
} 
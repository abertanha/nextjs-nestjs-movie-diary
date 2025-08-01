"use client";

import React from "react";
import BaseModal from "./BaseModal";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Button from "../Button";
import { FilmeData } from "@/types/filme.types";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    movie: FilmeData | null;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    movie,
}: DeleteConfirmationModalProps) {
    if (!movie && isOpen) {
        console.warn('[DeleteModal] Aberto, mas sem dados do filme para exibir a mensagem.'); 
    }

    const movieTitle = movie?.titulo;
    const modalOverallBgWithOpacity = 'bg-neutral-900/85';

    console.log('[DeleteModal] Renderizando. Props recebidas -> isOpen:', isOpen, 'movie object:', movie, 'movieTitle derived:', movieTitle);

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            {movie ? (
                <div
                    className={`
                        relative
                        ${modalOverallBgWithOpacity}
                        backdrop-filter backdrop-blur-md
                        w-11/12 sm:w-auto sm:min-w-[360px] sm:max-w-md
                        p-6 sm:p-8
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
                                z-10
                                "
                        aria-label="Cancelar e fechar modal"
                        title="Cancelar"
                    >
                        <ArrowLeftIcon className="h-6 w-6 text-white"/>
                    </button>
                    <div className="text-center">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                            Confirmar Exclusão
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-300 mb-6 sm:mb-8">
                            Você confirma a exclusão de <strong className="font-semibold text-white"> {movieTitle} </strong>
                            do seu diário de filmes assistidos?
                        </p>
                        <div className="flex flex-clo sm:flex-row justify-center gap-3 sm:gap-4">
                            <Button
                                onClick={onClose}
                                variant="secondary"
                                className="w-full sm:w-auto"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={onConfirm}
                                variant="danger"
                                className="w-full sm:w-auto"
                            >
                                Excluir
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                null
            )}
        </BaseModal>
    );
}

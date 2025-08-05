'use client';

import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import { FilmeData } from "@/types/filme.types";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Button from "../Button";
import MovieForm, { MovieFormDataType, MovieFormErrors } from '../MovieForm';
import { useTranslations } from "next-intl";

interface EditMovieModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updateMovieData: FilmeData) => void;
    movie : FilmeData | null;
}


export default function EditMovieModal({
    isOpen,
    onClose,
    onSave,
    movie,
}: EditMovieModalProps) {
    const t = useTranslations('EditModal');
    const [formData, setFormData] = useState<MovieFormDataType | null>(null);
    const [originalMovieData, setOriginalMovieData] = useState<MovieFormDataType | null>(null);
    const [errors, setErrors] = useState<MovieFormErrors>({});

    useEffect(() => {
        if (movie) {
        const movieFormValues: MovieFormDataType = {
            titulo: movie.titulo,
            diretor: movie.diretor || '',
            ano: movie.ano === null ? undefined : movie.ano,
            genero: movie.genero || '',
            duracao: movie.duracao === null ? undefined : movie.duracao,
            elenco: movie.elenco || '',
            classificacao: movie.classificacao || '',
            sinopse: movie.sinopse || '',
            notaUsuario: movie.notaUsuario === null ? undefined : movie.notaUsuario,
        };
        setFormData(movieFormValues);
        setOriginalMovieData(movieFormValues);
        setErrors({}); // Limpa erros ao carregar novo filme
        } else {
        setFormData(null);
        setOriginalMovieData(null);
        setErrors({});
        }
    }, [movie]);

    if (!isOpen || !movie || !formData) {
        return null;
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        let processedValue: string | number | undefined = value;
        const targetInput = e.target as HTMLInputElement;

        if (targetInput.type === 'number') {
        processedValue = value === '' ? undefined : parseFloat(value);
        if (isNaN(processedValue as number)) {
            processedValue = undefined;
        }
        }
        setFormData(prev => (prev ? { ...prev, [name]: processedValue } : null));
        if (errors[name as keyof MovieFormErrors]) {
        setErrors(prev => ({...prev, [name]: undefined}));
        }
    };

    const handleReset = () => {
        setFormData(originalMovieData);
        setErrors({}); // Limpa erros ao resetar
    };

    // Função de validação
    const validate = (): boolean => {
          const newErrors: MovieFormErrors = {};
          const currentYear = new Date().getFullYear();
          
          // 1. title validation
          if (!formData.titulo.trim()) {
            newErrors.titulo = 'Movie title is mandatory.';
          }
    
          // 2. year validation
          if (formData.ano && (formData.ano < 1888 || formData.ano > currentYear + 1)) {
            newErrors.ano = `The year must be between 1888 and ${currentYear + 1}.`;
          }
    
          // 3. running time validation
          if (formData.duracao && formData.duracao <= 0) {
            newErrors.duracao = 'Duration must be a positive number in';
          }
    
          // 4. user note must be btw 0 and 5
          if (formData.notaUsuario && (formData.notaUsuario < 0 || formData.notaUsuario > 5)) {
            newErrors.notaUsuario = 'The note must not be less than 0 or greater than 5.';
          }
    
          setErrors(newErrors);
    
          return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isFormValid = validate();
      
        if (!isFormValid) {
            return;
        }
        if (formData && movie) {
            const updatedMovie: FilmeData = {
                ...movie, 
                ...formData, 
                ano: formData.ano === undefined ? null : formData.ano,
                duracao: formData.duracao === undefined ? null : formData.duracao,
                notaUsuario: formData.notaUsuario === undefined ? null : formData.notaUsuario,
            };
            onSave(updatedMovie);
        }
    };

    const movieTitle = movie?.titulo || 'filme';
    
    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div
                className={`
                relative
                bg-neutral-900/85
                backdrop-filter backdrop-blur-md
                w-11/12 md:w-3/4 lg:w-[700px] xl:max-w-3xl
                max-h-[90vh]
                overflow-hidden
                rounded-2xl
                shadow-2xl
                text-white
                flex flex-col
                `}
            >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-700">
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Voltar e fechar modal"
                    title="Voltar"
                >
                    <ArrowLeftIcon className="h-6 w-6 text-white" />
                </button>
                <h2 className="text-xl sm:text-2xl font-semibold text-center flex-grow pr-8 sm:pr-0">
                    { t('editing')} <span className="font-bold">{movieTitle}</span>
                </h2>
            </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex-grow overflow-y-auto">
          <MovieForm
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-neutral-700 mt-6">
            <Button type="button" onClick={handleReset} variant="secondary" className="w-full sm:w-auto">
              { t('reset')}
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              {t('save')}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}
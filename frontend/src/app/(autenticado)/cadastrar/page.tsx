"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback} from 'react';
import Link from 'next/link';
import ContentContainer from '@/components/ContentContainer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '@/components/Button';
import { FilmeData } from '@/types/filme.types';
import { FilmeDetalhado } from '@/types/filme.types';
import debounce from 'lodash.debounce';
import MovieForm, { MovieFormDataType, MovieFormErrors} from '@/components/MovieForm';
import api from '@/services/api';


type NewMovieFormData = Omit<FilmeData, 'id' | 'dataAdicao' | 'popularidade'>;

const initialFormData: NewMovieFormData = {
    titulo: '',
    diretor: '',
    ano: null, 
    genero: '',
    duracao: null,
    elenco: '',
    classificacao: '',
    sinopse: '',
    notaUsuario: null,
    posterUrl: null,
    backdropUrl: null,
};
  

export default function CadastrarPage() {
    const [formData, setFormData] = useState<NewMovieFormData>(initialFormData);
    const titleInputRef = useRef<HTMLInputElement>(null); 
    const [sugestoes, setSugestoes] = useState<FilmeDetalhado[]>([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [loadingSugestoes, setLoadingSugestoes] = useState(false); 
    const suggestionsContainerRef = useRef<HTMLDivElement>(null);
    const [errors, setErrors] = useState<MovieFormErrors>({});
    const { titulo, ...formDataSemTitulo } = formData; // Separa o título
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
      titleInputRef.current?.focus();
    }, []);
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          mostrarSugestoes &&
          suggestionsContainerRef.current &&
          !suggestionsContainerRef.current.contains(event.target as Node)
        ) {
          setMostrarSugestoes(false);
        }
      };
      if (mostrarSugestoes) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [mostrarSugestoes]);

    const handleBaseInputChange = (
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
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleTitleInputChangeAndSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setFormData(prev => ({ ...prev!, titulo: newTitle }));
        if (errors.titulo) {
          setErrors(prev => ({...prev, titulo: undefined}));
        }
        if (newTitle.length >= 3) { 
          setMostrarSugestoes(true); 
          debouncedFetchSuggestions(newTitle);
        } else {
          setMostrarSugestoes(false);
          setSugestoes([]);
        }
    };
    
    const handleTitleInputInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
        e.target.setCustomValidity('Por favor, informe o título do filme.');
    };
    const handleTitleInputForValidity = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.setCustomValidity(''); // Limpa validade customizada
    };
    
    const handleClearForm = () => {
      setFormData(initialFormData);
      setSugestoes([]);
      setMostrarSugestoes(false);
      setErrors({});
      titleInputRef.current?.focus();
    };

    // Função de validação (será implementada na próxima etapa)
    // const validate = (): boolean => {
    // // Lógica de validação virá aqui.
    //   setErrors({}); // Simula que não há erros por enquanto
    //   return true; // Retorna true para permitir o save por enquanto
    // };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSuccessMessage('');
      setSubmitError(null);
      
      if (!formData.titulo) {
        setSubmitError('O campo Título é obrigatório.');
        return;
      }

      setIsSubmitting(true);

      const payload: NewMovieFormData = {
        titulo: formData.titulo,
        diretor: formData.diretor || null,
        ano: formData.ano === undefined ? null : formData.ano, 
        genero: formData.genero || null,
        duracao: formData.duracao === undefined ? null : formData.duracao,
        elenco: formData.elenco || null,
        classificacao: formData.classificacao || null,
        sinopse: formData.sinopse || null,
        notaUsuario: formData.notaUsuario === undefined ? null : formData.notaUsuario,
        posterUrl: formData.posterUrl || null,
        backdropUrl: formData.backdropUrl || null,
      };

      try {
        const response = await api.post('/filme',payload);

        if(response.status === 201) {
          setSuccessMessage(`Movie "${response.data.titulo}" successfully registered!`);
          handleClearForm();
        }
      } catch (e: unknown) {
        console.error('Failed to register the movie:', e);
        const errorMessage = e instanceof Error ? e.message : 'Unknow error on registering the movie.';
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    };
    

    const fetchSuggestions = useCallback(async (query: string) => {
        // A lógica de >= 3 caracteres deve estar no 'onChange' que chama esta função.
        // Mas podemos manter uma guarda aqui também por segurança.
        // Se a query for muito curta, não fazemos nada.
        if (query.length < 3) {
            setSugestoes([]);
            setMostrarSugestoes(false);
            return;
        }

        setLoadingSugestoes(true);

        try {
          const response = await api.get(
            `/filme/tmdb/movie?titulo=${encodeURIComponent(query)}`
          );

          const data = response.data;

          if (data && data.data && data.data.results) {
            setSugestoes(data.data.results);
            // Mostrar o dropdown mesmo que os resultados estejam vazios para exibir a mensagem de "nenhum encontrado"
            setMostrarSugestoes(true);
          } else {
            setSugestoes([]);
            setMostrarSugestoes(true);
          }

        } catch (error: unknown) {
          console.error("Failed on search movie sugestions:", error);
          setSugestoes([]);
          setMostrarSugestoes(true); // Mantém aberto para mostrar mensagem de erro se desejar
        } finally {
          setLoadingSugestoes(false);
        }
      }, []);

    const debouncedFetchSuggestions = useMemo(
      () => debounce(fetchSuggestions, 500),
      [fetchSuggestions]
    );

    const handleSugestaoClick = (sugestao: FilmeDetalhado) => {
        console.log('Sugestão clicada:', sugestao);
        setFormData(prev => ({
          ...prev,
          titulo: sugestao.titulo,
          diretor: sugestao.diretor,
          ano: sugestao.ano ? parseInt(sugestao.ano, 10) : null,
          genero: sugestao.genero,
          duracao: sugestao.duracao ? parseInt(sugestao.duracao.split(' ')[0], 10) : null,
          elenco: sugestao.elenco,
          classificacao: sugestao.classificacao,
          sinopse: sugestao.sinopse,
          // posterUrl e backdropUrl da api TMDB:
          posterUrl: sugestao.posterUrl || null,
          backdropUrl: sugestao.backdropUrl || null,
          // Mantém a nota do usuário se já digitada antes da seleção, ou deixa para ser preenchida
          notaUsuario: prev.notaUsuario || null,
        }));
        setMostrarSugestoes(false);
        setSugestoes([]); 
      };
    

    const inputBaseClass = "w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:ring-sky-500 focus:border-sky-500 focus:outline-none";
    const labelBaseClass = "block mb-1.5 text-sm font-medium text-neutral-300";
    
    return (
      <div className="flex items-center justify-center min-h-screen py-10 px-4 sm:px-0">
        <ContentContainer className="flex flex-col w-11/12 md:w-3/4 lg:max-w-2xl xl:max-w-3xl">
          <div className="mb-6 sm:mb-8 relative">
            <Link href="/" className="absolute top-1/2 -translate-y-1/2 left-0 p-2 bg-black/20 hover:bg-white/20 rounded-full transition-colors" aria-label="Voltar para o menu principal" title="Voltar" >
              <ArrowLeftIcon className="h-6 w-6 text-white" />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center italic">
              Nova Entrada
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-1">
            <div className="relative mb-5" ref={suggestionsContainerRef}>
              <label htmlFor="titulo" className={labelBaseClass}>Título:</label>
              <input
                  type="text"
                  name="titulo"
                  id="titulo"
                  ref={titleInputRef}
                  value={titulo}
                  onChange={handleTitleInputChangeAndSearch}
                  className={`${inputBaseClass} ${errors.titulo ? 'border-red-500' : 'border-neutral-700'}`}
                  required
                  autoComplete="off"
                  onInvalid={handleTitleInputInvalid}
                  onInput={handleTitleInputForValidity}
              />
              {errors.titulo && <p className="mt-1 text-xs text-red-400">{errors.titulo}</p>}

              {loadingSugestoes && ( 
              <div className="absolute mt-1 text-sm text-sky-400/80 text-center italic font-bold"> buscando... </div> )}
              {!loadingSugestoes && mostrarSugestoes && sugestoes.length > 0 && (
                <ul className="absolute top-full left-0 right-0 z-10 mt-1 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg max-h-72 overflow-y-auto">
                  {sugestoes.map((sugestao, index) => (
                    <li
                      key={sugestao.id || index}
                      onClick={() => handleSugestaoClick(sugestao)}
                      className="px-4 py-2.5 text-sm text-neutral-200 hover:bg-sky-700 hover:text-white cursor-pointer border-b border-neutral-700/50 last:border-b-0"
                    >
                      <span className="font-semibold">{sugestao.titulo}</span>
                      {sugestao.ano && <span className="text-xs text-neutral-400 ml-2">({sugestao.ano})</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <MovieForm
                formData={{...formDataSemTitulo, titulo: titulo} as unknown as MovieFormDataType}
                handleInputChange={handleBaseInputChange}
                errors={errors} 
                hideTitleField={true}
            />
            {submitError && <p className="my-2 text-sm text-center text-red-400">{submitError}</p>}
            {successMessage && <p className="my-2 text-sm text-center text-green-400">{successMessage}</p>}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 mt-6 border-t border-neutral-700">
              <Button type="button" onClick={handleClearForm} variant="secondary" className="w-full sm:w-auto">
                Limpar Entrada
              </Button>
              <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Entrada'}
              </Button>
            </div>
          </form>
        </ContentContainer>
      </div>
    );
  }
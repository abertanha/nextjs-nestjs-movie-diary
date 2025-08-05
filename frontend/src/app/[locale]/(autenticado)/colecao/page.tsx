'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ContentContainer from "@/components/ContentContainer";
import SearchInput from "@/components/SearchInput";
import MovieCard from "@/components/MovieCard";
import MovieDetailsModal from '@/components/Modals/MovieDetailsModal';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal';
import EditMovieModal from '@/components/Modals/EditMovieModal';
import { FilmeData } from '@/types/filme.types';
import api from '@/services/api';
import { useTranslations } from 'next-intl';



export default function ColecaoPage() {
  const t = useTranslations('ColecaoPage');

  const [movies, setMovies] = useState<FilmeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeMovieId, setActiveMovieId] = useState<number | string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  //Estados para detalhes
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState<FilmeData | null>(null);
  
  //Estados para deleção
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<FilmeData | null>(null);

  //Estados para edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<FilmeData | null>(null);
  
  // Efeito para buscar os filmes da API quando o componente montar
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/filme');
        setMovies(response.data);
      } catch (e: unknown) {
        console.error("Faile to search for movies:", e);
        const errorMessage = e instanceof Error ? e.message : 'Error on loading movies.';
        setError(errorMessage);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  const testSearch = (query: string) => {
    setSearchQuery(query);
    setActiveMovieId(null);
  };

  const handleCardClick = (movieId: number | string) => {
    setActiveMovieId(prevId => prevId === movieId ? null : movieId);
  };

  const handleViewDetails = (movieId: number | string) => {
    const movieToShow = movies.find(movie => movie.id === movieId);
    if (movieToShow) {
      setSelectedMovieForDetails(movieToShow);
      setIsDetailsModalOpen(true);
      setActiveMovieId(null);
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedMovieForDetails(null); // Limpa o filme selecionado
  };

  const handleEdit = (movieId: number | string) => {
    const movieToUpdate = movies.find(movie => movie.id === movieId); // Usa o estado 'movies'
    if (movieToUpdate) {
      setMovieToEdit(movieToUpdate); 
      setIsEditModalOpen(true);      
      setActiveMovieId(null);    
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setMovieToEdit(null); 
  };

  const handleSaveMovie = async (updatedMovie: FilmeData) => {
    if (!updatedMovie || !updatedMovie.id) return;

    try {
      const response = await api.patch(`/filme/${updatedMovie.id}`, updatedMovie);

      const filmeSalvo: FilmeData = response.data;

      setMovies(prevMovies =>
        prevMovies.map(movie =>
          movie.id === filmeSalvo.id ? filmeSalvo : movie
        )
      );
      console.log('Movie updated with sucess:', filmeSalvo.titulo);

    } catch (error: unknown) {
      console.error("Failed to update the movie:", error);
    } finally {
      handleCloseEditModal();
  }
  };

  const handleDelete = (movieId: number | string) => {
    const movieToDel = movies.find(movie => movie.id === movieId);
    if (movieToDel) {
      setMovieToDelete(movieToDel); 
      setIsDeleteModalOpen(true); 
    };
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setMovieToDelete(null);
    setActiveMovieId(null);
  };

  const handleConfirmDelete = async () => {
   if (!movieToDelete) return;

    try{
      await api.delete(`/filme/${movieToDelete.id}`);
      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieToDelete.id));
      console.log('Movie record deleted with sucess:', movieToDelete.titulo);
    } catch (error:unknown) {
      console.error("Error on deleting the movie:", error);
    } finally {
      handleCloseDeleteModal();
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.titulo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <div className="flex flex-col items-center min-h-screen py-10 px-4 sm:px-0"> 
      <ContentContainer className="flex flex-col flex-grow w-11/12 md:w-full">
        <div className="mb-6 sm:mb-8 relative flex items-center justify-between"> 
          <Link 
              href="/" 
              className="p-2 -ml-2 sm:ml-0 rounded-full hover:bg-black/30 transition-colors" // Removido absolute, posicionado pelo flex
              aria-label="Voltar para o menu principal" 
              title="Voltar" 
            >
              <ArrowLeftIcon className="h-6 w-6 text-white" />
          </Link>
          <h1 className="text-3xl font-bold text-center text-white sm:text-4xl italic flex-grow px-4">
            {t('title')}
          </h1>
          <div className="mt-4 flex justify-end">
            <SearchInput
              onSearchChange={testSearch} //TODO
              className="w-full max-w-xs sm:max-w-xs md:max-w-xs" /* Define largura do input */
            />
          </div>
        </div>
        {isLoading && <p className="text-center text-sky-400">{t('loading')}</p>}
          {error && <p className="text-center text-red-400">{t('error')} {error}</p>}
          {!isLoading && !error && filteredMovies.length > 0 && (
            <div className="grid flex-grow grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id} 
                  title={movie.titulo}
                  posterUrl={movie.posterUrl || '/placeholder-poster.jpeg'} // Fallback para placeholder
                  isActive={activeMovieId === movie.id} 
                  onCardClick={handleCardClick} 
                  onViewDetailsClick={handleViewDetails}
                  onEditClick={handleEdit}
                  onDeleteClick={handleDelete}
                />
              ))}
            </div>
          )}
          {!isLoading && !error && filteredMovies.length === 0 && (
            <p className="text-center text-neutral-400 flex-grow flex items-center justify-center">
              {t('empty')}
            </p>
        )}
      </ContentContainer>
    </div>
    <MovieDetailsModal
      isOpen={isDetailsModalOpen}
      onClose={handleCloseDetailsModal}
      movie={selectedMovieForDetails}
    />

    <DeleteConfirmationModal
      isOpen={isDeleteModalOpen}
      onClose={handleCloseDeleteModal}
      onConfirm={handleConfirmDelete}
      movie={movieToDelete}
    />
    <EditMovieModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveMovie} 
        movie={movieToEdit}     
    />
  </>
  );
}

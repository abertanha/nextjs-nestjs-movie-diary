'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ContentContainer from "@/components/ContentContainer";
import SearchInput from "@/components/SearchInput";
import MovieCard from "@/components/MovieCard";
import MovieDetailsModal from '@/components/MovieDetailsModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import EditMovieModal from '@/components/EditMovieModal';
import { FilmeData } from '@/types/filme.types';
import { API_BASE_URL } from '../../../api.config';



export default function Home() {
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
        const response = await fetch(`${API_BASE_URL}/filme`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: FilmeData[] = await response.json();
        setMovies(data);
      } catch (e: unknown) {
        console.error("Falha ao buscar filmes:", e);
        const errorMessage = e instanceof Error ? e.message : 'Erro ao carregar filmes.';
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
      const response = await fetch(`${API_BASE_URL}/filme/${updatedMovie.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMovie),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar o filme.');
      }

      const filmeSalvo: FilmeData = await response.json();

      setMovies(prevMovies =>
        prevMovies.map(movie =>
          movie.id === filmeSalvo.id ? filmeSalvo : movie
        )
      );
      console.log('Filme atualizado com sucesso:', filmeSalvo.titulo);

    } catch (error: unknown) {
      console.error("Erro ao atualizar o filme:", error);
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
      const response = await fetch(`${API_BASE_URL}/filme/${movieToDelete.id}`, {
        method: 'DELETE',
      });
      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao deletar o filme.');
      }
      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieToDelete.id));
      console.log('Filme deletado com sucesso:', movieToDelete.titulo);
    } catch (error:unknown) {
      console.error("Error ao deletar o filme:", error);
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
            Consultar
          </h1>
          <div className="mt-4 flex justify-end">
            <SearchInput
              onSearchChange={testSearch} //TODO
              className="w-full max-w-xs sm:max-w-xs md:max-w-xs" /* Define largura do input */
            />
          </div>
        </div>
        {isLoading && <p className="text-center text-sky-400">Carregando filmes...</p>}
          {error && <p className="text-center text-red-400">Erro: {error}</p>}
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
              Nenhum filme cadastrado ou encontrado.
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

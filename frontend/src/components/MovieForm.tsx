import { useTranslations } from 'next-intl';
import React from 'react';

export interface MovieFormDataType {
  titulo: string;
  diretor: string;
  ano?: number | undefined;
  genero: string;
  duracao?: number | undefined;
  elenco: string;
  classificacao: string;
  sinopse: string;
  notaUsuario?: number | undefined;
}

export interface MovieFormErrors {
  titulo?: string;
  diretor?: string;
  ano?: string;
  genero?: string;
  duracao?: string;
  elenco?: string;
  classificacao?: string;
  sinopse?: string;
  notaUsuario?: string;
}

interface MovieFormProps {
  formData: MovieFormDataType;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: MovieFormErrors;
  titleInputRef?: React.RefObject<HTMLInputElement>;
  onTitleInputInvalid?: (e: React.InvalidEvent<HTMLInputElement>) => void;
  onTitleInput?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  hideTitleField?: boolean;
}

export default function MovieForm({
  formData,
  handleInputChange,
  errors,
  titleInputRef,
  onTitleInputInvalid,
  onTitleInput,
  hideTitleField = false
}: MovieFormProps) {
  const t = useTranslations('MovieForm');
  const inputBaseClass = "w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:ring-sky-500 focus:border-sky-500 focus:outline-none";
  const labelBaseClass = "block mb-1.5 text-sm font-medium text-neutral-300";

  return (
    <div className="space-y-5"> 
      {/* Título */}
      {!hideTitleField && (
        <div>
          <label htmlFor="titulo" className={labelBaseClass}>{t('title')}</label>
          <input
            type="text"
            name="titulo"
            id="titulo"
            ref={titleInputRef} 
            value={formData.titulo}
            onChange={onTitleInput || handleInputChange} 
            onInvalid={onTitleInputInvalid}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (onTitleInputInvalid) e.currentTarget.setCustomValidity('');
            }}
            className={`${inputBaseClass} ${errors.titulo ? 'border-red-500' : 'border-neutral-700'}`}
            required
            autoComplete='off'
          />
          {errors.titulo && <p className="mt-1 text-xs text-red-400">{errors.titulo}</p>}
        </div>
      )}

      {/* Layout de duas colunas para Diretor e Ano */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="diretor" className={labelBaseClass}>{t('director')}</label>
          <input
            type="text" name="diretor" id="diretor"
            value={formData.diretor} onChange={handleInputChange}
            className={`${inputBaseClass} ${errors.diretor ? 'border-red-500' : 'border-neutral-700'}`}
          />
          {errors.diretor && <p className="mt-1 text-xs text-red-400">{errors.diretor}</p>}
        </div>
        <div>
          <label htmlFor="ano" className={labelBaseClass}>{t('year')}</label>
          <input
            type="number" name="ano" id="ano"
            value={formData.ano ?? ''}
            onChange={handleInputChange}
            className={`${inputBaseClass} ${errors.ano ? 'border-red-500' : 'border-neutral-700'}`}
            placeholder="Ex: 1998"
          />
          {errors.ano && <p className="mt-1 text-xs text-red-400">{errors.ano}</p>}
        </div>
      </div>

      {/* Layout de duas colunas para Gênero e Duração */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="genero" className={labelBaseClass}>{t('genre')}</label>
          <input
            type="text" name="genero" id="genero"
            value={formData.genero} onChange={handleInputChange}
            className={`${inputBaseClass} ${errors.genero ? 'border-red-500' : 'border-neutral-700'}`}
          />
          {errors.genero && <p className="mt-1 text-xs text-red-400">{errors.genero}</p>}
        </div>
        <div>
          <label htmlFor="duracao" className={labelBaseClass}>{t('duration')}</label>
          <input
            type="number" name="duracao" id="duracao"
            value={formData.duracao ?? ''}
            onChange={handleInputChange}
            className={`${inputBaseClass} ${errors.duracao ? 'border-red-500' : 'border-neutral-700'}`}
            placeholder="Ex: 103"
          />
          {errors.duracao && <p className="mt-1 text-xs text-red-400">{errors.duracao}</p>}
        </div>
      </div>

      {/* Elenco */}
      <div>
        <label htmlFor="elenco" className={labelBaseClass}>{t('cast')}</label>
        <input
          type="text" name="elenco" id="elenco"
          value={formData.elenco} onChange={handleInputChange}
          className={`${inputBaseClass} ${errors.elenco ? 'border-red-500' : 'border-neutral-700'}`}
        />
        {errors.elenco && <p className="mt-1 text-xs text-red-400">{errors.elenco}</p>}
      </div>

      {/* Classificação */}
      <div>
        <label htmlFor="classificacao" className={labelBaseClass}>{t('classification')}</label>
        <input
          type="text" name="classificacao" id="classificacao"
          value={formData.classificacao} onChange={handleInputChange}
          className={`${inputBaseClass} ${errors.classificacao ? 'border-red-500' : 'border-neutral-700'}`}
          placeholder="Ex: 12 anos"
        />
        {errors.classificacao && <p className="mt-1 text-xs text-red-400">{errors.classificacao}</p>}
      </div>

      {/* Sinopse */}
      <div>
        <label htmlFor="sinopse" className={labelBaseClass}>{t('synopsis')}</label>
        <textarea
          name="sinopse" id="sinopse" rows={4}
          value={formData.sinopse} onChange={handleInputChange}
          className={`${inputBaseClass} ${errors.sinopse ? 'border-red-500' : 'border-neutral-700'}`}
        ></textarea>
        {errors.sinopse && <p className="mt-1 text-xs text-red-400">{errors.sinopse}</p>}
      </div>

      {/* Nota do Usuário */}
      <div>
        <label htmlFor="notaUsuario" className={labelBaseClass}>{t('rate')}</label>
        <input
          type="number" name="notaUsuario" id="notaUsuario"
          value={formData.notaUsuario ?? ''} onChange={handleInputChange}
          className={`${inputBaseClass} ${errors.notaUsuario ? 'border-red-500' : 'border-neutral-700'}`}
          step="0.1" min="0" max="5" placeholder="Ex: 4.7"
        />
        {errors.notaUsuario && <p className="mt-1 text-xs text-red-400">{errors.notaUsuario}</p>}
      </div>
    </div>
  );
}
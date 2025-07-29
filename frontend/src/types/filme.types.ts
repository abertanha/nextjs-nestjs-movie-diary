export interface FilmeData {
  // TO DO rever quando houver a integração back-front
  id: number | string; 
  titulo: string;
  diretor: string | null; 
  ano: number | null;
  genero: string | null;
  duracao: number | null; 
  elenco: string | null;
  classificacao: string | null; // is adult?
  sinopse: string | null; // overview do back end
  notaUsuario?: number | null;
  dataAdicao?: string | null;
  posterUrl: string | null; 
  backdropUrl: string | null;
}

// TO DO idem
export interface FilmeDetalhado {
  id: number;
  titulo: string;
  diretor: string;
  ano: string;
  genero: string;
  duracao: string;
  elenco: string;
  sinopse: string;
  classificacao: string;
  popularidade: number;
  posterUrl: string | null;
  backdropUrl: string | null;
}

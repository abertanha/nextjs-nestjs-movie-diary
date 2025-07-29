export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  release_date?: string;
  poster_path?: string | null;
  overview: string;
  popularity: number;
  adult: boolean;
}
export interface TMDBCastMember {
  name: string;
  popularity: number;
  known_for_department: string;
}

export interface TMDBMovieDetailsResponse {
  genres: { id: number; name: string }[];
  runtime: number;
  poster_path: string;
  backdrop_path: string;
}

export interface TMDBCreditsResponse {
  cast: TMDBCastMember[];
  crew: Array<{
    name: string;
    known_for_department: string;
    popularity: number;
  }>;
}
export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  genres: Array<{ name: string }>;
}
export interface CreditResult {
  directors: Array<{ name: string }>;
  actors: Array<{ name: string; popularity: number }>;
}

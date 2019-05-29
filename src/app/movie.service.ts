import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const API_KEY = "3a5ca36d8dd730e3aaf7c82c65feb5af";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
}

export interface MovieCast {
  id: number;
  name: string;
}

export interface MovieCredits {
  cast: MovieCast[];
}

export interface MovieResults {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  genre_ids: number[];
}

export interface MovieSearchResults {
  results: MovieResults[];
  page: number;
  total_results: number;
  total_pages: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenreResults {
  genres: Genre[];
}

const apiParams = { api_key: API_KEY };

@Injectable()
export class MovieService {
  
  constructor(private http: HttpClient) { }

  /// Observables ///

  public getMovieDetails(id: string | number) {
    return this.http.get<Movie>(`https://api.themoviedb.org/3/movie/${ id }`, { params: apiParams });
  }

  public getMovieCredits(id: string | number) {
    return this.http.get<MovieCredits>(`https://api.themoviedb.org/3/movie/${ id }/credits`, { params: apiParams });
  }

  public searchMovie(query: string, year?: number) {
    let params: any = { ...apiParams };

    if (!!query && query.length > 0) {
      params = { ...params, query };
    }

    if (!!year && year !== -1) {
      params = { ...params, year };
    }

    return this.http.get<MovieSearchResults>(`https://api.themoviedb.org/3/search/movie`, { params });
  }

  public getGenres() {
    return this.http.get<GenreResults>(`https://api.themoviedb.org/3/genre/movie/list`, { params: apiParams });
  }

  /// Promises ///

  public movieDetails(id: string | number) {
    return this.http
      .get<Movie>(`https://api.themoviedb.org/3/movie/${ id }`, { params: apiParams })
      .toPromise();
  }

  public movieCredits(id: string | number) {
    return this.http
      .get<MovieCredits>(`https://api.themoviedb.org/3/movie/${ id }/credits`, { params: apiParams })
      .toPromise();
  }

  public genres() {
    return this.http
      .get<GenreResults>(`https://api.themoviedb.org/3/genre/movie/list`, { params: apiParams })
      .toPromise();
  }

}

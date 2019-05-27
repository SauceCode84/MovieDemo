import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const API_KEY = "3a5ca36d8dd730e3aaf7c82c65feb5af";

export interface Movie {

}

export interface MovieCredits {
  cast: any[];
}

const apiParams = { api_key: API_KEY };

@Injectable()
export class MovieService {
  
  constructor(private http: HttpClient) { }

  public getMovieDetails(id: string | number) {
    return this.http.get<Movie>(`https://api.themoviedb.org/3/movie/${ id }`, { params: apiParams });
  }

  public getMovieCredits(id: string | number) {
    return this.http.get<MovieCredits>(`https://api.themoviedb.org/3/movie/${ id }/credits`, { params: apiParams });
  }

}

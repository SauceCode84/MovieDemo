import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const API_KEY = "3a5ca36d8dd730e3aaf7c82c65feb5af";

export interface TV {

}

@Injectable()
export class TVService {

  constructor(private http: HttpClient) { }

  public getTVDetails(id: string | number) {
    return this.http.get<TV>(`https://api.themoviedb.org/3/tv/${ id }`, { params: { api_key: API_KEY } });
  }

}

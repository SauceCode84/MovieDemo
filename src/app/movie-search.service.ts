import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, asyncScheduler, combineLatest, of, merge } from "rxjs";
import { distinctUntilChanged, switchMap, map, observeOn, shareReplay } from "rxjs/operators";

import { Genre, MovieService, MovieSearchResults, MovieResults } from "./movie.service";

interface MovieSearchCriteria {
  query: string;
  year: number;
}

const EMPTY_SEARCH_RESULTS: MovieSearchResults = {
  results: [],
  page: 0,
  total_results: 0,
  total_pages: 0
};

const EMPTY_SEARCH_CRITERIA: MovieSearchCriteria = {
  query: "",
  year: null
};

interface MovieSearchState {
  searchResults: MovieSearchResults;
  criteria: MovieSearchCriteria;
  loading: boolean;
}

@Injectable()
export class MovieSearchService {
  
  /// STATE MANAGEMENT ///
  // internal state
  private state: MovieSearchState = {
    searchResults: EMPTY_SEARCH_RESULTS,
    criteria: EMPTY_SEARCH_CRITERIA,
    loading: false
  };
  // internal store
  private store: BehaviorSubject<MovieSearchState> = new BehaviorSubject<MovieSearchState>(this.state);
  // internal state stream
  private state$ = this.store.asObservable().pipe(observeOn(asyncScheduler));

  /// PUBLIC OUTPUT STREAMS ///
  // output streams, based on state stream
  public searchResults$ = this.state$.pipe(map(state => state.searchResults), distinctUntilChanged());
  public query$ = this.state$.pipe(map(state => state.criteria.query), distinctUntilChanged());
  public year$ = this.state$.pipe(map(state => state.criteria.year), distinctUntilChanged());
  public loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
  
  // internal stream for querying
  private genres$: Observable<Genre[]>;
  
  constructor(private movieService: MovieService) {
    // initialise query
    this.genres$ = this.movieService.getGenres()
      .pipe(
        map(result => result.genres),
        shareReplay()
      );

    // config source stream based on search criteria
    combineLatest(this.query$, this.year$)
      .pipe(
        switchMap(([query, year]) => {
          if (!!query.length) {
            return this.searchMovie(query, year);
          }

          return of(EMPTY_SEARCH_RESULTS);
        })
      )
      .subscribe(searchResults => {
        this.updateState({
          ...this.state,
          searchResults,
          loading: false
        });
      });

    // this.state$.subscribe(state => console.log("state", state));
    
    // this.query$.subscribe(query => console.log("query", query));
    // this.searchResults$.subscribe(result => console.log("result", result));
    // this.loading$.subscribe(loading => console.log("loading", loading));
  }

  /// PUBLIC INPUT METHODS ///
  public updateQuery(query: string) {
    const criteria = { ...this.state.criteria, query };

    this.updateState({
      ...this.state,
      criteria,
      loading: true
    });
  }

  public updateYear(year: number) {
    const criteria = { ...this.state.criteria, year };

    this.updateState({
      ...this.state,
      criteria,
      loading: true
    });
  }

  // internal search stream
  private searchMovie(query: string, year: number) {
    return combineLatest(this.genres$, this.movieService.searchMovie(query, year))
      .pipe(
        map(([genres, movieSearchResults]) => {
          let results = movieSearchResults.results
            .map(withFullPosterPath)
            .map(mergeGenres(genres));

          return {
            ...movieSearchResults,
            results
          };
        })
      );
  }

  // internal state management
  private updateState(state: MovieSearchState) {
    this.state = state;
    this.store.next(this.state);
  }

}

const mergeGenres = (genres: Genre[]) => (result: MovieResults) => {
  return {
    ...result,
    genres: result.genre_ids.map(genre_id => genres.find(genre => genre.id == genre_id))
  };  
}

const withFullPosterPath = (result: MovieResults): MovieResults => {
  return {
    ...result,
    poster_path: `https://image.tmdb.org/t/p/w185_and_h278_bestv2${ result.poster_path }`
  };
}

import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormControl } from "@angular/forms";

import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { MovieSearchResults } from "../movie.service";
import { MovieSearchService } from "../movie-search.service";

@Component({
  selector: "app-movie-search",
  templateUrl: "./movie-search.component.html",
  styleUrls: ["./movie-search.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush   // change detection
})
export class MovieSearchComponent implements OnInit {

  searchMovie: FormControl;
  searchYear: FormControl;

  movieSearchResults$: Observable<MovieSearchResults>;
  
  constructor(private movieSearch: MovieSearchService) {
    this.searchMovie = new FormControl();
    this.searchYear = new FormControl();
  }

  ngOnInit() {
    // inputs
    this.searchMovie.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe(value => this.movieSearch.updateQuery(value));

    this.searchYear.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => this.movieSearch.updateYear(value));

    // outputs
    this.movieSearchResults$ = this.movieSearch.searchResults$;

    this.movieSearch.query$
      .subscribe(query => this.searchMovie.patchValue(query, { emitEvent: false }));

    this.movieSearch.year$
      .subscribe(year => this.searchYear.patchValue(year, { emitEvent: false }));
  }

}

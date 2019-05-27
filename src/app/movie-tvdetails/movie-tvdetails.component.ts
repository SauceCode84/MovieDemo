import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

import { Observable, empty, combineLatest } from "rxjs";
import { switchMap, map } from "rxjs/operators";

import { MovieService, Movie } from "../movie.service";
import { TVService, TV } from "../tv.service";

const backdropUrl = "http://image.tmdb.org/t/p/original/nGsNruW3W27V6r4gkyc3iiEGsKR.jpg";

type MovieTVType = "movie" | "tv";

@Component({
  selector: "movie-tv-details",
  templateUrl: "./movie-tvdetails.component.html",
  styleUrls: ["./movie-tvdetails.component.scss"]
})
export class MovieTVDetailsComponent implements OnInit {

  // backdropStyle: SafeStyle;
  details: any;
  // details$: Observable<Movie | TV>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private movieService: MovieService,
    private tvService: TVService) { }

  ngOnInit() {
    

    this.activatedRoute.params
      .pipe(
        switchMap((params: { type?: MovieTVType; id?: string | number; }) => {
          let { id } = params;

          return combineLatest(
            this.movieService.getMovieDetails(id),
            this.movieService.getMovieCredits(id)
          );
        }),
        map(([movie, credits]) => {
          const cast = credits.cast.slice(0, 5);

          return { ...movie, cast };
        })
      )
      .subscribe(details => {
        this.details = details;

        console.log(details);
      });

    // this.details$.subscribe(console.log);
  }

  public detailYear(releaseDate: string) {
    return new Date(releaseDate).getFullYear();
  }

  public get backdropStyle() {
    if (!!this.details) {
      return this.sanitizer.bypassSecurityTrustStyle(`--backdrop-image: url('http://image.tmdb.org/t/p/original${ this.details.backdrop_path }')`)
    }
  }

  public get posterUrl() {
    if (!!this.details) {
      return `https://image.tmdb.org/t/p/w300_and_h450_bestv2${ this.details.poster_path }`;
    }
  }
}

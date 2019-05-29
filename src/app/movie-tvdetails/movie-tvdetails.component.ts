import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";

import { combineLatest, Observable, Subscription } from "rxjs";
import { switchMap, map } from "rxjs/operators";

import { MovieService, Movie, MovieCredits } from "../movie.service";

type MovieTVType = "movies" | "tv";

@Component({
  selector: "movie-tv-details",
  templateUrl: "./movie-tvdetails.component.html",
  styleUrls: ["./movie-tvdetails.component.scss"]
})
export class MovieTVDetailsComponent implements OnInit, OnDestroy {
  
  details: Movie & MovieCredits;
  detailsSubscription: Subscription;
  
  // details$: Observable<Movie & MovieCredits>;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private movieService: MovieService) { }

  ngOnInit() {
    // this.detailsSubscription = this.activatedRoute.params
    //   .subscribe(async (params: { type?: MovieTVType; id?: string | number; }) => {
    //     let { type, id } = params;

    //     switch (type) {
    //       case "movies":
    //         let movie = await this.movieService.movieDetails(id);
            
    //         let credits = await this.movieService.movieCredits(id);
    //         let cast = credits.cast.slice(0, 5);

    //         this.details = { ...movie, cast };
    //         console.log(this.details);

    //       case "tv":
    //         // call services...
    //         // ...
    //     }
    //   });

    
    this.detailsSubscription = this.activatedRoute.params
      .pipe(
        switchMap((params: { type?: MovieTVType; id?: string | number; }) => {
          let { id, type } = params;

          switch (type) {
            case "movies":
              return combineLatest(
                this.movieService.getMovieDetails(id),
                this.movieService.getMovieCredits(id)
              );

            case "tv":
              // call services...
              // ...
          }
        }),
        map(([movie, credits]) => {
          const cast = credits.cast.slice(0, 5);

          return { ...movie, cast };
        })
      )
      .subscribe(details => this.details = details);

      /// ASYNC PIPE ///
      // this.details$ = this.activatedRoute.params
  }

  ngOnDestroy() {
    // this.detailsSubscription.unsubscribe();
  }

  public detailYear(releaseDate: string) {
    return new Date(releaseDate).getFullYear();
  }

  public backdropStyle(backdrop_path: string) {
    return this.sanitizer.bypassSecurityTrustStyle(`--backdrop-image: url('http://image.tmdb.org/t/p/original${ backdrop_path }')`)
  }

  public posterUrl(poster_path: string) {
    return `https://image.tmdb.org/t/p/w300_and_h450_bestv2${ poster_path }`;
  }
}

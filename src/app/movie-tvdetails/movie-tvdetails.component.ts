import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

const backdropUrl = "http://image.tmdb.org/t/p/original/nGsNruW3W27V6r4gkyc3iiEGsKR.jpg";

@Component({
  selector: "movie-tv-details",
  templateUrl: "./movie-tvdetails.component.html",
  styleUrls: ["./movie-tvdetails.component.scss"]
})
export class MovieTVDetailsComponent implements OnInit {

  backdropStyle: SafeStyle;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.backdropStyle = this.sanitizer.bypassSecurityTrustStyle(`--backdrop-image: url('${ backdropUrl }')`);
  }  

}

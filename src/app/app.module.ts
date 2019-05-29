import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MovieSearchComponent } from "./movie-search/movie-search.component";
import { MovieTVDetailsComponent } from "./movie-tvdetails/movie-tvdetails.component";

import { MovieService } from "./movie.service";
import { MovieSearchService } from "./movie-search.service";
import { TVService } from "./tv.service";

@NgModule({
  declarations: [
    AppComponent,
    MovieTVDetailsComponent,
    MovieSearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    MovieService,
    MovieSearchService,
    TVService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

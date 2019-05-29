import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MovieTVDetailsComponent } from "./movie-tvdetails/movie-tvdetails.component";
import { MovieSearchComponent } from "./movie-search/movie-search.component";

const routes: Routes = [
  { path: "movies/search", component: MovieSearchComponent },
  { path: ":type/:id", component: MovieTVDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

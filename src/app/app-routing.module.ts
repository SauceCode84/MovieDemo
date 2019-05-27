import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MovieTVDetailsComponent } from "./movie-tvdetails/movie-tvdetails.component";

const routes: Routes = [
  { path: ":type/:id", component: MovieTVDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

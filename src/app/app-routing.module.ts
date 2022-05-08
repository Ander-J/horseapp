import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { NewRaceComponent } from './new-race/new-race.component';
import { RaceViewComponent } from './race-view/race-view.component';
import { ResultsViewComponent } from './results-view/results-view.component';

const routes: Routes = [
  { path: 'main', component: MainPageComponent },
  { path: 'new', component: NewRaceComponent },
  { path: 'race/:id', component: RaceViewComponent },
  { path: 'results/:id', component: ResultsViewComponent },
  { path: '**', redirectTo: 'main', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

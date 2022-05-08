import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bet } from './model/bet';
import { Horse } from './model/horse';
import { Race } from './model/race';
import { Results } from './model/results';
import { BetService } from './services/bet.service';
import { HorseService } from './services/horse.service';
import { RaceService } from './services/race.service';
import { ResultsService } from './services/results.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'horseapp';
  raceData: Race[] = [];
  resultsData: Results[] = [];
  horseData: Horse[] = [];
  betData: Bet[] = [];

  constructor(private router: Router,
    private raceService: RaceService,
    private resultsService: ResultsService,
    private horseService: HorseService,
    private betService: BetService) { }

  navHome() {
    this.router.navigate(["main"])
  }

  ngOnInit(): void {
    this.horseService.updateFromDb().subscribe(horses => {
      this.horseData = horses
    });
    this.raceService.updateFromDb().subscribe(races => {
      this.raceData = races
    })
    this.resultsService.updateFromDb().subscribe(results => {
      this.resultsData = results
    });
    this.betService.updateFromDb().subscribe(bets => {
      this.betData = bets
    });
  }
}

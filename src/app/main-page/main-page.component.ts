import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Bet } from '../model/bet';
import { Horse } from '../model/horse';
import { Race } from '../model/race';
import { Results } from '../model/results';
import { BetService } from '../services/bet.service';
import { HorseService } from '../services/horse.service';
import { RaceService } from '../services/race.service';
import { ResultsService } from '../services/results.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  /* raceData: Race[] = this.raceService.getAll();
  resultsData: Results[] = this.resultsService.getAll();
  horseData: Horse[] = this.horseService.getAll();
  betData: Bet[] = this.betService.getAll(); */
  raceData: Race[] = [];
  resultsData: Results[] = [];
  horseData: Horse[] = [];
  betData: Bet[] = [];
  displayedColumns: string[] = ['id', 'track', 'date', 'buttons']
  isRaceInvisible: boolean = true;
  isResultsInvisible: boolean = true;

  constructor(private router: Router,
    private raceService: RaceService,
    private resultsService: ResultsService,
    private horseService: HorseService,
    private betService: BetService) { }


  @ViewChild(MatTable) raceTable: MatTable<Race>;
  @ViewChild(MatTable) resultsTable: MatTable<Results>;
  @ViewChild(MatTable) horseTable: MatTable<Horse>;

  ngOnInit(): void {
    this.updateAllData()
  }

  updateAllData() {
    this.horseService.updateFromDb().subscribe(horses => {
      this.horseData = horses
      this.horseTable.renderRows()
    });
    this.raceService.updateFromDb().subscribe(races => {
      this.raceData = races
      this.raceTable.renderRows()
    })
    this.resultsService.updateFromDb().subscribe(results => {
      this.resultsData = results
      this.resultsTable.renderRows()
    });
  }

  formatDate(date: string) {
    return new Date(date).toLocaleString()
  }

  newRace() {
    this.router.navigate(['/new'])
  }

  raceDetails(id: string) {
    var navString = 'race/'.concat(id)
    this.router.navigate([navString])
  }

  deleteRace(id: string) {
    this.raceService.delete(id).subscribe(() => {
      var count = 0;
      for (var data of this.raceData) {
        if (data.id == id) {
          this.raceData.splice(count, 1)
          this.raceTable.renderRows()
        }
        count++
      }
    })
  }

  deleteResult(id: string) {
    this.resultsService.delete(id).subscribe(() => {
      var count = 0;
      for (var data of this.resultsData) {
        if (data.id == id) {
          this.resultsData.splice(count, 1)
          this.resultsTable.renderRows()
        }
        count++
      }
    })
  }

  raceHover(id: string) {
    localStorage.setItem('raceId', id)
    this.raceVisible(true)
  }

  raceVisible(isVisible: boolean) {
    if (isVisible) {
      this.isRaceInvisible = true
    }
    this.isRaceInvisible = !this.isRaceInvisible
  }

  resultsHover(id: string) {
    localStorage.setItem('resultsId', id)
    this.resultsVisible(true)
  }

  resultsVisible(isVisible: boolean) {
    if (isVisible) {
      this.isResultsInvisible = true
    }
    this.isResultsInvisible = !this.isResultsInvisible
  }

}

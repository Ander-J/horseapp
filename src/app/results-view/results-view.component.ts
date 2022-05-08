import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Bet } from '../model/bet';
import { Horse } from '../model/horse';
import { Results } from '../model/results';
import { BetService } from '../services/bet.service';
import { HorseService } from '../services/horse.service';
import { ResultsService } from '../services/results.service';

@Component({
  selector: 'app-results-view',
  templateUrl: './results-view.component.html',
  styleUrls: ['./results-view.component.scss']
})
export class ResultsViewComponent implements OnInit {
  results: Results = new Results;
  id: string;
  bet: Bet;
  betHorse: Horse;
  horses: Horse[];
  /* betPlaced: boolean = false; */
  displayedColumns: string[] = ['id', 'name', 'color']

  @ViewChild(MatTable) horseTable: MatTable<Horse>;

  constructor(private resultsService: ResultsService,
    private horseService: HorseService,
    private betService: BetService) { }

  ngOnInit(): void {
    this.id = localStorage.getItem('resultsId')
    this.resultsService.getById(this.id).subscribe(data => {
      this.results = data
      this.horses = data.finishListing
      this.betService.getById(this.id).subscribe(betData => {
        console.log(betData)
        if (betData != null) {
          this.bet = betData

          /* this.betPlaced = true */
          this.betHorse = betData.betHorse
        }
        else {
          /* this.betPlaced = false */
        }
      })
    })
  }

  ngDoCheck(): void {
    if (this.id !== localStorage.getItem('resultsId')) {
      this.id = localStorage.getItem('resultsId')
      this.resultsService.getById(this.id).subscribe(data => {
        this.results = data
        this.horses = data.finishListing
        this.betService.getById(this.id).subscribe(betData => {
          if (betData != null) {
            this.bet = betData
            /* this.betPlaced = true */
            this.betHorse = betData.betHorse
          }
          else {
            this.bet = null
            /* this.betPlaced = false */
          }
        })
      })
    }
  }

  winningHorse() {
    return this.results.finishListing[0].name
  }
}

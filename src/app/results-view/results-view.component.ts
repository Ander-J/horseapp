import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Bet } from '../model/bet';
import { Horse } from '../model/horse';
import { Results } from '../model/results';
import { BetService } from '../services/bet.service';
import { ResultsService } from '../services/results.service';

@Component({
  selector: 'app-results-view',
  templateUrl: './results-view.component.html',
  styleUrls: ['./results-view.component.scss']
})
export class ResultsViewComponent implements OnInit {
  results: Results;
  resultsData: Results[];
  betData: Bet[];
  id: string;
  bet: Bet;
  betHorse: Horse;
  horses: Horse[];
  displayedColumns: string[] = ['id', 'name', 'color']

  @ViewChild(MatTable) horseTable: MatTable<Horse>;

  constructor(private resultsService: ResultsService,
    private betService: BetService) { }

  ngOnInit(): void {
    this.id = localStorage.getItem('resultsId')
    this.resultsService.getById(this.id).subscribe(data => {
      this.results = data
      this.horses = data.finishListing
      this.betService.getById(this.id).subscribe(betData => {
        if (betData != null) {
          this.bet = betData
          this.betHorse = betData.betHorse
        }
      })
    })
    this.resultsService.updateFromDb().subscribe(data => {
      this.resultsData = data
    })
    this.betService.updateFromDb().subscribe(data => {
      this.betData = data
    })
  }

  ngDoCheck(): void {
    if (this.id !== localStorage.getItem('resultsId')) {
      this.id = localStorage.getItem('resultsId')
      this.localResultsById(this.id)
    }
  }

  localResultsById(id: string){
    for (var r of this.resultsData) {
      if (r.id == id){
        this.results = r
        this.horses = r.finishListing
        this.localBetById(r.id)
        break
      }
    }
  }

  localBetById(id: string){
    for (var b of this.betData){
      if(b.raceId == id){
        this.bet = b
        this.betHorse = b.betHorse
        break
      }
    }
    this.bet = null
  }

  winningHorse() {
    return this.results.finishListing[0].name
  }
}

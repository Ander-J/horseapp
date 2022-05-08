import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Bet } from '../model/bet';
import { Horse } from '../model/horse';
import { Race } from '../model/race';
import { Results } from '../model/results';
import { BetService } from '../services/bet.service';
import { HorseService } from '../services/horse.service';
import { RaceService } from '../services/race.service';
import { ResultsService } from '../services/results.service';

@Component({
  selector: 'app-race-view',
  templateUrl: './race-view.component.html',
  styleUrls: ['./race-view.component.scss']
})
export class RaceViewComponent implements OnInit, DoCheck {
  race: any;
  bet: Bet;
  id: string;
  displayDate: string;
  raceHorses: Horse[];
  selectedHorse: Horse;
  horseName: string = "";
  betPlaced: boolean = false;
  displayedColumns: string[] = ['name', 'color']

  constructor(
    private raceService: RaceService,
    private horseService: HorseService,
    private betService: BetService,
    private resultsService: ResultsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.selectedHorse = new Horse();
    this.selectedHorse.name = ""
    this.id = localStorage.getItem('raceId')
    console.log("id: " + this.id)
    this.raceService.getById(this.id).subscribe(data => {
      this.race = data
      this.raceHorses = this.race.participants
      this.displayDate = new Date(this.race?.date).toLocaleString()
      this.betService.getById(this.id).subscribe(betData => {
        if (betData != null) {
          this.bet = betData
          this.betPlaced = true
          this.selectedHorse = this.bet.betHorse
        } else { this.bet = null; this.betPlaced = false }
      })
    })
    console.log("horses " + this.raceHorses)
    /* if(this.race == null){
      var pathId = this.route.snapshot.url[1].path
      console.log("am here")
      this.race = this.raceService.getById(pathId)
    } */
  }



  ngDoCheck(): void {
    if (this.id !== localStorage.getItem('raceId')) {
      this.id = localStorage.getItem('raceId')
      this.raceService.getById(this.id).subscribe(data => {
        this.race = data
        this.raceHorses = this.race.participants
        this.displayDate = new Date(this.race?.date).toLocaleString()
        this.betService.getById(this.id).subscribe(betData => {
          if (betData != null) {
            this.bet = betData
            this.betPlaced = true
            this.selectedHorse = this.bet.betHorse
          } else { this.bet = null; this.betPlaced = false }
        })
      })
    }
  }

  selectHorse(horse: Horse) {
    if (this.betPlaced) {
      this.selectedHorse = this.bet.betHorse
    }
    else {
      this.selectedHorse = horse
      this.horseName = horse.name
    }
  }

  runRace() {
    this.raceService.runRace(this.race.id).subscribe(data => {
      localStorage.setItem('resultsId', data.id)
      this.router.navigate([`results/${data.id}`])
    })
  }

  placeBet(horseId: string, amount: string) {
    this.bet = new Bet();
    if (horseId != null) {
      this.bet.betHorse = this.selectedHorse
      this.bet.betSize = amount
      this.bet.raceId = this.id
      this.betService.post(this.bet).subscribe(data => this.bet = data)
      this.betPlaced = true
    }
  }
}

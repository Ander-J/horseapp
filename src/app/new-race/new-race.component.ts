import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Horse } from '../model/horse';
import { Race } from '../model/race';
import { HorseService } from '../services/horse.service';
import { RaceService } from '../services/race.service';

@Component({
  selector: 'app-new-race',
  templateUrl: './new-race.component.html',
  styleUrls: ['./new-race.component.scss']
})
export class NewRaceComponent implements OnInit {
  horses: Horse[]
  selectedHorses: Horse[] = []
  myDate: Date = new Date();
  filteredHorses: Observable<Horse[]>;
  race: Race;
  form: FormGroup = this.initForm();
  newHorse: FormGroup = this.horseForm();
  participantControl: FormControl = new FormControl();
  /*  newHorseName: FormControl = new FormControl('', Validators.required);
   newHorseColor: FormControl = new FormControl('', Validators.required); */

  constructor(
    private router: Router,
    private raceService: RaceService,
    private horseService: HorseService,
    private formBuilder: FormBuilder
  ) { }

  @ViewChild('horseList') horseList

  ngOnInit(): void {
    this.horseService.updateFromDb().subscribe(newHorses => {
      this.horses = newHorses;
      this.filteredHorses = this.form.get('participants').valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      )
    });
    this.race = {
      id: null,
      track: null,
      date: null,
      participants: null
    }
  }

  initForm(race?: Race) {
    return this.formBuilder.group({
      track: new FormControl(
        race?.track || '',
        [Validators.required, Validators.maxLength(50)]
      ),
      date: new FormControl(
        race?.date || ''
      ),
      participants: new FormControl(
        race?.participants || []
        /* this.checkMinParticipants() */
      )
      /* participantIds: this.participantControl, Validators.required */
    })
  }

  horseForm(horse?: Horse) {
    return this.formBuilder.group({
      name: new FormControl(
        horse?.name || '',
        Validators.required
      ),
      color: new FormControl(
        horse?.color || '',
        Validators.required
      )
    })
  }

  hasError(path: string, errorCode: string) {
    return this.form && this.form.hasError(errorCode, path);
  }

  createNewHorse() {
    const horseToSave = { ...this.newHorse.value, id: null, competitions: [], results: [] };
    this.horseService.post(horseToSave).subscribe(() => {
      this.clearNewHorse();
      this.horseService.updateFromDb().subscribe(newHorses => this.horses = newHorses);
    })
  }

  clearNewHorse() {
    this.horseService.updateFromDb().subscribe(newHorses => {
      this.horses = newHorses
      this.filteredHorses = this.form.get('participants').valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      )
    });
    this.newHorse.controls['name'].setValue('')
    this.newHorse.controls['color'].setValue('')
  }

  getHorseName(horse: Horse): string {
    return horse.name
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.horseService.getById(value).subscribe(data => this.selectedHorses.push(data))
    }

  }

  selected(event: MatAutocompleteSelectedEvent): void {
    var selected = event.option.value
    if (!this.selectedHorses.includes(selected)) {
      this.selectedHorses.push(selected)
      this.form?.controls['participants'].updateValueAndValidity();
    }
  }

  remove(horse: Horse): void {
    const index = this.selectedHorses.indexOf(horse)

    if (index >= 0) {
      this.selectedHorses.splice(index, 1)
    }
  }

  private _filter(name: string): Horse[] {
    const filterValue = name.toLowerCase();
    return this.horses.filter(option => option.name.toLowerCase().includes(filterValue))
  }

  submit() {
    if (this.selectedHorses.length < 2) {
      this.horseList.errorState = true;
    }
    else {
      this.horseList.errorState = false;
      const raceToSave = { ...this.form.value, id: this.race.id, participants: this.selectedHorses };
      this.raceService.postNewRace(raceToSave).subscribe(() => {
        this.router.navigate(['main'])
      });
    }
  }

  /* checkMinParticipants(): ValidatorFn{
    return (control: AbstractControl): { [key:string] : any} | null => {
      var horsenum = this.selectedHorses.length
      console.log(control)
      console.log("control value length: " + this.selectedHorses.length)
      if (horsenum < 2){
        return {'invalidParticipants': horsenum}
      }
      return null
    }
  } */

}

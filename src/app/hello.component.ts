import {
  Component,
  Input,
  Injectable,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FirstLevel } from '../_dto/day';
import { SecondLevel } from '../_dto/turn';

@Component({
  selector: 'hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./app.component.css'],
})
export class HelloComponent {
  @Input() name: string;
  @Output() checkChangeEventEmit = new EventEmitter<any>();

  arrDias: FirstLevel[] = [
    { number: 1, name: 'monday', checked: false },
    { number: 2, name: 'tuesday', checked: false },
    { number: 3, name: 'wednesday', checked: false },
    { number: 4, name: 'thursday', checked: false },
    { number: 5, name: 'friday', checked: false },
    { number: 6, name: 'saturday', checked: false },
  ];

  turnos: SecondLevel[] = [
    { name: 'morning', checked: false },
    { name: 'afternoon', checked: false },
    { name: 'night', checked: false },
  ];

  thirdlev: SecondLevel[] = [
    { name: '_A', checked: false },
    { name: '_B', checked: false },
    { name: '_C', checked: false },
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const topLevel = new FormArray([]);
    this.arrDias.forEach((dia: FirstLevel) => {
      const secondLevel = new FormArray([]);
      this.turnos.forEach((turno: SecondLevel) => {
        secondLevel.push(
          new FormGroup({
            name: new FormControl(turno.name),
            checked: new FormControl(turno.checked),
          })
        );
      });

      topLevel.push(
        new FormGroup({
          name: new FormControl(dia.name),
          checked: new FormControl(dia.checked),
          secondLevel,
        })
      );
    });

    this.form = this.fb.group({
      topLevel: topLevel,
    });

    this.setListeners();
  }

  get topLevelFormArray(): FormArray {
    return this.form.get('topLevel') as FormArray;
  }

  getSecondLevelArray(firstLevelIndex: number): FormArray {
    return this.topLevelFormArray
      .at(firstLevelIndex)
      .get('secondLevel') as FormArray;
  }

  private setListeners(): void {
    this.topLevelFormArray.controls.forEach((topLevelEle: FormGroup) => {
      topLevelEle.controls['checked'].valueChanges.subscribe((value) => {
        (
          (topLevelEle.controls['secondLevel'] as FormArray)
            .controls as FormGroup[]
        ).forEach((secondLevel: FormGroup) => {
          secondLevel.controls['checked'].setValue(value);
        });
        // this.sendCheckedBoxes();
      });
    });

    // this.topLevelFormArray.controls.forEach((topLevelEle: FormGroup) => {
    //   (
    //     (topLevelEle.controls['secondLevel'] as FormArray)
    //       .controls as FormGroup[]
    //   ).forEach((secondLevel: FormGroup) => {
    //     console.log(secondLevel);
    //     secondLevel.controls['checked'].valueChanges.subscribe((value) => {
    //       this.sendCheckedBoxes();
    //     });
    //   });
    // });
  }

  sendCheckedBoxes(): any {
    var checkedArray = [] as string[];
    this.topLevelFormArray.controls.forEach((something: FormGroup) => {
      // console.log(something);
      (
        (something.controls['secondLevel'] as FormArray).controls as FormGroup[]
      ).forEach((thing: FormGroup) => {
        if (thing.value.checked) {
          checkedArray.push(something.value.name + '_' + thing.value.name);
        }
        // console.log(thing.value.checked);
      });
    });
    console.log('Sending ', checkedArray);
    this.checkChangeEventEmit.emit(checkedArray);
    return;
  }
}

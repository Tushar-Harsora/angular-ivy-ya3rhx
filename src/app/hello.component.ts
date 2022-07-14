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
        const thirdLevel = new FormArray([]);
        this.thirdlev.forEach((thirdLevelEle: SecondLevel) => {
          thirdLevel.push(
            new FormGroup({
              name: new FormControl(thirdLevelEle.name),
              checked: new FormControl(thirdLevelEle.checked),
            })
          );
        });

        secondLevel.push(
          new FormGroup({
            name: new FormControl(turno.name),
            checked: new FormControl(turno.checked),
            thirdLevel,
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

  getThirdLevelArray(
    firstLevelIndex: number,
    secondLevelIndex: number
  ): FormArray {
    return this.getSecondLevelArray(firstLevelIndex)
      .at(secondLevelIndex)
      .get('thirdLevel') as FormArray;
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

      (
        (topLevelEle.controls['secondLevel'] as FormArray)
          .controls as FormGroup[]
      ).forEach((secondLevelEle: FormGroup) => {
        secondLevelEle.controls['checked'].valueChanges.subscribe((value) => {
          (
            (secondLevelEle.controls['thirdLevel'] as FormArray)
              .controls as FormGroup[]
          ).forEach((thirdLevelEle: FormGroup) => {
            thirdLevelEle.controls['checked'].setValue(value);
          });
        });
      });
    });
  }

  sendCheckedBoxes(): any {
    var checkedArray = [] as string[];
    this.topLevelFormArray.controls.forEach((firstLevelEle: FormGroup) => {
      // console.log(something);
      (
        (firstLevelEle.controls['secondLevel'] as FormArray)
          .controls as FormGroup[]
      ).forEach((secondLevelEle: FormGroup) => {
        (
          (secondLevelEle.controls['thirdLevel'] as FormArray)
            .controls as FormGroup[]
        ).forEach((thirdLevelEle: FormGroup) => {
          if (thirdLevelEle.value.checked) {
            checkedArray.push(
              firstLevelEle.value.name +
                '_' +
                secondLevelEle.value.name +
                '_' +
                thirdLevelEle.value.name
            );
          }
        });
      });
    });
    console.log('Sending ', checkedArray);
    this.checkChangeEventEmit.emit(checkedArray);
    return;
  }
}

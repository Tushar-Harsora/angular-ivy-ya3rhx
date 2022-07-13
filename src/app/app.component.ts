import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FirstLevel } from '../_dto/day';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  topLevelNames: FirstLevel[] = [
    { number: 1, name: 'A', checked: false },
    { number: 2, name: 'B', checked: false },
    { number: 3, name: 'C', checked: false },
    { number: 4, name: 'D', checked: false },
    { number: 5, name: 'E', checked: false },
    { number: 6, name: 'F', checked: false },
  ];

  currentSelected: Map<string, string[]> = new Map();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // this.initForm();
  }

  setCurrentChecked(tagName: string, checkedItems: string[]) {
    // console.log(checkedItems);
    this.currentSelected.set(tagName, checkedItems);
    // console.log(tagName, this.currentSelected);
  }

  initForm() {}
}

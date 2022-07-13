import { Component, Input, Injectable } from '@angular/core';

@Component({
  selector: 'hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./app.component.css'],
})
export class HelloComponent {
  @Input() name: string;
}

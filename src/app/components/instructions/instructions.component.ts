import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/constants/constants';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  public showInstructions: boolean = true;
  public constants = Constants;

  constructor() { }

  ngOnInit() {
  }

}

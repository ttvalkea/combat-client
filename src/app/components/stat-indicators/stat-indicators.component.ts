import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/models/Player.model';
import { Constants } from 'src/app/constants/constants';

@Component({
  selector: 'app-stat-indicators',
  templateUrl: './stat-indicators.component.html',
  styleUrls: ['./stat-indicators.component.css']
})
export class StatIndicatorsComponent implements OnInit {

  @Input() clientPlayer: Player;
  public constants = Constants;

  constructor() { }

  ngOnInit() {
  }

}

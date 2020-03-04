import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../../services/signal-r.service';
import { Constants } from 'src/app/constants/constants';

@Component({
  selector: 'app-server-controls',
  templateUrl: './server-controls.component.html',
  styleUrls: ['./server-controls.component.css']
})
export class ServerControlsComponent implements OnInit {

  public constants = Constants;

  constructor(public signalRService: SignalRService) { }

  ngOnInit() {
  }

}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatIndicatorsComponent } from './stat-indicators.component';
import { Player } from 'src/app/models/Player.model';

describe('StatIndicatorsComponent', () => {
  let component: StatIndicatorsComponent;
  let fixture: ComponentFixture<StatIndicatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatIndicatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatIndicatorsComponent);
    component = fixture.componentInstance;
    component.clientPlayer = new Player();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

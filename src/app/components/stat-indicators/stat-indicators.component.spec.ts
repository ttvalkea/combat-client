import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatIndicatorsComponent } from './stat-indicators.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerControlsComponent } from './server-controls.component';

describe('ServerControlsComponent', () => {
  let component: ServerControlsComponent;
  let fixture: ComponentFixture<ServerControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

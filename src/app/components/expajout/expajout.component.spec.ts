import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpajoutComponent } from './expajout.component';

describe('ExpajoutComponent', () => {
  let component: ExpajoutComponent;
  let fixture: ComponentFixture<ExpajoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpajoutComponent]
    });
    fixture = TestBed.createComponent(ExpajoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

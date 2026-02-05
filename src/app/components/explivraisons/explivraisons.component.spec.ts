import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplivraisonsComponent } from './explivraisons.component';

describe('ExplivraisonsComponent', () => {
  let component: ExplivraisonsComponent;
  let fixture: ComponentFixture<ExplivraisonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExplivraisonsComponent]
    });
    fixture = TestBed.createComponent(ExplivraisonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

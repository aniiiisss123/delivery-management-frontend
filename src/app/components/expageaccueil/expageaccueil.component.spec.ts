import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpageaccueilComponent } from './expageaccueil.component';

describe('ExpageaccueilComponent', () => {
  let component: ExpageaccueilComponent;
  let fixture: ComponentFixture<ExpageaccueilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpageaccueilComponent]
    });
    fixture = TestBed.createComponent(ExpageaccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

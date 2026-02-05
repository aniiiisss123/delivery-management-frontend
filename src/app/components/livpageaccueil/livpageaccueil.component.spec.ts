import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivpageaccueilComponent } from './livpageaccueil.component';

describe('LivpageaccueilComponent', () => {
  let component: LivpageaccueilComponent;
  let fixture: ComponentFixture<LivpageaccueilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivpageaccueilComponent]
    });
    fixture = TestBed.createComponent(LivpageaccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

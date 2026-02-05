import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivlivraisonsComponent } from './livlivraisons.component';

describe('LivlivraisonsComponent', () => {
  let component: LivlivraisonsComponent;
  let fixture: ComponentFixture<LivlivraisonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivlivraisonsComponent]
    });
    fixture = TestBed.createComponent(LivlivraisonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

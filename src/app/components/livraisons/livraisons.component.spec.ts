import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivraisonsComponent } from './livraisons.component';

describe('LivraisonsComponent', () => {
  let component: LivraisonsComponent;
  let fixture: ComponentFixture<LivraisonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivraisonsComponent]
    });
    fixture = TestBed.createComponent(LivraisonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

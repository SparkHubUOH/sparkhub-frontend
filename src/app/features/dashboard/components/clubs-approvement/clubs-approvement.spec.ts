import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubsApprovement } from './clubs-approvement';

describe('ClubsApprovement', () => {
  let component: ClubsApprovement;
  let fixture: ComponentFixture<ClubsApprovement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubsApprovement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubsApprovement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

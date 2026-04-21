import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderDashboard } from './leader-dashboard';

describe('LeaderDashboard', () => {
  let component: LeaderDashboard;
  let fixture: ComponentFixture<LeaderDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

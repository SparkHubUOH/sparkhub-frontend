import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinRequests } from './join-requests';

describe('JoinRequests', () => {
  let component: JoinRequests;
  let fixture: ComponentFixture<JoinRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesAttended } from './activities-attended';

describe('ActivitiesAttended', () => {
  let component: ActivitiesAttended;
  let fixture: ComponentFixture<ActivitiesAttended>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesAttended]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesAttended);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

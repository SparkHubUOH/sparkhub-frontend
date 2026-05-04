import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAnalytics } from './ai-analytics';

describe('AiAnalytics', () => {
  let component: AiAnalytics;
  let fixture: ComponentFixture<AiAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiAnalytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

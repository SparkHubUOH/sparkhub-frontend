import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubProfile } from './club-profile';

describe('ClubProfileComponent', () => {
  let component: ClubProfile;
  let fixture: ComponentFixture<ClubProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
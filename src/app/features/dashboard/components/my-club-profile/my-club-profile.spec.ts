import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyClubProfile } from './my-club-profile';

describe('MyClubProfile', () => {
  let component: MyClubProfile;
  let fixture: ComponentFixture<MyClubProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyClubProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyClubProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

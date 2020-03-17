import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchilComponent } from './archil.component';

describe('ArchilComponent', () => {
  let component: ArchilComponent;
  let fixture: ComponentFixture<ArchilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

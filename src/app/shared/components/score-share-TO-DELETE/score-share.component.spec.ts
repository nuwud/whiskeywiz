import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreShareComponent } from './score-share.component';

describe('ScoreShareComponent', () => {
  let component: ScoreShareComponent;
  let fixture: ComponentFixture<ScoreShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreShareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreShareComponent);
    component = fixture.componentInstance;
    component.score = 85;
    component.quarter = 'Q1 2025';
    component.sampleScores = [25, 15, 25, 20];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate correct share text', () => {
    const text = component.generateShareText();
    expect(text).toContain('WhiskeyWiz Q1 2025');
    expect(text).toContain('Score: 85/100');
    expect(text).toContain('🟨🟧🟨🟨');
  });
});
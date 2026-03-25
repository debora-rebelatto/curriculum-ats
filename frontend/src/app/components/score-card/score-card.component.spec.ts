import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreCardComponent } from './score-card.component';
import { CommonModule } from '@angular/common';

describe('ScoreCardComponent', () => {
  let component: ScoreCardComponent;
  let fixture: ComponentFixture<ScoreCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreCardComponent, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    component.title = 'Test Score';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h4')?.textContent).toContain('Test Score');
  });

  it('should display the score', () => {
    component.score = 85;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('.text-\\[3\\.5rem\\]')?.textContent
    ).toContain('85');
  });

  it('should return correct color for high score', () => {
    expect(component.getScoreColor(85)).toBe('text-mint');
  });

  it('should return correct color for medium score', () => {
    expect(component.getScoreColor(60)).toBe('text-accent');
  });

  it('should return correct color for low score', () => {
    expect(component.getScoreColor(30)).toBe('text-ruby');
  });

  it('should return correct color for null score', () => {
    expect(component.getScoreColor(null)).toBe('text-app-text3');
  });
});

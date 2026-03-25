import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

class TranslateLoaderMock implements TranslateLoader {
  getTranslation(lang: string) {
    return of({
      'app.loading.msg0': 'Analyzing...',
      'app.loading.subtext': 'Please wait',
    });
  }
}

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoadingSpinnerComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial message', () => {
    const msgElement = fixture.nativeElement.querySelector('[data-testid="loading-msg-0"]');
    expect(msgElement).toBeTruthy();
  });

  it('should update the message when messageIndex changes', () => {
    component.messageIndex.set(1);
    fixture.detectChanges();
    
    const msgElement = fixture.nativeElement.querySelector('[data-testid="loading-msg-1"]');
    expect(msgElement).toBeTruthy();
  });
});

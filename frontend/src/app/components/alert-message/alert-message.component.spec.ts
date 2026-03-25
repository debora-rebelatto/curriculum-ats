import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertMessageComponent } from './alert-message.component';
import { CommonModule } from '@angular/common';
import {
  TranslateModule,
  TranslateService,
  TranslateLoader,
} from '@ngx-translate/core';
import { of } from 'rxjs';

class TranslateLoaderMock implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

describe('AlertMessageComponent', () => {
  let component: AlertMessageComponent;
  let fixture: ComponentFixture<AlertMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AlertMessageComponent,
        CommonModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
      ],
      providers: [TranslateService],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message', () => {
    component.message = 'Test Error Message';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Error Message');
  });

  it('should show error icon', () => {
    component.message = 'Error';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.material-icons')?.textContent).toBe(
      'error_outline'
    );
  });
});

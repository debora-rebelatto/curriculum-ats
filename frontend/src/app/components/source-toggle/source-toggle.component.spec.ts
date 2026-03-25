import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourceToggleComponent } from './source-toggle.component';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

class TranslateLoaderMock implements TranslateLoader {
  getTranslation(lang: string) {
    return of({
      'app.tabs.upload': 'Upload JSON',
      'app.tabs.paste': 'Paste JSON',
    });
  }
}

describe('SourceToggleComponent', () => {
  let component: SourceToggleComponent;
  let fixture: ComponentFixture<SourceToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SourceToggleComponent,
        CommonModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all tabs defined in the Map', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(component.tabs.size);
  });

  it('should emit tabChange when a button is clicked', () => {
    jest.spyOn(component.tabChange, 'emit');
    const pasteTab = fixture.nativeElement.querySelector(
      '[data-testid="tab-paste"]'
    );

    pasteTab.click();

    expect(component.tabChange.emit).toHaveBeenCalledWith('paste');
  });

  it('should have text-accent class on the active tab button', () => {
    component.activeTab = 'upload';
    fixture.detectChanges();

    const uploadTab = fixture.nativeElement.querySelector(
      '[data-testid="tab-upload"]'
    );
    const pasteTab = fixture.nativeElement.querySelector(
      '[data-testid="tab-paste"]'
    );

    expect(uploadTab.classList.contains('text-accent')).toBe(true);
    expect(pasteTab.classList.contains('text-accent')).toBe(false);

    component.activeTab = 'paste';
    fixture.detectChanges();

    expect(uploadTab.classList.contains('text-accent')).toBe(false);
    expect(pasteTab.classList.contains('text-accent')).toBe(true);
  });
});

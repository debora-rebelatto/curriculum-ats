import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private translate = inject(TranslateService);

  constructor() {
    this.translate.setDefaultLang('pt-br');
    this.translate.use('pt-br');
  }
}

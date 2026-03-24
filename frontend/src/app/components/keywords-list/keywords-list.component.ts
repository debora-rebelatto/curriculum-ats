import { Component, Input } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-keywords-list',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './keywords-list.component.html',
})
export class KeywordsListComponent {
  @Input() keywordsFound: string[] = [];
  @Input() keywordsMissing: string[] = [];
}

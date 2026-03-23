import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dimensions-chart',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dimensions-chart.component.html',
})
export class DimensionsChartComponent {
  @Input() dimensions: { name: string; score: number }[] = [];
}

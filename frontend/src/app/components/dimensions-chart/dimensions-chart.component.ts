import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Dimension } from '../../models/analyze.model';

@Component({
  selector: 'dimensions-chart',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dimensions-chart.component.html',
})
export class DimensionsChartComponent {
  @Input() dimensions: Dimension[] = [];
}

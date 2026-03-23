import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [],
  templateUrl: './primary-button.component.html'
})
export class PrimaryButtonComponent {
  @Output() clicked = new EventEmitter<void>();
}

import { Component, ElementRef, input, viewChild } from '@angular/core';

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.scss'
})
export class GuideComponent {
	explanation = input('')
	direction = input.required<'top' | 'right' | 'bottom' | 'left'>()
	text = input.required<'top' | 'right' | 'bottom' | 'left'>()
}

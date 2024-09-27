import { Component, input } from '@angular/core';

@Component({
  selector: 'div[app-polynomial]',
  standalone: true,
  imports: [],
  templateUrl: './polynomial.component.html',
  styleUrl: './polynomial.component.scss'
})
export class PolynomialComponent {
	polyData = input.required<number[]>()
}

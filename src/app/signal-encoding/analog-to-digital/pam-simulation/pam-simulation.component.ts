import { Component, computed, signal } from '@angular/core';

@Component({
	selector: 'app-pam-simulation',
	standalone: true,
	imports: [],
	templateUrl: './pam-simulation.component.html',
	styleUrl: './pam-simulation.component.scss'
})
export class PamSimulationComponent {
	bitsPerPeriod = signal(5);
	svgHeight = computed(() => 100 + 50 * this.bitsPerPeriod());
}

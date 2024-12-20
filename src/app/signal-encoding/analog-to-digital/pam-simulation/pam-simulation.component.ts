import { Component, computed, HostListener, signal } from '@angular/core';

@Component({
	selector: 'app-pam-simulation',
	standalone: true,
	imports: [],
	templateUrl: './pam-simulation.component.html',
	styleUrl: './pam-simulation.component.scss'
})
export class PamSimulationComponent {
	bitsPerPeriod = signal(5);
	dataLevels = computed(() => 2 ** this.bitsPerPeriod());

	svgWidth = signal(500);
	svgHeight = signal(500);

	coordXStart = 50
	coordXEnd = computed(() => this.svgWidth() - this.coordXStart);

	coordYStart = 50
	coordYEnd = computed(() => this.svgHeight() - this.coordYStart);

	ngAfterViewInit() {
		this.onResize()
	}

	yAxisLevelCoords = computed(() => {
		const result = [];

		const interval = (this.coordYEnd() - this.coordXStart) / (this.dataLevels() - 1)

		for (let i = 0; i < this.dataLevels(); i++) {
			result.push(this.coordYStart + interval * i);
		}

		console.log(result);

		return result;
	});

	onResize() {
		this.svgWidth.set(window.innerWidth * 0.95);
		this.svgHeight.set(window.innerHeight * 0.95);
	}
}

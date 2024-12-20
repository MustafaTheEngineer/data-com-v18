import { Component, computed, HostListener, signal } from '@angular/core';

@Component({
	selector: 'app-pam-simulation',
	standalone: true,
	imports: [],
	templateUrl: './pam-simulation.component.html',
	styleUrl: './pam-simulation.component.scss'
})
export class PamSimulationComponent {
	bitsPerPeriod = signal(4);
	dataLevels = computed(() => 2 ** this.bitsPerPeriod());

	svgWidth = signal(500);
	svgHeight = signal(500);

	coordXStart = 75
	coordXEnd = computed(() => this.svgWidth() - this.coordXStart);

	coordYStart = 75
	coordYEnd = computed(() => this.svgHeight() - this.coordYStart);

	ngAfterViewInit() {
		this.onResize()
	}

	codeNumberCoords = computed(() => {
		const result = [];

		const interval = (this.coordYEnd() - this.coordXStart * 2) / (this.dataLevels() - 1)

		for (let i = 0; i < this.dataLevels(); i++) {
			result.push(this.coordYStart + (this.coordXStart / 2) + interval * i);
		}

		return result;
	});

	magnitudeCoords = computed(() => {
		const result = [];

		const interval = (this.coordYEnd() - this.coordXStart) / (this.dataLevels() - 1)

		for (let i = 0; i < this.dataLevels(); i++) {
			result.push(this.coordYStart + interval * i);
		}

		return result;
	});

	onResize() {
		this.svgWidth.set(window.innerWidth * 0.90);
		this.svgHeight.set(this.dataLevels() * (this.bitsPerPeriod() < 3 ? 100 : 50));
	}
}

import { Component, computed, ElementRef, signal, viewChild } from '@angular/core';
import { DecimalDataComponent } from '../../../decimal-data/decimal-data.component';

@Component({
	selector: 'app-pam-simulation',
	standalone: true,
	imports: [DecimalDataComponent],
	templateUrl: './pam-simulation.component.html',
	styleUrl: './pam-simulation.component.scss'
})
export class PamSimulationComponent {
	bitsPerPeriod = signal(3);

	setBitsPerPeriod(value: number | null) {
		if (value) {
			this.bitsPerPeriod.set(value);
		}
	}

	dataLevels = computed(() => 2 ** this.bitsPerPeriod());

	pcmCodes = computed(() => {
		const result = [];

		for (let i = 0; i < this.dataLevels(); i++) {
			result.push(
				i.toString(2).padStart(this.bitsPerPeriod(), '0')
			);
		}

		return result;
	})

	svgWidth = signal(500);
	svgHeight = signal(500);

	coordXStart = 30
	coordXEnd = computed(() => this.svgWidth() - this.coordXStart);

	coordYStart = 75
	coordYEnd = computed(() => this.svgHeight() - this.coordYStart);

	ngAfterViewInit() {
		this.onResize()
		this.firstPointY.set(this.startY());
	}

	magnitudeCoords = computed(() => {
		const result = [];

		const interval = (this.coordYEnd() - this.coordYStart) / (this.dataLevels())

		for (let i = 0; i <= this.dataLevels(); i++) {
			result.push(this.coordYStart + interval * i);
		}

		return result;
	});

	codeNumberCoords = computed(() => {
		const result = [];

		const interval = this.magnitudeCoords()[1] - this.magnitudeCoords()[0];

		for (let i = 0; i < this.dataLevels(); i++) {
			result.push(this.coordYStart + (interval / 2) + interval * i);
		}

		return result;
	});

	onResize() {
		this.svgWidth.set(window.innerWidth * 0.9);
		this.svgHeight.set(this.dataLevels() * (this.bitsPerPeriod() <= 3 ? 100 : 50));
	}

	tsLength = computed(() => (this.coordXEnd() - this.coordXStart) / 7);
	startY = computed(() => this.coordYStart + (this.coordYEnd() - this.coordYStart) / 2);

	startControlX = computed(() => this.tsLength() / 2);
	startControlY = computed(() => this.startY());

	signalCoords = computed(() => {
		const result = [];

		for (let i = 0; i < 8; i++) {
			result.push({
				firstControlX: this.coordXStart + this.tsLength() * i + this.startControlX(),
				firstControlY: this.startY(),

				secondControlX: this.coordXStart + this.tsLength() * i + this.startControlX(),
				secondControlY: this.startY(),

				endX: this.coordXStart + this.tsLength() * (i + 1),
				endY: this.startY(),
			})
		}

		return result;
	})

	normalizedValues = computed(() => {
		const result: number[] = [];

		result.push(
			0 + (this.firstPointY() - this.coordYStart) / (this.coordYEnd() - this.coordYStart) * (this.dataLevels())
		);

		for (const signal of this.signalCoords()) {
			result.push(
				0 + (signal.endY - this.coordYStart) / (this.coordYEnd() - this.coordYStart) * (this.dataLevels())
			);
		}

		return result;
	})

	tsVerticalLines = computed(() => this.signalCoords().slice(0,7).map((value) => ({ endX: value.endX, endY: value.endY })));

	selectedPointIndex = -1;
	firstPointY = signal(this.startY())

	bezierPath(): string {
		let result = `M${this.coordXStart} ${this.firstPointY()}`

		for (let i = 0; i < this.signalCoords().length - 1; i++) {
			result += ` C
				${this.signalCoords()[i].firstControlX} ${this.signalCoords()[i].firstControlY},
				${this.signalCoords()[i].secondControlX} ${this.signalCoords()[i].secondControlY},
				${this.signalCoords()[i].endX} ${this.signalCoords()[i].endY}`
		}

		return result
	}

	floorValue(value: number) {
		return Math.floor(value)
	}

	onMouseDown(index: number) {
		this.selectedPointIndex = index;

		console.log('touchstart')
	}

	onMouseMove(event: MouseEvent) {
		if (this.selectedPointIndex === -1) return;

		let coordY = event.offsetY;

		if (event.offsetY < this.coordYStart) {
			coordY = this.coordYStart;
		} else if (event.offsetY > this.coordYEnd()) {
			coordY = this.coordYEnd();
		}
		if (this.selectedPointIndex === 0) {
			this.firstPointY.set(coordY)
			this.calcControlPoints()
			return;
		}

		this.signalCoords()[this.selectedPointIndex - 1].endY = coordY
		this.tsVerticalLines()[this.selectedPointIndex - 1].endY = coordY

		this.calcControlPoints()

		this.normalizedValues()[this.selectedPointIndex] = 0 + (coordY - this.coordYStart) / (this.coordYEnd() - this.coordYStart) * (this.dataLevels())
	}

	svg = viewChild.required<ElementRef>('svgElement');

	onTouchMove(event: TouchEvent) {
		event.preventDefault();

		if (this.selectedPointIndex === -1) return;

		let coordY = event.touches[0].clientY - this.svg().nativeElement.getBoundingClientRect().top;

		if (coordY < this.coordYStart) {
			coordY = this.coordYStart;
		} else if (coordY > this.coordYEnd()) {
			coordY = this.coordYEnd();
		}
		if (this.selectedPointIndex === 0) {
			this.firstPointY.set(coordY)
			this.calcControlPoints()
			return;
		}

		this.signalCoords()[this.selectedPointIndex - 1].endY = coordY
		this.tsVerticalLines()[this.selectedPointIndex - 1].endY = coordY

		this.calcControlPoints()

		this.normalizedValues()[this.selectedPointIndex] = 0 + (coordY - this.coordYStart) / (this.coordYEnd() - this.coordYStart) * (this.dataLevels())
	}

	calcControlPoints() {
		let interval = 0;
		for (let i = this.signalCoords().length - 1; i > 0; i--) {
			interval = Math.abs(this.signalCoords()[i].endY - this.signalCoords()[i - 1].endY);

			if (this.signalCoords()[i].endY >= this.signalCoords()[i - 1].endY) {
				this.signalCoords()[i].firstControlY = this.signalCoords()[i - 1].endY + (interval / 8);
				this.signalCoords()[i].secondControlY = this.signalCoords()[i].endY - (interval / 8);
			} else {
				this.signalCoords()[i].firstControlY = this.signalCoords()[i - 1].endY - (interval / 8);
				this.signalCoords()[i].secondControlY = this.signalCoords()[i].endY + (interval / 8);
			}
		}

		interval = Math.abs(this.firstPointY() - this.signalCoords()[0].endY);

		if (this.firstPointY() >= this.signalCoords()[0].endY) {
			this.signalCoords()[0].firstControlY = this.firstPointY() - (interval / 8)
			this.signalCoords()[0].secondControlY = this.signalCoords()[0].endY + (interval / 8)
		} else {
			this.signalCoords()[0].firstControlY = this.firstPointY() + (interval / 8)
			this.signalCoords()[0].secondControlY = this.signalCoords()[0].endY - (interval / 8)
		}
	}

	onMouseUp() {
		this.selectedPointIndex = -1;

		console.log('touchend')
	}

	timeText = computed(() => `M ${this.coordXEnd() - 100} ${this.coordYEnd() + 30}, ${this.coordXEnd() - 30} ${this.coordYEnd() + 30}, 120`)
}

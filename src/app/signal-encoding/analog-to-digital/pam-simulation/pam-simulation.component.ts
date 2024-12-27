import { Component, computed, ElementRef, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { DecimalDataComponent } from '../../../decimal-data/decimal-data.component';
import { svg } from 'd3';
import { BinaryDataComponent } from '../../../binary-data/binary-data.component';

type Bezier = {
	firstControlX?: number,
	firstControlY?: number,

	secondControlX?: number,
	secondControlY?: number,

	endX: number,
	endY: number,
}

@Component({
	selector: 'app-pam-simulation',
	standalone: true,
	imports: [DecimalDataComponent, BinaryDataComponent],
	templateUrl: './pam-simulation.component.html',
	styleUrl: './pam-simulation.component.scss'
})
export class PamSimulationComponent {
	bitsPerPeriod = signal(3);
	magnitude = signal(250);

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

	constChart = new ConstChart(this.magnitude);
	scalableChart = new ScalableChart(this.bitsPerPeriod);

	toAnalogBitsPerPeriod = signal(3);
	toAnalogDataLevels = computed(() => 2 ** this.toAnalogBitsPerPeriod());

	toAnalogPcmCodes = computed(() => {
		const result = [];

		for (let i = 0; i < this.toAnalogDataLevels(); i++) {
			result.push(
				i.toString(2).padStart(this.toAnalogBitsPerPeriod(), '0')
			);
		}

		return result;
	})

	toAnalogChart = new ScalableChart(this.toAnalogBitsPerPeriod);
	toAnalogData = signal('');
	calcAnalogData = computed(() => {
		this.toAnalogChart.recalcSignalCoords()
		if (this.toAnalogData().length === 0) {
			for (const element of this.toAnalogChart.signalCoords) {
				element.endY = this.toAnalogChart.coordYEnd();
				element.firstControlY = this.toAnalogChart.coordYEnd();
				element.secondControlY = this.toAnalogChart.coordYEnd();
			}
		} else {
			const partialData = [];
			let currentData = '';

			for (let i = 0; i < this.toAnalogData().length; i++) {
				currentData += this.toAnalogData()[i];

				if (currentData.length === this.toAnalogBitsPerPeriod()) {
					partialData.push(currentData);
					currentData = '';
				}
			}

			if (currentData.length > 0) {
				partialData.push(currentData);
			}

			const indexes = partialData.map((element) => parseInt(element, 2));

			for (let i = 0; i < indexes.length; i++) {
				if (indexes.length > this.toAnalogChart.signalCoords.length) {
					break;
				}

				this.toAnalogChart.signalCoords[i].endY = this.toAnalogChart.coordYStart + (this.toAnalogChart.coordYEnd() - this.toAnalogChart.coordYStart) / this.toAnalogDataLevels() * (this.toAnalogDataLevels() - indexes[i])
			}

			Chart.calcControlPoints(this.toAnalogChart.signalCoords)
		}

		return this.toAnalogChart.signalCoords
	})

	ngAfterViewInit() {
		this.constChart.calcSize();
		this.scalableChart.calcSize();
		this.toAnalogChart.calcSize();
	}

	scalableMagnitudeCoords = computed(() => this.calcMagnitudeCoords(this.scalableChart.coordYEnd(), this.scalableChart.coordYStart, this.dataLevels()));
	scalableCodeNumberCoords = computed(() => this.calcCodeCoords(this.scalableMagnitudeCoords()[1] - this.scalableMagnitudeCoords()[0], this.scalableChart.coordYStart, this.dataLevels()));

	toAnalogMagnitudeCoords = computed(() => this.calcMagnitudeCoords(this.toAnalogChart.coordYEnd(), this.toAnalogChart.coordYStart, this.toAnalogDataLevels()));
	toAnalogCodeNumberCoords = computed(() => this.calcCodeCoords(this.toAnalogMagnitudeCoords()[1] - this.toAnalogMagnitudeCoords()[0], this.toAnalogChart.coordYStart, this.toAnalogDataLevels()));

	calcMagnitudeCoords(coordYEnd: number, coordYStart: number, dataLevels: number) {
		const result: number[] = [];

		const interval = (coordYEnd - coordYStart) / dataLevels

		for (let i = 0; i <= dataLevels; i++) {
			result.push(coordYStart + interval * i);
		}

		return result;
	}

	calcCodeCoords(interval: number, coordYStart: number, dataLevels: number) {
		const result = [];

		for (let i = 0; i < dataLevels; i++) {
			result.push(coordYStart + (interval / 2) + interval * i);
		}

		return result;
	}

	floorValue(value: number) {
		return Math.floor(value)
	}

	onMouseDown(index: number) {
		this.constChart.selectedPointIndex = index
	}

	onMouseMove(event: MouseEvent) {
		if (this.constChart.selectedPointIndex === -1) return;

		this.updateControlPoint(event.offsetY)
	}

	constChartEl = viewChild.required<ElementRef>('constChartEl');

	onTouchMove(event: TouchEvent) {
		event.preventDefault();

		let coordY = event.touches[0].clientY - this.constChartEl().nativeElement.getBoundingClientRect().top;
		this.updateControlPoint(coordY)
	}

	updateControlPoint(coordY: number) {
		this.constChart.selectedPointCoordY.set(coordY)
		this.constChart.updateControlPoint(coordY)

		this.scalableChart.selectedPointCoordY.set(coordY)
		this.scalableChart.updateControlPoint(coordY)

		this.scalableChart.signalCoords[this.constChart.selectedPointIndex].endY = (this.constChart.signalCoords[this.constChart.selectedPointIndex].endY - this.constChart.coordYStart) / (this.constChart.coordYEnd() - this.constChart.coordYStart) * (this.scalableChart.coordYEnd() - this.scalableChart.coordYStart) + this.scalableChart.coordYStart;

		this.scalableChart.normalizedValues[this.constChart.selectedPointIndex] = 
			this.dataLevels() - ((this.scalableChart.signalCoords[this.constChart.selectedPointIndex].endY - this.scalableChart.coordYStart) / (this.scalableChart.coordYEnd() - this.scalableChart.coordYStart) * (this.dataLevels()))
		

		Chart.calcControlPoints(this.scalableChart.signalCoords)
	}

	onMouseUp() {
		this.constChart.selectedPointIndex = -1;
		this.scalableChart.selectedPointIndex = -1;
	}
}

class Chart implements IChart {
	svgWidth = signal(500);

	coordXStart = 30
	coordXEnd = computed(() => this.svgWidth() - this.coordXStart);

	coordYStart = 75

	tsLength = computed(() => (this.coordXEnd() - this.coordXStart) / 7);

	signalCoords: Bezier[] = [];

	selectedPointIndex = -1;
	selectedPointCoordY = signal(0);
	normalizedValues: number[] = [];

	calcSize(): void {
		this.svgWidth.set(window.innerWidth * 0.9);
	}

	bezierPath(): string {
		let result = `M${this.signalCoords[0].endX} ${this.signalCoords[0].endY}`

		for (let i = 1; i < this.signalCoords.length; i++) {
			result += ` C
				${this.signalCoords[i].firstControlX} ${this.signalCoords[i].firstControlY},
				${this.signalCoords[i].secondControlX} ${this.signalCoords[i].secondControlY},
				${this.signalCoords[i].endX} ${this.signalCoords[i].endY}`
		}

		return result
	}

	static calcControlPoints(signalCoords: Bezier[]) {
		let interval = 0;
		for (let i = signalCoords.length - 1; i > 0; i--) {
			interval = Math.abs(signalCoords[i].endY - signalCoords[i - 1].endY);

			if (signalCoords[i].endY >= signalCoords[i - 1].endY) {
				signalCoords[i].firstControlY = signalCoords[i - 1].endY + (interval / 8);
				signalCoords[i].secondControlY = signalCoords[i].endY - (interval / 8);
			} else {
				signalCoords[i].firstControlY = signalCoords[i - 1].endY - (interval / 8);
				signalCoords[i].secondControlY = signalCoords[i].endY + (interval / 8);
			}
		}

		interval = Math.abs(signalCoords[0].endY - signalCoords[1].endY);

		if (signalCoords[0].endY >= signalCoords[1].endY) {
			signalCoords[0].firstControlY = signalCoords[0].endY - (interval / 8)
			signalCoords[0].secondControlY = signalCoords[0].endY + (interval / 8)
		} else {
			signalCoords[0].firstControlY = signalCoords[0].endY + (interval / 8)
			signalCoords[0].secondControlY = signalCoords[0].endY - (interval / 8)
		}

		return signalCoords;
	}

	static initSignalCoords(coordXStart: number, tsLength: number, startY: number): Bezier[] {
		const result: Bezier[] = [];
		const startControlX = tsLength / 2;

		result.push({
			endX: coordXStart,
			endY: startY,
		})

		for (let i = 1; i < 8; i++) {
			result.push({
				firstControlX: coordXStart + tsLength * (i - 1) + startControlX,
				firstControlY: startY,

				secondControlX: coordXStart + tsLength * (i - 1) + startControlX,
				secondControlY: startY,

				endX: coordXStart + tsLength * i,
				endY: startY,
			})
		}

		return result;
	}
}

class ConstChart extends Chart implements IConstChart {
	svgHeight = signal(500);
	coordYEnd = computed(() => this.svgHeight() - this.coordYStart);
	controlPointInitY = computed(() => this.coordYStart + (this.coordYEnd() - this.coordYStart) / 2);
	magnitude: Signal<number>;

	constructor(magnitude: WritableSignal<number>) {
		super();
		this.signalCoords = ConstChart.initSignalCoords(this.coordXStart, this.tsLength(), this.controlPointInitY());
		this.magnitude = computed(() => magnitude());
	}

	override calcSize() {
		this.svgWidth.set(window.innerWidth * 0.9);
		this.svgHeight.set(window.innerWidth * 0.4);

		this.signalCoords = ConstChart.initSignalCoords(this.coordXStart, this.tsLength(), this.controlPointInitY());
		this.normalizeValues();
	}

	updateControlPoint(coordY: number) {
		if (this.selectedPointIndex === -1) return;

		if (coordY <= this.coordYStart) {
			this.signalCoords[this.selectedPointIndex].endY = this.coordYStart;
		} else if (coordY >= this.coordYEnd()) {
			this.signalCoords[this.selectedPointIndex].endY = this.coordYEnd();
		} else {
			this.signalCoords[this.selectedPointIndex].endY = coordY;
		}

		Chart.calcControlPoints(this.signalCoords)

		this.normalizedValues[this.selectedPointIndex] = 
			this.magnitude() - ((this.signalCoords[this.selectedPointIndex].endY - this.coordYStart) / (this.coordYEnd() - this.coordYStart) * (this.magnitude()))
		
	}

	normalizeValues = computed(() => {
		this.normalizedValues = [];

		let normalized = 0

		for (const signal of this.signalCoords) {
			normalized = (signal.endY - this.coordYStart) / (this.coordYEnd() - this.coordYStart) * (this.magnitude())
			this.normalizedValues.push(
				this.magnitude() - normalized
			);
		}

		return this.normalizedValues;
	})

	timeText = computed(() => `M ${this.coordXEnd() - 100} ${this.coordYEnd() + 30}, ${this.coordXEnd() - 30} ${this.coordYEnd() + 30}, 120`)
}

class ScalableChart extends Chart implements IScalableChart {
	dataLevels: Signal<number>;
	bitsPerPeriod: Signal<number>;

	svgHeight = computed(() => this.dataLevels() * (this.bitsPerPeriod() <= 3 ? 100 : 50));
	controlPointInitY = computed(() => this.coordYStart + (this.coordYEnd() - this.coordYStart) / 2);
	coordYEnd = computed(() => this.svgHeight() - this.coordYStart);
	recalcSignalCoords = computed(() => {
		this.signalCoords = ScalableChart.initSignalCoords(this.coordXStart, this.tsLength(), this.controlPointInitY())

		return this.signalCoords;
	});

	constructor(bitsPerPeriod: WritableSignal<number>) {
		super();
		this.bitsPerPeriod = computed(() => bitsPerPeriod());
		this.dataLevels = computed(() => 2 ** this.bitsPerPeriod());
		this.signalCoords = ScalableChart.initSignalCoords(this.coordXStart, this.tsLength(), this.controlPointInitY());
	}

	override calcSize() {
		this.svgWidth.set(window.innerWidth * 0.9);

		this.signalCoords = ScalableChart.initSignalCoords(this.coordXStart, this.tsLength(), this.controlPointInitY());
	}

	updateControlPoint(coordY: number) {
		if (this.selectedPointIndex === -1) return;

		if (coordY <= this.coordYStart) {
			this.signalCoords[this.selectedPointIndex].endY = this.coordYStart;
		} else if (coordY >= this.coordYEnd()) {
			this.signalCoords[this.selectedPointIndex].endY = this.coordYEnd();
		} else {
			this.signalCoords[this.selectedPointIndex].endY = coordY;
		}

		Chart.calcControlPoints(this.signalCoords)
	}

	normalizeValues = computed(() => {
		this.normalizedValues = [];

		let normalized = 0

		for (const signal of this.signalCoords) {
			normalized = (signal.endY - this.coordYStart) / (this.coordYEnd() - this.coordYStart) * (this.dataLevels())
			this.normalizedValues.push(
				this.dataLevels() - normalized
			);
		}

		return this.normalizedValues;
	})

	timeText = computed(() => `M ${this.coordXEnd() - 100} ${this.coordYEnd() + 30}, ${this.coordXEnd() - 30} ${this.coordYEnd() + 30}, 120`)
}

interface IChart {
	svgWidth: WritableSignal<number>;
	coordXStart: number;
	coordXEnd: Signal<number>;
	coordYStart: number;
	tsLength: Signal<number>;
	signalCoords: Bezier[];
	calcSize(): void;
	bezierPath(): string;
}

interface IConstChart extends IChart {
	svgHeight: WritableSignal<number>;
	coordYEnd: Signal<number>;
}

interface IScalableChart extends IChart {
	svgHeight: Signal<number>;
	coordYEnd: Signal<number>;
}

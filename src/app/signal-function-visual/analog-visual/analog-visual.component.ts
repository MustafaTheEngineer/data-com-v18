import { Component, computed, signal } from '@angular/core';
import { AnalogSignalComponent, LineCoordinates, Sinus } from '../analog-signal/analog-signal.component';

@Component({
	selector: 'app-analog-visual',
	standalone: true,
	imports: [AnalogSignalComponent],
	templateUrl: './analog-visual.component.html',
	styleUrl: './analog-visual.component.scss'
})
export class AnalogVisualComponent {
	ngOnInit() {
		this.calcSignalSum()
	}

	analogSignals: Sinus[] = [
		{
			amplitude: 1,
			frequency: 1,
			phase: 0
		},
		{
			amplitude: 0.33,
			frequency: 3,
			phase: 0
		},
	]

	signalSum = signal<LineCoordinates[]>([]);

	setPhase(phase: HTMLInputElement, index: number) {
		this.analogSignals[index].phase = Number(phase.value);

		this.calcSignalSum()
	}

	setAmplitude(amplitude: HTMLInputElement, index: number) {
		this.analogSignals[index].amplitude = Number(amplitude.value);
		this.calcSignalSum()
	}

	setFrequency(frequency: HTMLInputElement, index: number) {
		this.analogSignals[index].frequency = Number(frequency.value);
		this.calcSignalSum()
	}

	addSignal() {
		this.analogSignals.push({
			amplitude: 1,
			frequency: 1,
			phase: 0
		});

		this.calcSignalSum()
	}

	removeSignal() {
		this.analogSignals.pop();

		this.calcSignalSum()
	}

	calcSignal(amplitude: number, frequency: number, phase: number) {
		let result: LineCoordinates[] = []

		for (let i = 0; i < 200; i+= 0.1) {
			result.push({
				x: i,
				y: 80 - 40 * amplitude * Math.sin(2 * Math.PI * frequency * (i / 100) + phase / 60)
			})
		}

		return result;
	}

	calcSignalSum() {
		this.signalSum.set([]);
		const signalPaths: LineCoordinates[][] = [];
		const signalSum: LineCoordinates[] = [];

		for (const signal of this.analogSignals) {
			signalPaths.push(this.calcSignal(signal.amplitude, signal.frequency, signal.phase))
		}

		for (let i = 0; i < signalPaths[0].length; i++) {
			const newSignal: LineCoordinates = {
				x: signalPaths[0][i].x,
				y: 0
			}
			for (const signal of signalPaths) {
				newSignal.y += signal[i].y
			}
			newSignal.y = (newSignal.y - 80 * signalPaths.length) * (4 / Math.PI) + 80

			signalSum.push(newSignal);
		}
		this.signalSum.set(signalSum);
		console.log(this.signalSum())

		return
	}
}

import { Component, computed, signal } from '@angular/core';
import { AnalogSignalComponent, Sinus } from '../analog-signal/analog-signal.component';

@Component({
  selector: 'app-analog-visual',
  standalone: true,
  imports: [AnalogSignalComponent],
  templateUrl: './analog-visual.component.html',
  styleUrl: './analog-visual.component.scss'
})
export class AnalogVisualComponent {
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

	setPhase (phase: HTMLInputElement, index: number) {
		this.analogSignals[index].phase = Number(phase.value);
	}

	setAmplitude (amplitude: HTMLInputElement, index: number) {
		this.analogSignals[index].amplitude = Number(amplitude.value);
	}

	setFrequency (frequency: HTMLInputElement, index: number) {
		this.analogSignals[index].frequency = Number(frequency.value);
	}

	addSignal () {
		this.analogSignals.push({
			amplitude: 1,
			frequency: 1,
			phase: 0
		});
	}

	removeSignal () {
		this.analogSignals.pop();
	}
}

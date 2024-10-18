import { Component, computed, input } from '@angular/core';

export type Sinus = {
	amplitude: number;
	frequency: number;
	phase: number;
};

export type Point = {
	x: number;
	y: number;
}

@Component({
	selector: 'app-analog-signal',
	standalone: true,
	imports: [],
	templateUrl: './analog-signal.component.html',
	styleUrl: './analog-signal.component.scss',
})
export class AnalogSignalComponent {
	sinus = input<Sinus>({
		amplitude: 0.5,
		frequency: 1,
		phase: 0
	});

	signalSum = input<Point[]>();

	computeSinus = computed(() => {
		const degreeToRad = this.sinus().phase / 360

		const amplitudeHeight = (this.sinus().amplitude === 1 ? -49 : -50) + ((1 - this.sinus().amplitude) * 100);
		const oscillationWidth = 100 / this.sinus().frequency;
		const waveStartShifting = oscillationWidth * degreeToRad

		let result = `M ${0 - waveStartShifting} 50 Q ${(oscillationWidth / 4) - waveStartShifting
			} ${amplitudeHeight}, ${(oscillationWidth / 2) - waveStartShifting} 50 T ${(oscillationWidth / 2) + (oscillationWidth / 2) - waveStartShifting} 50`;

		for (let i = 1; i < this.sinus().frequency * 2 + 2; i++) {
			result += ` Q ${(oscillationWidth / 4) + (oscillationWidth * i) - waveStartShifting} ${amplitudeHeight}, ${(oscillationWidth / 2) + (oscillationWidth * i) - waveStartShifting} 50 T ${(oscillationWidth / 2) + (oscillationWidth * i) + (oscillationWidth / 2) - waveStartShifting} 50`;
		}

		return result;
	});
}

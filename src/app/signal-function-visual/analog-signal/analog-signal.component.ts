import { Component, computed, input } from '@angular/core';

export type Sinus = {
	amplitude: number;
	frequency: number;
	phase: number;
};

export type LineCoordinates = {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

@Component({
	selector: 'app-analog-signal',
	standalone: true,
	imports: [],
	templateUrl: './analog-signal.component.html',
	styleUrl: './analog-signal.component.scss',
})
export class AnalogSignalComponent {
	origin = {
		x: 0,
		y: 50
	}

	sinus = input<Sinus>({
		amplitude: 1,
		frequency: 6,
		phase: 0
	});

	/*computeSinus = computed(() => {
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
	});*/

	drawSinus = computed(() => {
		const waveTopX = 25 / this.sinus().frequency;
		const intervalScaling = (waveTopX * waveTopX) / 50
		const intervalBetweenLines = waveTopX / 100
		let result: LineCoordinates[] = [
			{
				x1: this.origin.x,
				y1: this.origin.y,
				x2: 0,
				y2: (waveTopX * waveTopX) / intervalScaling
			},
		]

		for (let i = 0; i <= waveTopX * 2; i += intervalBetweenLines) {
			result.push({
				x1: result[result.length - 1].x2,
				y1: result[result.length - 1].y2,
				x2: i,
				y2: ((waveTopX - i) * (waveTopX - i)) / intervalScaling
			})
		}

		if (result.length === 201) {
			result.push({
				x1: result[result.length - 1].x2,
				y1: result[result.length - 1].y2,
				x2: result[result.length - 1].x2 + intervalBetweenLines,
				y2: ((waveTopX - intervalBetweenLines) * (waveTopX - intervalBetweenLines)) / intervalScaling
			})
		}

		for (let i = waveTopX * 2; i <= waveTopX * 4; i += intervalBetweenLines) {
			result.push({
				x1: result[result.length - 1].x2,
				y1: result[result.length - 1].y2,
				x2: i,
				y2: (50 - (((waveTopX * 3) - i) * ((waveTopX * 3) - i)) / intervalScaling) + 50
			})
		}

		result.push({
			x1: result[result.length - 1].x2,
			y1: result[result.length - 1].y2,
			x2: result[result.length - 1].x2 + intervalBetweenLines,
			y2: (50 - (((waveTopX * 3) - intervalBetweenLines) * ((waveTopX * 3) - intervalBetweenLines)) / intervalScaling) + 50
		})

		console.log(result)

		return result;
	});
}

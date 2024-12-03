import { Component, computed, signal } from '@angular/core';
import { BinaryDataComponent } from '../../binary-data/binary-data.component';

@Component({
	selector: 'app-digital-to-analog',
	standalone: true,
	imports: [BinaryDataComponent],
	templateUrl: './digital-to-analog.component.html',
	styleUrl: './digital-to-analog.component.scss'
})
export class DigitalToAnalogComponent {
	data = signal('');

	bpsk = computed(() => {
		const result: string[] = []
		let shift = false;
		const toTop = "M 0 70 Q 17.5 -70 35 70 T 70 70 T 105 70 T 140 70"
		const toBottom = "M 0 70 Q 17.5 210 35 70 T 70 70 T 105 70 T 140 70"

		for (let index = 0; index < this.data().length; index++) {
			if (this.data()[index] === '0') {
				if (!shift) {
					result.push(toTop)
				} else{
					result.push(toBottom)
				}
			} else {
				if (!shift) {
					result.push(toBottom)
				} else{
					result.push(toTop)
				}

				shift = !shift
			}
		}

		return result
	})

	technique: 'ask' | 'bfsk' | 'bpsk' = 'ask'

	setSignal($event: string) {
		this.data.set($event)
	}

	leftVerticalStyle(index: number) {
		return {
			'border-left-style': index === 0 ? 'dashed' : this.data()[index] !== this.data()[index - 1] ? 'solid' : 'dashed',
			'opacity': index === 0 ? 'dashed' : this.data()[index] !== this.data()[index - 1] ? '1' : '0.3',
			'border-color': index === 0 ? 'dashed' : this.data()[index] !== this.data()[index - 1] ? 'blue' : 'inherit'
		}
	}

	topSignalStyle(index: number) {
		return {
			'border-color': this.data()[index] === '0' ? 'blue' : 'white',
			'opacity': this.data()[index] === '0' ? '1' : '0.3',
		}
	}

	bottomSignalStyle(index: number) {
		return {
			'border-color': this.data()[index] === '1' ? 'blue' : 'white',
			'opacity': this.data()[index] === '1' ? '1' : '0.3',
		}
	}
}

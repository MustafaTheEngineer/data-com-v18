import { Component, computed, ElementRef, signal, viewChild, viewChildren } from '@angular/core';
import { BinaryDataComponent } from '../../binary-data/binary-data.component';

type ASK = {
	amplitude: number;
	signal: string;
}

type ASKReceiver = {
	signals: ASK[];
	receiverData: string;
}

@Component({
	selector: 'app-digital-to-analog',
	standalone: true,
	imports: [BinaryDataComponent,],
	templateUrl: './digital-to-analog.component.html',
	styleUrl: './digital-to-analog.component.scss'
})
export class DigitalToAnalogComponent {
	data = signal('');
	threshold = 2.5

	waves = viewChildren<ElementRef>('wave')

	askSignals = computed(() => {
		const result: ASKReceiver = {
			signals: [],
			receiverData: ''
		}
		const data: string[] = []

		for (let i = 0; i < this.data().length; i++) {
			if (this.data()[i] === '0') {
				result.signals.push({
					amplitude: 0,
					signal: 'M 0 70 L 140 70',
				})

				data.push('0')

			} else {
				result.signals.push({
					amplitude: 5,
					signal: this.calcSignal(1, 2),
				})

				data.push('1')
			}
		}

		result.receiverData = data.join('');

		return result
	})
	calcSignal(amplitude: number, frequency: number) {
		if (frequency === 0) return 'M 0 70 L 140 70'

		let result = `M 0 70 Q ${35 / frequency} ${-140 * amplitude + 70} ${70 / frequency} 70`

		const shift = 70 / frequency
		let current = 140 / frequency

		for (let i = 0; i < frequency * 2; i++) {
			result += ` T ${current} 70`
			current += shift
		}

		return result
	}

	bpsk = computed(() => {
		const result: string[] = []
		let shift = false;
		const toTop = "M 0 70 Q 17.5 -70 35 70 T 70 70 T 105 70 T 140 70"
		const toBottom = "M 0 70 Q 17.5 210 35 70 T 70 70 T 105 70 T 140 70"

		for (let index = 0; index < this.data().length; index++) {
			if (this.data()[index] === '0') {
				if (!shift) {
					result.push(toTop)
				} else {
					result.push(toBottom)
				}
			} else {
				if (!shift) {
					result.push(toBottom)
				} else {
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

	setThreshold(event: Event) {
		this.threshold = parseFloat((event.target as HTMLInputElement).value)
	}

	setAmplitude(element: HTMLInputElement, index: number) {
		const normalizedValue = Number((parseFloat(element.value) / 5).toString().slice(0, 4))

		const receiverData = this.askSignals().receiverData.split('');
		receiverData[index] = element.valueAsNumber < this.threshold ? '0' : '1'

		this.askSignals().signals[index] = {
			amplitude: element.valueAsNumber,
			signal: this.calcSignal(normalizedValue, 2),
		}
		this.askSignals().receiverData = receiverData.join('')
	}
}

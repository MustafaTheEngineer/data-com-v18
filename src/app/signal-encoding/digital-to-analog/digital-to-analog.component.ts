import { Component, computed, ElementRef, model, signal, viewChild, viewChildren } from '@angular/core';
import { BinaryDataComponent } from '../../binary-data/binary-data.component';

type ASK = {
	signal: string;
	amplitude: number;
}

type ASKReceiver = {
	signals: ASK[];
	receiverData: string;
}

type BFSK = {
	signal: string;
	frequency: number;
}

type BFSKReceiver = {
	signals: BFSK[];
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
	bfskOffsetFrequency = signal(1500)
	bfskOfssetNormalized = computed(() => 3 + 0.0147 * this.bfskOffsetFrequency())

	askSender = computed(() => this.calcASKSignal())
	askReceiver = computed(() => this.calcASKSignal())

	calcASKSignal() {
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
	}

	bfskSignals = computed(() => {
		const result: BFSKReceiver = {
			signals: [],
			receiverData: ''
		}
		const data: string[] = []

		for (let i = 0; i < this.data().length; i++) {
			if (this.data()[i] === '0') {
				result.signals.push({
					frequency: 1000,
					signal: this.calcSignal(1, 1),
				})

				data.push('0')

			} else {
				result.signals.push({
					frequency: 2000,
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

		const receiverData = this.askReceiver().receiverData.split('');
		receiverData[index] = element.valueAsNumber < this.threshold ? '0' : '1'

		this.askReceiver().signals[index] = {
			amplitude: element.valueAsNumber,
			signal: this.calcSignal(normalizedValue, 2),
		}
		this.askReceiver().receiverData = receiverData.join('')
	}

	setFrequency(element: HTMLInputElement, index: number) {
		const normalizedValue = Number((parseFloat(element.value) / 1000).toString().slice(0, 5))
		console.log(normalizedValue)

		const receiverData = this.askReceiver().receiverData.split('');
		receiverData[index] = element.valueAsNumber < this.threshold ? '0' : '1'

		this.bfskSignals().signals[index] = {
			frequency: element.valueAsNumber,
			signal: this.calcSignal(1, normalizedValue),
		}
		this.askReceiver().receiverData = receiverData.join('')
	}

	setBfskOffsetFrequency(event: HTMLInputElement) {
		this.bfskOffsetFrequency.set(event.valueAsNumber)
	}
}

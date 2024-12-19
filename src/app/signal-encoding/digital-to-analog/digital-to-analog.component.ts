import {
	Component,
	computed,
	ElementRef,
	model,
	signal,
	viewChild,
	viewChildren,
} from '@angular/core';
import { BinaryDataComponent } from '../../binary-data/binary-data.component';
import { DecimalDataComponent } from '../../decimal-data/decimal-data.component';

type ASK = {
	signal: string;
	amplitude: number;
};

type ASKReceiver = {
	signals: ASK[];
	receiverData: string;
};

type BFSK = {
	signal: string;
	frequency: number;
};

type BFSKReceiver = {
	signals: BFSK[];
	receiverData: string;
};

@Component({
	selector: 'app-digital-to-analog',
	standalone: true,
	imports: [BinaryDataComponent, DecimalDataComponent],
	templateUrl: './digital-to-analog.component.html',
	styleUrl: './digital-to-analog.component.scss',
})
export class DigitalToAnalogComponent {
	technique: 'ask' | 'mfsk' | 'bfsk' | 'bpsk' | 'dpsk' = 'ask';

	data = signal('');

	setSenderData($event: string) {
		this.data.set($event);
	}

	threshold = 2.5;

	setThreshold(event: Event) {
		this.threshold = parseFloat((event.target as HTMLInputElement).value);
	}

	askSender = computed(() => this.calcASKSignal());
	askReceiver = computed(() => this.calcASKSignal());

	calcASKSignal() {
		const result: ASKReceiver = {
			signals: [],
			receiverData: '',
		};
		const data: string[] = [];

		for (let i = 0; i < this.data().length; i++) {
			if (this.data()[i] === '0') {
				result.signals.push({
					amplitude: 0,
					signal: 'M 0 70 L 140 70',
				});

				data.push('0');
			} else {
				result.signals.push({
					amplitude: 5,
					signal: this.calcSignal(1, 2),
				});

				data.push('1');
			}
		}

		result.receiverData = data.join('');

		return result;
	}

	setAmplitude(element: HTMLInputElement, index: number) {
		const normalizedValue = Number(
			(parseFloat(element.value) / 5).toString().slice(0, 4)
		);

		const receiverData = this.askReceiver().receiverData.split('');
		receiverData[index] = element.valueAsNumber < this.threshold ? '0' : '1';

		this.askReceiver().signals[index] = {
			amplitude: element.valueAsNumber,
			signal: this.calcSignal(normalizedValue, 2),
		};
		this.askReceiver().receiverData = receiverData.join('');
	}

	bfskCarrier = signal(1500);
	bfskOffset = signal(1000);

	f1 = computed(() => {
		const result = (this.bfskCarrier() - this.bfskOffset()) * 0.0217 + 3;
		return result <= 0 ? 3 : result;
	});
	f2 = computed(() => (this.bfskCarrier() + this.bfskOffset()) * 0.0217 + 3);
	bfskRange1 = computed(() =>
		this.bfskCarrier() - this.bfskOffset() <= 0
			? 0
			: this.bfskCarrier() - this.bfskOffset()
	);

	bfskRange2 = computed(() => this.bfskCarrier() + this.bfskOffset());

	bfskCarrierNormalized = computed(() => 3 + 0.0217 * this.bfskCarrier());

	setBfskCarrier(event: HTMLInputElement) {
		this.bfskCarrier.set(event.valueAsNumber);
	}

	setBfskOffset(event: HTMLInputElement) {
		this.bfskOffset.set(event.valueAsNumber);
	}

	bfskSender = computed(() => this.calcBfskSignal());
	bfskReceiver = computed(() => this.calcBfskSignal());

	calcBfskSignal() {
		const result: BFSKReceiver = {
			signals: [],
			receiverData: '',
		};
		const data: string[] = [];

		for (let i = 0; i < this.data().length; i++) {
			if (this.data()[i] === '0') {
				result.signals.push({
					frequency: (this.bfskCarrier() + this.bfskRange2()) / 2,
					signal: this.calcSignal(1, 1),
				});

				data.push('0');
			} else {
				result.signals.push({
					frequency: (this.bfskCarrier() + this.bfskRange1()) / 2,
					signal: this.calcSignal(1, 2),
				});

				data.push('1');
			}
		}

		result.receiverData = data.join('');

		return result;
	}

	setFrequency(element: HTMLInputElement, index: number) {
		const normalizedValue = Number(
			(parseFloat(element.value) / 1000).toString().slice(0, 5)
		);

		const receiverData = this.bfskReceiver().receiverData.split('');

		if (
			element.valueAsNumber >= this.bfskCarrier() - this.bfskOffset() &&
			element.valueAsNumber <= this.bfskCarrier()
		) {
			receiverData[index] = '1';
		} else if (
			element.valueAsNumber >= this.bfskCarrier() &&
			element.valueAsNumber <= this.bfskCarrier() + this.bfskOffset()
		) {
			receiverData[index] = '0';
		} else {
			receiverData[index] = '?';
		}

		this.bfskReceiver().signals[index] = {
			frequency: element.valueAsNumber,
			signal: this.calcSignal(1, normalizedValue),
		};
		this.bfskReceiver().receiverData = receiverData.join('');
	}

	calcSignal(amplitude: number, frequency: number) {
		if (frequency === 0) return 'M 0 70 L 140 70';

		let result = `M 0 70 Q ${35 / frequency} ${-140 * amplitude + 70} ${70 / frequency
			} 70`;

		const shift = 70 / frequency;
		let current = 140 / frequency;

		for (let i = 0; i < frequency * 2; i++) {
			result += ` T ${current} 70`;
			current += shift;
		}

		return result;
	}

	readonly pskTop = 'M 0 70 Q 17.5 -70 35 70 T 70 70 T 105 70 T 140 70';
	readonly pskBottom = 'M 0 70 Q 17.5 210 35 70 T 70 70 T 105 70 T 140 70';

	bpsk = computed(() => this.calcBpskSignal());
	bpskReceiver: { signal: string, bit: string }[] = [];

	calcBpskSignal() {
		const result: string[] = [];
		this.bpskReceiver = [];

		for (let index = 0; index < this.data().length; index++) {
			if (this.data()[index] === '0') {
				result.push(this.pskTop);
				this.bpskReceiver.push({
					signal: this.pskTop,
					bit: '0'
				});
			} else {
				result.push(this.pskBottom);
				this.bpskReceiver.push({
					signal: this.pskBottom,
					bit: '1'
				});
			}
		}

		return result;
	}

	setBpskSignal(index: number) {
		this.bpskReceiver[index].signal = this.bpskReceiver[index].signal === this.pskTop ? this.pskBottom : this.pskTop;
		this.bpskReceiver[index].bit = this.bpskReceiver[index].bit === '0' ? '1' : '0';
	}

	dpsk = computed(() => this.calcDPSKSignal());
	dpskReceiver: { signal: string, bit: string }[] = [];

	calcDPSKSignal() {
		const result: string[] = [];
		this.dpskReceiver = [];

		for (let index = 0; index < this.data().length; index++) {
			if (this.data()[index] === '0') {
				result.push(index == 0 ? this.pskTop : result[index - 1]);
				this.dpskReceiver.push({
					signal: index == 0 ? this.pskTop : result[index - 1],
					bit: '0'
				});
			} else {
				result.push(index == 0 ? this.pskTop : result[index - 1] === this.pskTop ? this.pskBottom : this.pskTop);
				this.dpskReceiver.push({
					signal: index == 0 ? this.pskTop : result[index - 1] === this.pskTop ? this.pskBottom : this.pskTop,
					bit: '1'
				});
			}
		}

		return result;
	}

	setDPSKSignal(index: number) {
		this.dpskReceiver[index].bit = this.dpskReceiver[index].bit === '0' ? '1' : '0';
		let shift = this.dpskReceiver[0].signal;

		for (let i = 1; i < this.dpskReceiver.length; i++) {
			if (this.dpskReceiver[i].bit === '0') {
				this.dpskReceiver[i].signal = shift;
			}
			else {
				this.dpskReceiver[i].signal = shift === this.pskTop ? this.pskBottom : this.pskTop;
				shift = shift === this.pskTop ? this.pskBottom : this.pskTop;
			}
		}
	}

	mfskCarrier = signal(250);
	mfskDiff = signal(25);
	numberOfBits = signal(3);
	mfskM = computed(() => 2 ** this.numberOfBits());
	combinations = computed(() => {
		const result: {
			frequency: number;
			data: string;
			signal: string;
		}[] = [];
		let frequency = 0

		for (let i = 0; i < this.mfskM(); i++) {
			frequency = this.mfskCarrier() + (2 * (i + 1) - 1 - this.mfskM()) * this.mfskDiff();
			result.push({
				frequency,
				data: i
					.toString(2)
					.padStart(this.numberOfBits(), '0')
					.slice(0, this.numberOfBits()),
					signal: this.calcSignal(1, 
						(this.numberOfBits() / 3) * (frequency / (this.mfskCarrier() + (1 - this.mfskM()) * this.mfskDiff()))
					)
			});
		}

		return result;
	});

	mfskTs = computed(() => 1 / (this.mfskDiff() * 2));
	bandwidth = computed(() => 2 * this.mfskM() * this.mfskDiff());
	mfskRate = computed(() => 2 * this.numberOfBits() * this.mfskDiff());
	negativeFrequency = computed(() => this.combinations().findIndex((c) => c.frequency <= 0) !== -1);

	mfskVisualRes = computed(() => this.mfskM() * 75)
	mfskYAxis = computed(() => `M100 ${this.mfskVisualRes() - 20}, 100 10,120`)
	mfskXAxis = computed(() => `M100 ${this.mfskVisualRes() - 30}, ${this.mfskVisualRes() - 20} ${this.mfskVisualRes() - 30},120`)
	xIntervals = computed(() => (this.mfskVisualRes() - 130) / this.mfskM())

	mfskReceiver: {
		partial: string,
		frequency: number,
	}[] = [];
	partialData = computed(() => {
		let result: {
			partial: string,
			index: number,
		}[] = [];
		this.mfskReceiver = [];
		let currentPartial = '';
		for (let i = 0; i < this.data().length; i++) {
			currentPartial += this.data()[i];
			if (currentPartial.length === this.numberOfBits()) {
				result.push({
					partial: currentPartial,
					index: parseInt(currentPartial, 2)
				});
				this.mfskReceiver.push({
					partial: currentPartial.padStart(this.numberOfBits(), '0'),
					frequency: this.combinations()[parseInt(currentPartial, 2)].frequency,
				});
				currentPartial = '';
			}
		}

		if (currentPartial.length) {
			result.push({
				partial: currentPartial.padStart(this.numberOfBits(), '0'),
				index: parseInt(currentPartial, 2)
			});

			this.mfskReceiver.push({
				partial: currentPartial.padStart(this.numberOfBits(), '0'),
				frequency: this.combinations()[parseInt(currentPartial, 2)].frequency,
			});
		}

		return result;
	})

	mfskReceiverSignals = computed(() => {
		const result: string[] = [];

		for (const partial of this.partialData()) {
			result.push(this.combinations()[partial.index].signal);
		}

		return result;
	})

	setMfskReceiverFrequency(event: Event, index: number) {
		const value = (event.target as HTMLInputElement).valueAsNumber;

		if (value <= this.combinations()[0].frequency) {
			this.mfskReceiver[index].frequency = value;
			this.mfskReceiver[index].partial = this.combinations()[0].data;
			this.mfskReceiverSignals()[index] = this.calcSignal(0, 1);
			return;

		} else if (value >= this.combinations()[this.combinations().length - 1].frequency) {
			this.mfskReceiver[index].frequency = value
			this.mfskReceiver[index].partial = this.combinations()[this.combinations().length - 1].data;
			this.mfskReceiverSignals()[index] = this.calcSignal(1, 
				(this.numberOfBits() / 3) * (this.combinations()[this.combinations().length - 1].frequency / (this.mfskCarrier() + (1 - this.mfskM()) * this.mfskDiff()))
			);
			return;
		}

		this.mfskReceiver[index].frequency = value;
		this.mfskReceiverSignals()[index] = this.calcSignal(1, 
			(this.numberOfBits() / 3) * (value / (this.mfskCarrier() + (1 - this.mfskM()) * this.mfskDiff()))
		);

		for (let i = 0; i < this.combinations().length - 1; i++) {
			if (value >= this.combinations()[i].frequency && value <= this.combinations()[i + 1].frequency) {
				this.mfskReceiver[index].partial = this.combinations()[i].data;
				return;
			}
		}
	}
	mfskRangeMin = computed(() => Math.round(this.combinations()[0].frequency - this.combinations()[0].frequency * 0.1));
	mfskRangeMax = computed(() => Math.round(this.combinations()[this.combinations().length - 1].frequency + this.combinations()[this.combinations().length - 1].frequency * 0.1));
}

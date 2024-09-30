import {
	Component,
	computed,
	ElementRef,
	Signal,
	signal,
	viewChildren,
} from '@angular/core';
import { HexDataComponent } from '../../hex-data/hex-data.component';
import { InputDataDirective } from '../../input-data.directive';
import anime from 'animejs';
import { DecimalDataComponent } from '../../decimal-data/decimal-data.component';

type ChecksumData = {
	text: string;
	number1: string;
	number2: string;
	result: string;
};

@Component({
	selector: 'app-internet-checksum',
	standalone: true,
	imports: [HexDataComponent, InputDataDirective, DecimalDataComponent],
	templateUrl: './internet-checksum.component.html',
	styleUrl: './internet-checksum.component.scss',
})
export class InternetChecksumComponent {
	partial = signal(1);
	data = signal('');
	receiverData = signal('');
	animationStep = 0;

	setData(data: string) {
		this.data.set(data);
		this.receiverData.set(data);
	}

	partialSender = computed(() => {
		return this.partialData(this.data());
	});

	partialReceiver = computed(() => {
		return this.partialData(this.receiverData());
	});

	partialData(data: string) {
		if (this.partial() < 2) return data;

		let result = '';
		for (let i = 0; i < data.length; i++) {
			result += data[i];
			if ((i + 1) % this.partial() === 0) result += ' ';
		}

		return result;
	}

	setPartial(data: number | null) {
		if (!data) return;
		this.partial.set(data);
	}

	process(partialData: string) {
		let partialDataArray = partialData.split(' ');

		if (partialDataArray.length < 2) return [];

		let sumView: ChecksumData[] = [
			{
				text: 'Sum partial data',
				number1: partialDataArray[0],
				number2: partialDataArray[1],
				result: (
					Number('0x' + partialDataArray[0]) +
					Number('0x' + partialDataArray[1])
				).toString(16),
			},
		];
		partialDataArray = partialDataArray.slice(2);

		if (sumView[0].result.length > this.partial()) {
			sumView.push({
				text: 'Carry',
				number1: sumView[sumView.length - 1].result.slice(1),
				number2: '1',
				result: (
					Number('0x' + sumView[sumView.length - 1].result.slice(1)) + 1
				).toString(16),
			});

		}

		const lastData = partialDataArray.pop();
		if (lastData && lastData.length === this.partial())
			partialDataArray.push(lastData);

		for (var i = 0; i < partialDataArray.length; i++) {
			sumView.push({
				text: 'Sum partial data',
				number1: sumView[sumView.length - 1].result,
				number2: partialDataArray[i],
				result: (
					Number('0x' + sumView[sumView.length - 1].result) +
					Number('0x' + partialDataArray[i])
				).toString(16),
			});

			if (sumView[sumView.length - 1].result.length > this.partial()) {
				sumView.push({
					text: 'Carry',
					number1: sumView[sumView.length - 1].result.slice(1),
					number2: '1',
					result: (
						Number('0x' + sumView[sumView.length - 1].result.slice(1)) + 1
					).toString(16),
				});

			}
		}

		sumView.push({
			text: "Result of 1's Complement:",
			number1: '',
			number2: '',
			result: Number(
				this.onesComplement(sumView[sumView.length - 1].result)
			).toString(16),
		});

		return sumView;
	}

	senderProcess = computed(() => {
		return this.process(this.partialSender());
	});

	receiverProcess = computed(() => {
		const receiverProcess = this.process(this.partialReceiver());
		if (!receiverProcess.length) return receiverProcess;
		receiverProcess[receiverProcess.length - 1] = {
			text: 'Partial Sum',
			number1: receiverProcess[receiverProcess.length - 2].result,
			number2: this.senderProcess()[this.senderProcess().length - 1].result,
			result: (
				Number('0x' + receiverProcess[receiverProcess.length - 2].result) +
				Number('0x' + this.senderProcess()[this.senderProcess().length - 1].result)
			).toString(16),
		}

		return receiverProcess
	});

	animeDom = viewChildren<ElementRef>('anime');

	animations: Signal<anime.AnimeParams[]> = computed(() => {
		const result: anime.AnimeParams[] = [];

		for (let i = 0; i < this.animeDom().length; i++) {
			if (this.animeDom()[i].nativeElement.className === 'carry') {
				result.push({
					targets: this.animeDom()[i + 1].nativeElement,
					easing: 'easeInOutQuad',
					opacity: [0, 1],
					duration: 500,
				});

				result.push({
					targets: this.animeDom()[i].nativeElement,
					easing: 'easeOutElastic(1, .8)',
					duration: 2000,
					keyframes: [
						{
							translateY:
								this.animeDom()[i + 2].nativeElement.getBoundingClientRect().y -
								this.animeDom()[i].nativeElement.getBoundingClientRect().y,
						},
						{
							translateX:
								this.animeDom()[i + 2].nativeElement.getBoundingClientRect().x -
								this.animeDom()[i].nativeElement.getBoundingClientRect().x,
						},
					],
				});

				i += 2;
			} else {
				result.push({
					targets: this.animeDom()[i].nativeElement,
					easing: 'easeInOutQuad',
					opacity: [0, 1],
					duration: 500,
				});
			}
		}

		return result;
	});
	animationsCompleted: anime.AnimeInstance[] = [];

	onesComplement(hex: string) {
		// Parse the hex string to a number
		let num = parseInt(hex, 16);

		// Get the number of bits required to represent the number
		let numBits = hex.length * 4;

		// Create a mask with all bits set to 1 for the length of the number
		let mask = (1 << numBits) - 1;

		// Perform the one's complement by inverting the bits and masking the result
		let complement = ~num & mask;

		return complement;
	}

	nextProcess() {
		if (this.animationStep > this.animations().length - 1) {
			this.animationStep = 0;
			this.animationsCompleted.forEach((completed) => {
				completed.restart();
				completed.pause();
			});
			this.animationsCompleted = [];
			return;
		}
		const animeInstance = anime(this.animations()[this.animationStep]);
		this.animationsCompleted.push(animeInstance);

		++this.animationStep;
	}

	previousProcess() {
		if (this.animationStep === 0) {
			this.animations().forEach(() => {
				this.nextProcess();
			});
			return;
		}
		this.animationsCompleted[this.animationStep - 1].restart();
		this.animationsCompleted[this.animationStep - 1].pause();
		this.animationsCompleted.pop();

		--this.animationStep;
	}

	onlyContainsF(input: string): boolean {
		const regex = /^[F]*$/;
		return regex.test(input);
	}
}

import { Component, computed, input, output } from '@angular/core';

@Component({
	selector: 'app-nrzi',
	standalone: true,
	imports: [],
	templateUrl: './nrzi.component.html',
	styleUrl: './nrzi.component.scss',
})
export class NrziComponent {
	data = input('');

	senderData = computed(() => {
		this.senderSignal = [];
		let signalLevel: 'top' | 'bottom' = 'top';

		for (let index = 0; index < this.data().length; index++) {
			if (this.data()[index] === '1') {
				signalLevel = signalLevel === 'top' ? 'bottom' : 'top';
			}

			this.senderSignal.push(signalLevel);
		}

		this.receiverSignal = [...this.senderSignal];
		this.receiverData = this.data();

		return this.senderSignal;
	});

	senderSignal: string[] = [];

	receiverData: string = '';
	receiverSignal: string[] = [];

	receiverDataOutput = output<string>()

	highlightTop(item: string, element: HTMLDivElement) {
		if (item !== 'top') {
			element.style.opacity = '0.5';
		}
	}

	dehighlightTop(item: string, element: HTMLDivElement) {
		if (item !== 'top') {
			element.style.opacity = '0.3';
			return;
		}
		element.style.opacity = '1';
	}

	highlightBottom(item: string, element: HTMLDivElement) {
		if (item !== 'bottom') {
			element.style.opacity = '0.5';
		}
	}

	dehighlightBottom(item: string, element: HTMLDivElement) {
		if (item !== 'bottom') {
			element.style.opacity = '0.3';
			return;
		}
		element.style.opacity = '1';
	}

	leftVerticalStyle(index: number, array: string[]) {
		return {
			'border-left-style':
				index === 0
					? 'dashed'
					: array[index] !== array[index - 1]
						? 'solid'
						: 'dashed',
			opacity:
				index === 0
					? 'dashed'
					: array[index] !== array[index - 1]
						? '1'
						: '0.3',
			'border-color':
				index === 0
					? 'dashed'
					: array[index] !== array[index - 1]
						? 'blue'
						: 'inherit',
		};
	}

	topSignalStyle(index: number, array: string[]) {
		const result = {
			'border-color': 'white',
			'opacity': '0.3',
		};

		if (array[index] === 'top') {
			result['opacity'] = '1';
			result['border-color'] = 'blue';
			if (
				array === this.receiverSignal &&
				this.data()[index] !== this.receiverData[index]
			) {
				result['border-color'] = 'red';
			}
		}

		return result;
	}

	bottomSignalStyle(index: number, array: string[]) {
		const result = {
			'border-color': 'white',
			'opacity': '0.3',
		};

		if (array[index] === 'bottom') {
			result['opacity'] = '1';
			result['border-color'] = 'blue';
			if (array === this.receiverSignal) {
				if (this.data()[index] !== this.receiverData[index])
					result['border-color'] = 'red';
				else result['border-color'] = 'blue';
			}
		}

		return result;
	}

	toggleSignal(index: number) {
		this.receiverSignal[index] =
			this.receiverSignal[index] === 'top' ? 'bottom' : 'top';
		
		const data = this.receiverData.split('');
		if (index > 0) {
			if (this.receiverSignal[index - 1] !== this.receiverSignal[index]) 
				data[index] = '1';
			else data[index] = '0';
		}
		if (index < this.receiverSignal.length - 1) {
			if (this.receiverSignal[index] !== this.receiverSignal[index + 1]) 
				data[index + 1] = '1';
			else data[index + 1] = '0';
		}

		this.receiverData = data.join('');
		this.receiverDataOutput.emit(this.receiverData)

		this.errorDetection()
	}

	error = output<string>()

	errorDetection () {
		if (this.data() !== this.receiverData) {
			this.error.emit('Error could not be detected.')
		}
	}
}

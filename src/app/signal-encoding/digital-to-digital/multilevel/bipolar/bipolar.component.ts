import { Component, computed, input, Signal } from '@angular/core';

enum SignalLevel {
	TOP,
	CENTER,
	BOTTOM
}

type MultiLevelSignal = {
	topLeft: boolean;
	bottomLeft: boolean;

	signalLevel: SignalLevel
}

@Component({
	selector: 'app-bipolar',
	standalone: true,
	imports: [],
	templateUrl: './bipolar.component.html',
	styleUrl: './bipolar.component.scss'
})
export class BipolarComponent {
	data = input('');
	senderData = computed(() => this.computeSignal())

	scrambling: 'none' | 'b8zs' | 'hdb3' = 'none';
	scramblingLettersSender: string[] = [];
	scramblingLettersReceiver: string[] = [];

	receiverData = '';

	senderSignal: MultiLevelSignal[] = []
	receiverSignal: MultiLevelSignal[] = []

	applyB8ZS() {
		if (this.scrambling === 'b8zs')
			this.scrambling = 'none';
		else
			this.scrambling = 'b8zs';

		this.computeSignal();
	}

	b8zs() {
		const points = [];
		let currentPoint = this.data().indexOf('00000000', 0);

		this.scrambling = 'b8zs';

		while (currentPoint !== -1) {
			points.push(currentPoint);
			currentPoint = this.data().indexOf('00000000', currentPoint + 8);
		}

		for (let i = 0; i < points.length; i++) {
			let shiftStart = points[i] === 0 ? true : this.senderSignal[points[i] - 1].signalLevel === SignalLevel.TOP ? true : false;

			this.senderSignal[points[i] + 3].signalLevel = shiftStart ? SignalLevel.TOP : SignalLevel.BOTTOM;

			this.senderSignal[points[i] + 3].bottomLeft = !shiftStart;
			this.senderSignal[points[i] + 3].topLeft = shiftStart;

			this.senderSignal[points[i] + 4].signalLevel = shiftStart ? SignalLevel.BOTTOM : SignalLevel.TOP;

			this.senderSignal[points[i] + 4].topLeft = true;
			this.senderSignal[points[i] + 4].bottomLeft = true;

			this.senderSignal[points[i] + 5].bottomLeft = shiftStart;
			this.senderSignal[points[i] + 5].topLeft = !shiftStart;

			this.senderSignal[points[i] + 6].signalLevel = shiftStart ? SignalLevel.BOTTOM : SignalLevel.TOP;

			this.senderSignal[points[i] + 6].topLeft = !shiftStart;
			this.senderSignal[points[i] + 6].bottomLeft = shiftStart;

			this.senderSignal[points[i] + 7].signalLevel = shiftStart ? SignalLevel.TOP : SignalLevel.BOTTOM;

			this.senderSignal[points[i] + 7].topLeft = true;
			this.senderSignal[points[i] + 7].bottomLeft = true;


			if (this.senderSignal[points[i] + 8]) {
				this.senderSignal[points[i] + 8].topLeft = shiftStart;
				this.senderSignal[points[i] + 8].bottomLeft = !shiftStart;
			}

			if (points[i + 1]) {
				for (var j = points[i] + 8; j < points[i + 1]; j++) {
					this.senderSignal[j].signalLevel = !shiftStart ? SignalLevel.TOP : SignalLevel.BOTTOM;
					this.senderSignal[j].signalLevel = !shiftStart ? SignalLevel.TOP : SignalLevel.BOTTOM;
					this.senderSignal[j].topLeft = true;
					this.senderSignal[j].bottomLeft = true;

					shiftStart = !shiftStart;
				}

				this.senderSignal[j].topLeft = this.senderSignal[j - 1].signalLevel === SignalLevel.TOP ? true : false;
				this.senderSignal[j].bottomLeft = this.senderSignal[j - 1].signalLevel === SignalLevel.BOTTOM ? true : false;

			}
		}

		this.receiverSignal = []

		this.senderSignal.forEach((signal) => {
			this.receiverSignal.push({ ...signal });
		})
		this.receiverData = this.data()
		this.scramblingLettersSender = []

		this.scramblingLettersSender = this.putScramblingLetters(this.senderSignal)
		this.scramblingLettersReceiver = [...this.scramblingLettersSender]

		return points;
	}

	computeSignal() {
		this.senderSignal = []
		this.receiverSignal = []

		let signalLevel = SignalLevel.TOP;

		for (let index = 0; index < this.data().length; index++) {
			const newSignal = {
				topLeft: index === 0 ? false : this.data()[index] === '1' && signalLevel === SignalLevel.TOP || this.data()[index - 1] === '1' && signalLevel !== SignalLevel.TOP,
				bottomLeft: index === 0 ? false : this.data()[index] === '1' && signalLevel !== SignalLevel.TOP || this.data()[index - 1] === '1' && signalLevel === SignalLevel.TOP,

				signalLevel: this.data()[index] === '0' ? SignalLevel.CENTER : signalLevel,
			}
			this.senderSignal.push(newSignal);
			this.receiverSignal.push({ ...newSignal });

			if (this.data()[index] === '1') {
				signalLevel = signalLevel === SignalLevel.TOP ? SignalLevel.BOTTOM : SignalLevel.TOP;
			}
		}
		this.receiverData = this.data()

		if (this.scrambling === 'b8zs')
			this.b8zs()

		return this.data()
	}

	topLeftStyle(index: number, signal: MultiLevelSignal[]) {
		return {
			'border-left-color': signal[index].topLeft ? 'blue' : 'white',
			'opacity': signal[index].topLeft ? 1 : 0.3,
		}
	}

	bottomLeftStyle(index: number, signal: MultiLevelSignal[]) {
		return {
			'border-left-color': signal[index].bottomLeft ? 'blue' : 'white',
			'opacity': signal[index].bottomLeft ? 1 : 0.3,
		}
	}

	topSignalStyle(index: number, signal: MultiLevelSignal[]) {
		const result = {
			'border-color': signal[index].signalLevel === SignalLevel.TOP ? 'blue' : 'white',
			'opacity': signal[index].signalLevel === SignalLevel.TOP ? 1 : 0.3,
		}

		if (signal === this.receiverSignal) {
			if (this.scrambling === 'none') {
				if (signal[index].signalLevel === SignalLevel.TOP) {
					const lastTopSignal = signal.slice(0, index + 1).filter((value) => value.signalLevel !== SignalLevel.CENTER)

					if (lastTopSignal.length > 1 && lastTopSignal[lastTopSignal.length - 2].signalLevel === SignalLevel.TOP) {
						result['border-color'] = 'red'
					}
				}
			}

			if (this.senderSignal[index].signalLevel !== signal[index].signalLevel) {
				result['border-color'] = 'red'
			}
		}

		return result
	}

	centerSignalStyle(index: number, signal: MultiLevelSignal[]) {
		const result = {
			'border-color': signal[index].signalLevel === SignalLevel.CENTER ? 'blue' : 'white',
			'opacity': signal[index].signalLevel === SignalLevel.CENTER ? 1 : 0.3,
		}

		if (signal === this.receiverSignal && signal[index].signalLevel === SignalLevel.CENTER) {
			if (this.senderSignal[index].signalLevel !== signal[index].signalLevel) {
				result['border-color'] = 'red'
			}
		}

		return result
	}

	bottomSignalStyle(index: number, signal: MultiLevelSignal[]) {
		const result = {
			'border-color': signal[index].signalLevel === SignalLevel.BOTTOM ? 'blue' : 'white',
			'opacity': signal[index].signalLevel === SignalLevel.BOTTOM ? 1 : 0.3,
		}

		if (signal === this.receiverSignal) {
			if (this.scrambling === 'none') {
				if (signal[index].signalLevel === SignalLevel.BOTTOM) {
					const lastBottomSignal = signal.slice(0, index + 1).filter((value) => value.signalLevel !== SignalLevel.CENTER)

					if (lastBottomSignal.length > 1) {
						if (lastBottomSignal[lastBottomSignal.length - 2].signalLevel === SignalLevel.BOTTOM) {
							result['border-color'] = 'red'
						}
					}
				}
			}

			if (this.senderSignal[index].signalLevel !== signal[index].signalLevel) {
				result['border-color'] = 'red'
			}
		}

		return result
	}

	highlightSignal(element: HTMLDivElement) {
		if (element.style.borderColor === 'white' || element.style.borderTopColor === 'white' || element.style.borderBottomColor === 'white') element.style.opacity = '0.5'
	}

	dehighlightSignal(element: HTMLDivElement) {
		if (element.style.borderColor === 'white' || element.style.borderTopColor === 'white' || element.style.borderBottomColor === 'white') element.style.opacity = '0.3'
	}

	is8Zero(i: number) {
		for (let j = i; j < i + 8; j++) {
			if (this.receiverSignal[j].signalLevel !== SignalLevel.CENTER) {
				return false;
			}
		}

		return true;
	}

	putScramblingLetters(signal: MultiLevelSignal[]) {
		const result: string[] = [];
		this.senderSignal.forEach(signal => {
			result.push('0')
		})
		for (let i = 0; i < signal.length - 7; i++) {
			if (signal[i + 3].signalLevel !== SignalLevel.CENTER && signal[i + 3].signalLevel !== signal[i + 4].signalLevel && signal[i + 5].signalLevel === SignalLevel.CENTER && signal[i + 6].signalLevel === signal[i + 4].signalLevel && signal[i + 7].signalLevel === signal[i + 3].signalLevel) {

				result[i] = '0'
				result[i + 1] = '0'
				result[i + 2] = '0'
				result[i + 3] = 'V'
				result[i + 4] = 'B'
				result[i + 5] = '0'
				result[i + 6] = 'V'
				result[i + 7] = 'B'

				i += 7;
			}
		}

		return result;
	}

	activateSignal(index: number, element: HTMLDivElement) {
		switch (element.className) {
			case 'top-signal':
				this.receiverSignal[index].signalLevel = SignalLevel.TOP
				break;
			case 'center-signal':
				this.receiverSignal[index].signalLevel = SignalLevel.CENTER
				break;
			case 'bottom-signal':
				this.receiverSignal[index].signalLevel = SignalLevel.BOTTOM
				break;
		}

		if (index > 0) {
			this.receiverSignal[index].topLeft = false
			this.receiverSignal[index].bottomLeft = false

			if (this.receiverSignal[index].signalLevel !== this.receiverSignal[index - 1].signalLevel) {
				if (this.receiverSignal[index].signalLevel === SignalLevel.TOP) {
					this.receiverSignal[index].topLeft = true
					if (this.receiverSignal[index - 1].signalLevel === SignalLevel.BOTTOM) {
						this.receiverSignal[index].bottomLeft = true
					}
				} else if (this.receiverSignal[index].signalLevel === SignalLevel.BOTTOM) {
					this.receiverSignal[index].bottomLeft = true
					if (this.receiverSignal[index - 1].signalLevel === SignalLevel.TOP) {
						this.receiverSignal[index].topLeft = true
					}
				} else if (this.receiverSignal[index].signalLevel === SignalLevel.CENTER) {
					if (this.receiverSignal[index - 1].signalLevel === SignalLevel.TOP) {
						this.receiverSignal[index].topLeft = true

					}
					else if (this.receiverSignal[index - 1].signalLevel === SignalLevel.BOTTOM) {
						this.receiverSignal[index].bottomLeft = true
					}
				}
			}
		}
		if (index < this.receiverSignal.length - 1) {
			this.receiverSignal[index + 1].topLeft = false
			this.receiverSignal[index + 1].bottomLeft = false

			if (this.receiverSignal[index].signalLevel !== this.receiverSignal[index + 1].signalLevel) {
				if (this.receiverSignal[index].signalLevel === SignalLevel.TOP) {
					this.receiverSignal[index + 1].topLeft = true
					if (this.receiverSignal[index + 1].signalLevel === SignalLevel.BOTTOM) {
						this.receiverSignal[index + 1].bottomLeft = true
					}
				} else if (this.receiverSignal[index].signalLevel === SignalLevel.BOTTOM) {
					this.receiverSignal[index + 1].bottomLeft = true
					if (this.receiverSignal[index + 1].signalLevel === SignalLevel.TOP) {
						this.receiverSignal[index + 1].topLeft = true
					}
				} else if (this.receiverSignal[index].signalLevel === SignalLevel.CENTER) {
					if (this.receiverSignal[index + 1].signalLevel === SignalLevel.TOP) {
						this.receiverSignal[index + 1].topLeft = true

					}
					else if (this.receiverSignal[index + 1].signalLevel === SignalLevel.BOTTOM) {
						this.receiverSignal[index + 1].bottomLeft = true
					}
				}
			}
		}

		if (this.scrambling === 'none') {
			const signalArray = this.receiverData.split('')
			signalArray[index] = this.receiverSignal[index].signalLevel === SignalLevel.CENTER ? '0' : '1'

			this.receiverData = signalArray.join('')
		} else if (this.scrambling === 'b8zs') {
			this.scramblingLettersReceiver = []

			this.scramblingLettersReceiver = this.putScramblingLetters(this.receiverSignal)
		}
	}

	errorDetected() {
		if (this.scrambling === 'none') {
			const signals = this.receiverSignal.filter((signal) => signal.signalLevel !== SignalLevel.CENTER)

			for (let i = 0; i < signals.length - 1; i++) {
				if (signals[i].signalLevel === signals[i + 1].signalLevel) return "Error detected since signal was not shifted."
			}

			if (this.data() !== this.receiverData) return "Error could not be detected."
		} else if (this.scrambling === 'b8zs') {
			for (let i = 0; i < this.receiverSignal.length - 7; i++) {
				if (this.is8Zero(i))
					return "Error detected since there are 8 signals that passes from the center."
			}

			for (let i = 0; i < this.receiverSignal.length - 7; i++) {
				if (this.receiverSignal[i + 3].signalLevel !== SignalLevel.CENTER && this.receiverSignal[i + 3].signalLevel !== this.receiverSignal[i + 4].signalLevel && this.receiverSignal[i + 5].signalLevel === SignalLevel.CENTER && this.receiverSignal[i + 6].signalLevel === this.receiverSignal[i + 4].signalLevel && this.receiverSignal[i + 7].signalLevel === this.receiverSignal[i + 3].signalLevel){
					i += 8
				}
				else {
					let signalLevel: SignalLevel | undefined = undefined
					for (let j = i; j < i + 8; j++) {
						if (this.receiverSignal[j].signalLevel !== SignalLevel.CENTER) {
							if (signalLevel === undefined) {
								signalLevel = this.receiverSignal[j].signalLevel
								continue
							}
							if (this.receiverSignal[j].signalLevel === signalLevel) {
								return "Error detected since signal was not shifted."
							}
							signalLevel = this.receiverSignal[j].signalLevel
						}
					}
				}

				console.log(i)
			}
		}

		return "";
	}
}

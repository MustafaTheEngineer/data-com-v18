import { Component, computed, input, output, Signal } from '@angular/core';
import { last } from 'rxjs';

enum SignalLevel {
	TOP,
	CENTER,
	BOTTOM
}

type MultiLevelSignal = {
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
	receiverDataOutput = output<string>()

	senderSignal: MultiLevelSignal[] = []
	receiverSignal: MultiLevelSignal[] = []

	hdb3LastShift: SignalLevel = SignalLevel.TOP;
	previousShiftNumber: boolean = true;

	setLastShift(value: boolean) {
		this.hdb3LastShift = value ? SignalLevel.TOP : SignalLevel.BOTTOM;

		this.computeSignal()
	}

	setPreviousShiftNumber(value: boolean) {
		this.previousShiftNumber = value;

		this.computeSignal()
	}

	computeSignal() {
		this.senderSignal = []
		this.receiverSignal = []

		let signalLevel = SignalLevel.TOP;

		for (let index = 0; index < this.data().length; index++) {
			const newSignal = {
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
		else if (this.scrambling === 'hdb3')
			this.hdb3()

		return this.data()
	}

	b8zs() {
		let currentPoint: number = this.data().indexOf('00000000', 0);
		let shift = SignalLevel.TOP;

		while (currentPoint !== -1) {
			for (let j = currentPoint - 1; j >= 0; j--) {
				if (this.senderSignal[j].signalLevel !== SignalLevel.CENTER) {
					shift = this.senderSignal[j].signalLevel;
					break;
				}
			}

			this.senderSignal[currentPoint + 3].signalLevel = shift;
			this.senderSignal[currentPoint + 7].signalLevel = shift;

			this.senderSignal[currentPoint + 4].signalLevel = shift === SignalLevel.TOP ? SignalLevel.BOTTOM : SignalLevel.TOP;
			this.senderSignal[currentPoint + 6].signalLevel = shift === SignalLevel.TOP ? SignalLevel.BOTTOM : SignalLevel.TOP;

			const endPoint = currentPoint + 8;
			currentPoint = this.data().indexOf('00000000', currentPoint + 8);

			if (currentPoint !== -1) {
				for (let index = endPoint; index < currentPoint; index++) {
					if (this.senderSignal[index].signalLevel !== SignalLevel.CENTER) {
						this.senderSignal[index].signalLevel = shift === SignalLevel.TOP ? SignalLevel.BOTTOM : SignalLevel.TOP;
						shift = shift === SignalLevel.TOP ? SignalLevel.BOTTOM : SignalLevel.TOP;
					}
				}
			}
		}

		this.receiverSignal = []

		this.senderSignal.forEach((signal) => {
			this.receiverSignal.push({ ...signal });
		})
		this.receiverData = this.data()
		this.receiverDataOutput.emit(this.receiverData)
		this.scramblingLettersSender = []

		this.scramblingLettersSender = this.b8zsScrambling(this.senderSignal)
		this.scramblingLettersReceiver = [...this.scramblingLettersSender]

		this.errorDetected()
	}

	hdb3() {
		const points = [];
		let nonZeroPulse = 0
		let currentPoint = this.data().indexOf('0000', 0);
		let lastPulse = SignalLevel.TOP;

		while (currentPoint !== -1) {
			points.push(currentPoint);
			currentPoint = this.data().indexOf('0000', currentPoint + 4);
		}

		if (points[0] === 0) {
			this.senderSignal[3].signalLevel = this.hdb3LastShift
		}

		if(points.length === 1) {
			if (this.previousShiftNumber) {
				nonZeroPulse += 2
			} else
				nonZeroPulse++

			if (nonZeroPulse % 2 === 0) {
				this.senderSignal[points[0] + 3].signalLevel = lastPulse
			} else {
				this.senderSignal[points[0] + 3].signalLevel = lastPulse === SignalLevel.TOP ? SignalLevel.BOTTOM : SignalLevel.TOP;
			}
		}

		for (let i = 1; i < points.length; i++) {
			lastPulse = this.senderSignal[points[i - 1] + 3].signalLevel;
			for (var j = points[i - 1] + 4; j < points[i]; j++) {
				if (this.senderSignal[j].signalLevel !== SignalLevel.CENTER) {
					this.senderSignal[j].signalLevel = lastPulse === SignalLevel.TOP ? SignalLevel.BOTTOM : SignalLevel.TOP;
					nonZeroPulse++;
					lastPulse = this.senderSignal[j].signalLevel;
				}
			}

			if (i === 1) {
				if (this.previousShiftNumber) {
					nonZeroPulse += 2
				} else
					nonZeroPulse++
			}

			if (nonZeroPulse % 2 === 0) {
				this.senderSignal[j + 3].signalLevel = lastPulse
			} else {
				this.senderSignal[j].signalLevel = lastPulse === SignalLevel.TOP ? SignalLevel.BOTTOM : SignalLevel.TOP;
				this.senderSignal[j + 3].signalLevel = this.senderSignal[j].signalLevel
			}

			nonZeroPulse = 0;
		}

		this.receiverSignal = []

		this.senderSignal.forEach((signal) => {
			this.receiverSignal.push({ ...signal });
		})
		this.receiverData = this.data()
		this.receiverDataOutput.emit(this.receiverData)
		this.scramblingLettersSender = []

		this.scramblingLettersSender = this.hdb3Scrambling(this.senderSignal)
		this.scramblingLettersReceiver = [...this.scramblingLettersSender]

		this.errorDetected()

		return points;
	}

	applyScrambling(scrambling: 'none' | 'b8zs' | 'hdb3') {
		if (scrambling === this.scrambling) {
			this.scrambling = 'none';
		} else {
			this.scrambling = scrambling;
		}

		return this.computeSignal()
	}

	verticalStyle(index: number, signal: MultiLevelSignal[], isTop: boolean) {
		const result = {
			'border-left-color': 'white',
			'opacity': 0.3,
		}

		if (index === 0 || signal[index].signalLevel === signal[index - 1].signalLevel) return result

		const currentSignal = isTop ? SignalLevel.BOTTOM : SignalLevel.TOP

		if (signal[index - 1].signalLevel === SignalLevel.CENTER && signal[index].signalLevel === currentSignal || signal[index - 1].signalLevel === currentSignal && signal[index].signalLevel === SignalLevel.CENTER) {
			return result
		}

		result['border-left-color'] = 'blue'
		result['opacity'] = 1

		return result
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

	b8zsScrambling(signal: MultiLevelSignal[]) {
		const result: string[] = [];

		for (let index = 0; index < signal.length; index++) {
			result.push('N')
		}

		for (let i = 0; i < signal.length - 7; i++) {
			if (this.receiverSignal[i].signalLevel === SignalLevel.CENTER && this.receiverSignal[i + 1].signalLevel === SignalLevel.CENTER && this.receiverSignal[i + 2].signalLevel === SignalLevel.CENTER) {
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
		}

		return result;
	}

	hdb3Scrambling(signal: MultiLevelSignal[]) {
		const result: string[] = [];

		for (let index = 0; index < signal.length; index++) {
			result.push('N')
		}

		let lastShift = this.hdb3LastShift

		for (let index = 0; index < signal.length; index++) {
			if (signal[index].signalLevel !== SignalLevel.CENTER) {
				if (lastShift === signal[index].signalLevel) {
					if (signal[index - 3]) {
						if (signal[index - 1].signalLevel === SignalLevel.CENTER && signal[index - 2].signalLevel === SignalLevel.CENTER) {
							if (signal[index - 3].signalLevel === SignalLevel.CENTER) {
								result[index] = 'V'
								result[index - 1] = '0'
								result[index - 2] = '0'
								result[index - 3] = '0'
							} else if (signal[index - 3].signalLevel === signal[index].signalLevel) {
								result[index] = 'V'
								result[index - 1] = '0'
								result[index - 2] = '0'
								result[index - 3] = 'B'
							}
						}
					}
				}
				lastShift = signal[index].signalLevel
			}
		}

		return result
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

		if (this.scrambling === 'none') {
			const signalArray = this.receiverData.split('')
			signalArray[index] = this.receiverSignal[index].signalLevel === SignalLevel.CENTER ? '0' : '1'

			this.receiverData = signalArray.join('')
			this.receiverDataOutput.emit(this.receiverData)
		} else if (this.scrambling === 'b8zs') {
			this.scramblingLettersReceiver = []

			this.scramblingLettersReceiver = this.b8zsScrambling(this.receiverSignal)
		}
		else if (this.scrambling === 'hdb3') {
			this.scramblingLettersReceiver = []

			this.scramblingLettersReceiver = this.hdb3Scrambling(this.receiverSignal)
		}

		this.errorDetected()
	}

	error = output<string>();

	errorDetected() {
		let isSame = true;
		for (let i = 0; i < this.senderSignal.length; i++) {
			if (this.senderSignal[i].signalLevel !== this.receiverSignal[i].signalLevel) {
				isSame = false;
			}
		}

		if (isSame) {
			this.error.emit("");
			return
		}

		if (this.scrambling === 'none') {
			const signals = this.receiverSignal.filter((signal) => signal.signalLevel !== SignalLevel.CENTER)

			for (let i = 0; i < signals.length - 1; i++) {
				if (signals[i].signalLevel === signals[i + 1].signalLevel){
					this.error.emit("Error detected since signal was not shifted.")
					return
				}
			}

			if (this.data() !== this.receiverData){
				this.error.emit("Error could not be detected.")
				return
			}
		} else if (this.scrambling === 'b8zs') {
			for (let i = 0; i < this.receiverSignal.length - 7; i++) {
				if (this.is8Zero(i)) {
					this.error.emit("Error detected since there are 8 signals that passes from the center.")
					return
				}
			}

			const points: number[] = [];

			for (let i = 0; i < this.receiverSignal.length - 7; i++) {
				if (this.receiverSignal[i].signalLevel === SignalLevel.CENTER && this.receiverSignal[i + 1].signalLevel === SignalLevel.CENTER && this.receiverSignal[i + 2].signalLevel === SignalLevel.CENTER) {
					points.push(i)
					i += 3
				}
			}

			for (let i = 0; i < points.length - 1; i++) {
				if (this.receiverSignal[points[i] + 3].signalLevel !== SignalLevel.CENTER && this.receiverSignal[points[i] + 3].signalLevel !== this.receiverSignal[points[i] + 4].signalLevel && this.receiverSignal[points[i] + 5].signalLevel === SignalLevel.CENTER && this.receiverSignal[points[i] + 6].signalLevel === this.receiverSignal[points[i] + 4].signalLevel && this.receiverSignal[points[i] + 7].signalLevel === this.receiverSignal[points[i] + 3].signalLevel) {
					let signalLevel: SignalLevel | undefined = undefined
					for (let index = points[i] + 8; index < points[i + 1]; index++) {
						if (this.receiverSignal[index].signalLevel !== SignalLevel.CENTER) {
							if (signalLevel === undefined) {
								signalLevel = this.receiverSignal[index].signalLevel
								continue
							}
							if (this.receiverSignal[index].signalLevel === signalLevel) {
								this.error.emit("Error detected since signal was not shifted.")
								return
							}
							signalLevel = this.receiverSignal[index].signalLevel
						}
					}
				} else {
					let signalLevel: SignalLevel | undefined = undefined
					for (let index = points[i] + 3; index < points[i] + 8; index++) {
						if (this.receiverSignal[index].signalLevel !== SignalLevel.CENTER) {
							if (signalLevel === undefined) {
								signalLevel = this.receiverSignal[index].signalLevel
								continue
							}
							if (this.receiverSignal[index].signalLevel === signalLevel) {
								this.error.emit("Error detected since signal was not shifted.")
								return
							}
							signalLevel = this.receiverSignal[index].signalLevel
						}
					}
				}
			}
		} else if (this.scrambling === 'hdb3') {
			for (let index = 0; index < this.receiverSignal.length; index++) {
				if (this.receiverSignal[index - 3]) {
					if (this.receiverSignal[index].signalLevel === SignalLevel.CENTER && this.receiverSignal[index - 1].signalLevel === SignalLevel.CENTER && this.receiverSignal[index - 2].signalLevel === SignalLevel.CENTER && this.receiverSignal[index - 3].signalLevel === SignalLevel.CENTER) {
						this.error.emit("There can not be 4 consecutive zeros.")
						return
					}

				}
			}
		}

		return "";
	}
}

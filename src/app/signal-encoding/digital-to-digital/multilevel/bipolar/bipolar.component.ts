import { Component, computed, input } from '@angular/core';

type MultiLevelSignal = {
	topLeft: boolean;
	bottomLeft: boolean;

	topSignal: boolean;
	centerSignal: boolean;
	bottomSignal: boolean;
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
	receiverData = '';

	senderSignal: MultiLevelSignal[] = []
	receiverSignal: MultiLevelSignal[] = []

	senderData = computed(() => {
		this.senderSignal = []
		this.receiverSignal = []

		let topSignal = true

		for (let index = 0; index < this.data().length; index++) {
			const newSignal = {
				topLeft: index === 0 ? false : this.data()[index] === '1' && topSignal || this.data()[index - 1] === '1' && !topSignal,
				bottomLeft: index === 0 ? false : this.data()[index] === '1' && !topSignal || this.data()[index - 1] === '1' && topSignal,

				topSignal: this.data()[index] === '0' ? false : topSignal,
				centerSignal: this.data()[index] === '0',
				bottomSignal: this.data()[index] === '0' ? false : !topSignal,
			}
			this.senderSignal.push(newSignal);
			this.receiverSignal.push({ ...newSignal });

			topSignal = this.data()[index] === '1' ? !topSignal : topSignal
		}
		this.receiverData = this.data()

		return this.data()
	})

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
			'border-color': signal[index].topSignal ? (this.data()[index] === '1' ? 'blue' : 'red') : 'white',
			'opacity': signal[index].topSignal ? 1 : 0.3,
		}

		if (signal === this.receiverSignal && signal[index].topSignal) {
			const lastTopSignal = signal.slice(0, index + 1).filter((value) => !value.centerSignal)

			if (lastTopSignal.length > 1) {
				if (lastTopSignal[lastTopSignal.length - 2].topSignal) {
					result['border-color'] = 'red'
				}
			}
		}

		return result
	}

	centerSignalStyle(index: number, signal: MultiLevelSignal[]) {
		return {
			'border-color': signal[index].centerSignal ? (this.data()[index] === '0' ? 'blue' : 'red') : 'white',
			'opacity': signal[index].centerSignal ? 1 : 0.3,
		}
	}

	bottomSignalStyle(index: number, signal: MultiLevelSignal[]) {
		const result = {
			'border-color': signal[index].bottomSignal ? (this.data()[index] === '1' ? 'blue' : 'red') : 'white',
			'opacity': signal[index].bottomSignal ? 1 : 0.3,
		}

		if (signal === this.receiverSignal && signal[index].bottomSignal) {
			const lastBottomSignal = signal.slice(0, index + 1).filter((value) => !value.centerSignal)

			if (lastBottomSignal.length > 1) {
				if (lastBottomSignal[lastBottomSignal.length - 2].bottomSignal) {
					result['border-color'] = 'red'
				}
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

	activateTopSignal(index: number) {
		this.receiverSignal[index].topSignal = true
		this.receiverSignal[index].centerSignal = false
		this.receiverSignal[index].bottomSignal = false

		if (index > 0) {
			this.receiverSignal[index].topLeft = !this.receiverSignal[index - 1].topSignal
			this.receiverSignal[index].bottomLeft = this.receiverSignal[index - 1].bottomSignal
		}
		if (index < this.receiverSignal.length - 1) {
			this.receiverSignal[index + 1].topLeft = !this.receiverSignal[index + 1].topSignal
			this.receiverSignal[index + 1].bottomLeft = this.receiverSignal[index + 1].bottomSignal
		}
	}

	activateCenterSignal(index: number) {
		this.receiverSignal[index].topSignal = false
		this.receiverSignal[index].centerSignal = true
		this.receiverSignal[index].bottomSignal = false

		if (index > 0) {
			this.receiverSignal[index].topLeft = this.receiverSignal[index - 1].topSignal
			this.receiverSignal[index].bottomLeft = this.receiverSignal[index - 1].bottomSignal
		}
		if (index < this.receiverSignal.length - 1) {
			this.receiverSignal[index + 1].topLeft = this.receiverSignal[index + 1].topSignal
			this.receiverSignal[index + 1].bottomLeft = this.receiverSignal[index + 1].bottomSignal
		}
	}

	activateBottomSignal(index: number) {
		this.receiverSignal[index].topSignal = false
		this.receiverSignal[index].centerSignal = false
		this.receiverSignal[index].bottomSignal = true

		if (index > 0) {
			this.receiverSignal[index].topLeft = this.receiverSignal[index - 1].topSignal
			this.receiverSignal[index].bottomLeft = !this.receiverSignal[index - 1].bottomSignal
		}
		if (index < this.receiverSignal.length - 1) {
			this.receiverSignal[index + 1].topLeft = this.receiverSignal[index + 1].topSignal
			this.receiverSignal[index + 1].bottomLeft = !this.receiverSignal[index + 1].bottomSignal
		}
	}
}

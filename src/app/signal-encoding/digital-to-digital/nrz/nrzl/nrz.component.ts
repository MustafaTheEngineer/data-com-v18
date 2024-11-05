import { Component, computed, inject, input } from '@angular/core';

@Component({
	selector: 'app-nrz',
	standalone: true,
	imports: [],
	templateUrl: './nrz.component.html',
	styleUrl: './nrz.component.scss'
})
export class NrzComponent {
	data = input('');

	senderData = computed(() => {
		this.senderSignal = []

		for (let index = 0; index < this.data().length; index++) {
			this.senderSignal.push(this.data()[index] === '0')
		}

		this.receiverSignal = [...this.senderSignal]
		this.receiverData = this.data()

		return this.senderSignal
	})

	senderSignal: boolean[] = []

	receiverData: string = ''
	receiverSignal: boolean[] = []

	highlightTop(item: boolean, element: HTMLDivElement) {
		if (!item) {
			element.style.opacity = '0.5'
		}
	}

	dehighlightTop(item: boolean, element: HTMLDivElement) {
		if (!item) {
			element.style.opacity = '0.3'
			return
		}
		element.style.opacity = '1'
	}

	highlightBottom(item: boolean, element: HTMLDivElement) {
		if (item) {
			element.style.opacity = '0.5'
		}
	}

	dehighlightBottom(item: boolean, element: HTMLDivElement) {
		if (item) {
			element.style.opacity = '0.3'
			return
		}
		element.style.opacity = '1'
	}

	leftVerticalStyle(index: number, array: boolean[]) {
		return {
			'border-left-style': index === 0 ? 'dashed' : array[index] !== array[index - 1] ? 'solid' : 'dashed',
			'opacity': index === 0 ? 'dashed' : array[index] !== array[index - 1] ? '1' : '0.3',
			'border-color': index === 0 ? 'dashed' : array[index] !== array[index - 1] ? 'blue' : 'inherit'
		}
	}

	topSignalStyle(index: number, array: boolean[]) {
		return {
			'border-color': array[index] ? this.data()[index] === '0' ? 'blue' : 'red' : 'white',
			'opacity': array[index] ? '1' : '0.3',
		}
	}

	bottomSignalStyle(index: number, array: boolean[]) {
		return {
			'border-color': !array[index] ? this.data()[index] !== '0' ? 'blue' : 'red' : 'white',
			'opacity': !array[index] ? '1' : '0.3',
		}
	}

	toggleSignal(index: number) {
		this.receiverSignal[index] = !this.receiverSignal[index]
		const data = this.receiverData.split('')
		data[index] = data[index] === '0' ? '1' : '0'

		this.receiverData = data.join('')
	}
}

import { Component, computed, inject, input } from '@angular/core';
import { BiphaseService, BiphaseSignal } from '../biphase.service';

@Component({
	selector: 'app-diff-manchester',
	standalone: true,
	imports: [],
	templateUrl: './diff-manchester.component.html',
	styleUrl: './diff-manchester.component.scss'
})
export class DiffManchesterComponent {
	biphaseService = inject(BiphaseService);

	data = input('');
	senderSignal: BiphaseSignal[] = []

	receiverData = ''
	receiverSignal: BiphaseSignal[] = []

	receivedDataSignal = computed(() => {
		let shift: 'top' | 'bottom' = 'top'
		this.senderSignal = []
		this.receiverSignal = []

		for (let index = 0; index < this.data().length; index++) {
			const newSignal = {
				leftVertical: this.data()[index] === '0',
				centerVertical: true,

				topLeft: shift === 'bottom' && this.data()[index] === '0' || this.data()[index] === '1' && shift === 'top',
				topRight: shift === 'top' && this.data()[index] === '0' || shift === 'bottom' && this.data()[index] === '1',
				bottomLeft: shift === 'top' && this.data()[index] === '0' || shift === 'bottom' && this.data()[index] === '1',
				bottomRight: shift === 'bottom' && this.data()[index] === '0' || shift === 'top' && this.data()[index] === '1',
			}
			this.senderSignal.push(newSignal)
			this.receiverSignal.push({ ...newSignal })
			if (this.data()[index] === '1') shift = shift === 'top' ? 'bottom' : 'top'
		}

		this.receiverData = this.data()

		return this.senderSignal
	})

	centerVerticalStyle(index: number, array: BiphaseSignal[]) {
		return {
			'border-color': array[index].centerVertical ? 'blue' : 'white',
			'opacity': array[index].centerVertical ? 1 : 0
		}
	}

	leftVerticalStyle(index: number, data: string, array: BiphaseSignal[]) {
		const result = {
			'border-color': array[index].leftVertical ? 'blue' : 'white',
			'border-left-style': array[index].leftVertical ? 'solid' : 'dashed',
			'opacity': array[index].leftVertical ? 1 : 0.3
		}

		if (data[index] === '1' && array[index].leftVertical) {
			result['border-color'] = 'red'
		} else if (data[index] === '0' && !array[index].leftVertical) {
			result['border-color'] = 'red'
			result['opacity'] = 1
		}

		return result
	}

	topLeftStyle(index: number, array: BiphaseSignal[]) {
		const result = {
			'opacity': array[index].topLeft ? 1 : 0.3,
			'border-color': array[index].topLeft ? 'blue' : 'white'
		}

		if (array[index].topRight && array[index].topLeft) {
			result['border-color'] = 'red'
		}

		return result;
	}

	topRightStyle(index: number, array: BiphaseSignal[]) {
		const result = {
			'opacity': array[index].topRight ? 1 : 0.3,
			'border-color': array[index].topRight ? 'blue' : 'white'
		}

		if (array[index].topRight && array[index].topLeft) {
			result['border-color'] = 'red'
		}

		return result;
	}

	bottomLeftStyle(index: number, array: BiphaseSignal[]) {
		const result = {
			'opacity': array[index].bottomLeft ? 1 : 0.3,
			'border-color': array[index].bottomLeft ? 'blue' : 'white'
		}

		if (array[index].bottomLeft && array[index].bottomRight) {
			result['border-color'] = 'red'
		}

		return result
	}

	bottomRightStyle(index: number, array: BiphaseSignal[]) {
		const result = {
			'opacity': array[index].bottomRight ? 1 : 0.3,
			'border-color': array[index].bottomRight ? 'blue' : 'white'
		}

		if (array[index].bottomLeft && array[index].bottomRight) {
			result['border-color'] = 'red'
		}

		return result
	}

	activateLeftTop(index: number, array: BiphaseSignal[]) {
		this.biphaseService.activateLeftTop(index, array)

		const dataUpdate = this.receiverData.split('')

		if (array[index].topRight)
			dataUpdate[index] = '?'
		else
			dataUpdate[index] = array[index].leftVertical ? '0' : '1'

		this.receiverData = dataUpdate.join('')
	}

	activateRightTop(index: number, array: BiphaseSignal[]) {
		this.biphaseService.activateRightTop(index, array)

		const dataUpdate = this.receiverData.split('')

		if (array[index].topLeft)
			dataUpdate[index] = '?'
		else
			dataUpdate[index] = array[index].leftVertical ? '0' : '1'

		if (index < array.length - 1) {
			dataUpdate[index + 1] = array[index + 1].leftVertical ? '0' : '1'
		}

		this.receiverData = dataUpdate.join('')
	}

	activateLeftBottom(index: number, array: BiphaseSignal[]) {
		this.biphaseService.activateLeftBottom(index, array)

		const dataUpdate = this.receiverData.split('')

		if (array[index].bottomRight)
			dataUpdate[index] = '?'
		else
			dataUpdate[index] = array[index].leftVertical ? '0' : '1'

		this.receiverData = dataUpdate.join('')
	}

	activateRightBottom(index: number, array: BiphaseSignal[]) {
		this.biphaseService.activateRightBottom(index, array)

		const dataUpdate = this.receiverData.split('')

		if (array[index].bottomLeft)
			dataUpdate[index] = '?'
		else
			dataUpdate[index] = array[index].leftVertical ? '0' : '1'

		if (index < array.length - 1) {
			dataUpdate[index + 1] = array[index + 1].leftVertical ? '0' : '1'
		}

		this.receiverData = dataUpdate.join('')
	}
}

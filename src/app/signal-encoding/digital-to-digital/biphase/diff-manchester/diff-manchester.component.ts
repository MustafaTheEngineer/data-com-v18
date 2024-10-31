import { Component, computed, input } from '@angular/core';
import { BiphaseSignal } from '../biphase.service';

@Component({
	selector: 'app-diff-manchester',
	standalone: true,
	imports: [],
	templateUrl: './diff-manchester.component.html',
	styleUrl: './diff-manchester.component.scss'
})
export class DiffManchesterComponent {
	data = input('');
	receivedSignal: BiphaseSignal[] = []

	receivedDataSignal = computed(() => {
		let shift: 'top' | 'bottom' = 'top'
		this.receivedSignal = []

		for (let index = 0; index < this.data().length; index++) {
			this.receivedSignal.push({
				leftVertical: this.data()[index] === '0',
				centerVertical: true,

				topLeft: shift === 'bottom' && this.data()[index] === '0' || this.data()[index] === '1' && shift === 'top',
				topRight: shift === 'top' && this.data()[index] === '0' || shift === 'bottom' && this.data()[index] === '1',
				bottomLeft: shift === 'top' && this.data()[index] === '0' || shift === 'bottom' && this.data()[index] === '1',
				bottomRight: shift === 'bottom' && this.data()[index] === '0' || shift === 'top' && this.data()[index] === '1',
			})
			if (this.data()[index] === '1') shift = shift === 'top' ? 'bottom' : 'top'
		}

		return this.receivedSignal
	})

	highlightSignal(signal: boolean, element: HTMLDivElement) {
		if (!signal) {
			element.style.opacity = '0.5'
			return
		}
		element.style.borderLeftColor = 'green'
	}

	dehighlightSignal(signal: boolean, element: HTMLDivElement) {
		if (!signal) {
			element.style.opacity = '0.3'
			return
		}
		element.style.borderLeftColor = 'blue'
	}

	centerVerticalStyle(index: number) {
		return {
			'border-color': this.receivedDataSignal()[index].centerVertical ? 'blue' : 'white',
			'opacity': this.receivedDataSignal()[index].centerVertical ? 1 : 0
		}
	}

	leftVerticalStyle(index: number) {
		const result = {
			'border-color': this.receivedSignal[index].leftVertical ? 'blue' : 'white',
			'border-left-style': this.receivedSignal[index].leftVertical ? 'solid' : 'dashed',
			'opacity': this.receivedSignal[index].leftVertical ? 1 : 0.3
		}

		if (this.data()[index] === '1' && this.receivedSignal[index].leftVertical) {
			result['border-color'] = 'red'
		} else if (this.data()[index] === '0' && !this.receivedSignal[index].leftVertical) {
			result['border-color'] = 'red'
			result['opacity'] = 1
		}

		return result
	}

	topLeftStyle(index: number) {
		const result = {
			'opacity': this.receivedDataSignal()[index].topLeft ? 1 : 0.3,
			'border-color': this.receivedDataSignal()[index].topLeft ? 'blue' : 'white'
		}

		if (this.receivedDataSignal()[index].topRight && this.receivedDataSignal()[index].topLeft) {
			result['border-color'] = 'red'
		}

		return result;
	}

	topRightStyle(index: number) {
		const result = {
			'opacity': this.receivedDataSignal()[index].topRight ? 1 : 0.3,
			'border-color': this.receivedDataSignal()[index].topRight ? 'blue' : 'white'
		}

		if (this.receivedDataSignal()[index].topRight && this.receivedDataSignal()[index].topLeft) {
			result['border-color'] = 'red'
		}

		return result;
	}

	bottomLeftStyle(index: number) {
		const result = {
			'opacity': this.receivedDataSignal()[index].bottomLeft ? 1 : 0.3,
			'border-color': this.receivedDataSignal()[index].bottomLeft ? 'blue' : 'white'
		}

		if (this.receivedDataSignal()[index].bottomLeft && this.receivedDataSignal()[index].bottomRight) {
			result['border-color'] = 'red'
		}

		return result
	}

	bottomRightStyle(index: number) {
		const result = {
			'opacity': this.receivedDataSignal()[index].bottomRight ? 1 : 0.3,
			'border-color': this.receivedDataSignal()[index].bottomRight ? 'blue' : 'white'
		}

		if (this.receivedDataSignal()[index].bottomLeft && this.receivedDataSignal()[index].bottomRight) {
			result['border-color'] = 'red'
		}

		return result
	}

	activateLeftTop(item: BiphaseSignal, index: number) {
		item.topLeft = true
		item.bottomLeft = false

		if (item.topRight) item.centerVertical = false
		else item.centerVertical = true

		if (index > 0) {
			if (this.receivedDataSignal()[index - 1].bottomRight) {
				this.receivedSignal[index].leftVertical = true
			} else {
				this.receivedSignal[index].leftVertical = false
			}
		}
	}

	activateRightTop(item: BiphaseSignal, index: number) {
		item.topRight = true
		item.bottomRight = false

		if (item.topLeft) item.centerVertical = false
		else item.centerVertical = true

		if (index < this.receivedSignal.length - 1) {
			if (this.receivedSignal[index + 1].bottomLeft)
				this.receivedSignal[index + 1].leftVertical = true
			else
				this.receivedSignal[index + 1].leftVertical = false
		}
	}

	activateLeftBottom(item: BiphaseSignal, index: number) {
		item.topLeft = false
		item.bottomLeft = true

		if (item.bottomRight) item.centerVertical = false
		else item.centerVertical = true

		if (index > 0) {
			if (this.receivedDataSignal()[index - 1].bottomRight) {
				this.receivedSignal[index].leftVertical = false
			} else {
				this.receivedSignal[index].leftVertical = true
			}
		}
	}

	activateRightBottom(item: BiphaseSignal, index: number) {
		item.topRight = false
		item.bottomRight = true

		if (item.bottomLeft) item.centerVertical = false
		else item.centerVertical = true

		if (index < this.receivedSignal.length - 1) {
			if (this.receivedSignal[index + 1].bottomLeft)
				this.receivedSignal[index + 1].leftVertical = false
			else
				this.receivedSignal[index + 1].leftVertical = true
		}
	}
}

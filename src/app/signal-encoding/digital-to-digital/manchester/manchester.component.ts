import { Component, computed, input } from '@angular/core';

export type BiphaseSignal = {
	leftVertical: boolean;

	topLeft: boolean;
	topRight: boolean;
	bottomLeft: boolean;
	bottomRight: boolean;
}

@Component({
  selector: 'app-manchester',
  standalone: true,
  imports: [],
  templateUrl: './manchester.component.html',
  styleUrl: './manchester.component.scss'
})
export class ManchesterComponent {
	data = input('');
	receivedSignal: BiphaseSignal[] = []

	receivedDataSignal = computed(() => {
		this.receivedSignal = []

		for (let index = 0; index < this.data().length; index++) {
			this.receivedSignal.push({
				leftVertical: index === 0 ? false : this.data()[index - 1] === this.data()[index],

				topLeft: this.data()[index] == '0',
				topRight: this.data()[index] === '1',
				bottomLeft: this.data()[index] == '1',
				bottomRight: this.data()[index] === '0',
			})
		}

		return this.receivedSignal
	})

	signalStyle(signal: boolean) {
		return {
			'opacity': signal ? 1 : 0.3,
			'border-color': signal ? 'blue' : 'white'
		}
	}

	leftVerticalStyle(signal: boolean) {
		return {
			'border-color': signal ? 'blue' : 'white',
			'border-left-style': signal ? 'solid' : 'dashed'
		}
	}

	highlightSignal(signal: boolean, element: HTMLDivElement) {
		if (!signal) {
			element.style.opacity = '0.5'
		}
	}

	dehighlightSignal(signal: boolean, element: HTMLDivElement) {
		if (!signal) {
			element.style.opacity = '0.3'
		}
	}

	activateLeftTop (item: BiphaseSignal, index: number) {
		item.topLeft = true
		item.topRight = false
		item.bottomLeft = false
		item.bottomRight = true

		if (index > 0) {
			if (this.receivedSignal[index - 1].topRight) item.leftVertical = false
			if (this.receivedSignal[index - 1].bottomRight) item.leftVertical = true
		}
		if(this.receivedSignal.length > index + 1) {
			if (this.receivedSignal[index + 1].topLeft) 
				this.receivedSignal[index + 1].leftVertical = true
			if (this.receivedSignal[index + 1].bottomLeft) 
				this.receivedSignal[index + 1].leftVertical = false
		}
	}
}

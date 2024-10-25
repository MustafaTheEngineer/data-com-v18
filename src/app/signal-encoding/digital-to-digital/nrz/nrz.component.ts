import { Component, computed, input, signal } from '@angular/core';

type NRZ = {
	signal: boolean;
}

@Component({
  selector: 'app-nrz',
  standalone: true,
  imports: [],
  templateUrl: './nrz.component.html',
  styleUrl: './nrz.component.scss'
})
export class NrzComponent {
	data = input('');
	nrzType = input<'NRZ-L' | 'NRZI'>('NRZ-L');
	signalExistWhen = computed(() => this.nrzType() === 'NRZ-L' ? '0' : '1');

	receivedDataSignal = computed(() => {
		this.receivedSignal = []
		if (this.data().length == 0) {
			return this.receivedSignal
		}

		this.receivedSignal.push({
			signal: this.signalExistWhen() === this.data()[0],
		})

		for (let index = 1; index < this.data().length; index++) {
			this.receivedSignal.push({
				signal: this.signalExistWhen() === this.data()[index],
			})
		}

		return this.receivedSignal
	})

	receivedSignal: NRZ[] = []

	toggleSignal(item: NRZ) {
		item.signal = !item.signal
	}

	highlightTop(item: NRZ, element: HTMLDivElement) {
		if (!item.signal) {
			element.style.opacity = '0.5'
		}
	}

	dehighlightTop(item: NRZ, element: HTMLDivElement) {
		if (!item.signal) {
			element.style.opacity = '0.3'
			return
		}
		element.style.opacity = '1'
	}

	highlightBottom(item: NRZ, element: HTMLDivElement) {
		if (item.signal) {
			element.style.opacity = '0.5'
		}
	}

	dehighlightBottom(item: NRZ, element: HTMLDivElement) {
		if (item.signal) {
			element.style.opacity = '0.3'
			return
		}
		element.style.opacity = '1'
	}
}

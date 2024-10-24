import { Component, computed, signal } from '@angular/core';
import { BinaryDataComponent } from '../../binary-data/binary-data.component';

type NRZ = {
	left: boolean;
	top: boolean;
	bottom: boolean;
}

@Component({
	selector: 'app-digital-to-digital',
	standalone: true,
	imports: [BinaryDataComponent],
	templateUrl: './digital-to-digital.component.html',
	styleUrl: './digital-to-digital.component.scss'
})
export class DigitalToDigitalComponent {
	data = signal('');
	receivedDataSignal = computed(() => {
		this.receivedSignal = []
		if (this.data().length == 0) {
			return this.receivedSignal
		}

		this.receivedSignal.push({
			left: false,
			top: this.data()[0] === '0',
			bottom: this.data()[0] === '1',
		})

		for (let index = 1; index < this.data().length; index++) {
			this.receivedSignal.push({
				left: this.data()[index - 1] !== this.data()[index],
				top: this.data()[index] === '0',
				bottom: this.data()[index] === '1',
			})
		}

		return this.receivedSignal
	})

	receivedSignal: NRZ[] = []
}

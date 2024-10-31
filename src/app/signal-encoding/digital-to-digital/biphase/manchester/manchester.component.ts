import { Component, computed, inject, input } from '@angular/core';
import { BiphaseService, BiphaseSignal } from '../biphase.service';

@Component({
	selector: 'app-manchester',
	standalone: true,
	imports: [],
	templateUrl: './manchester.component.html',
	styleUrl: './manchester.component.scss'
})
export class ManchesterComponent {
	biphaseService = inject(BiphaseService);

	data = input('');
	receiverData = '';

	senderSignal: BiphaseSignal[] = []
	receiverSignal: BiphaseSignal[] = []

	senderData = computed(() => {
		this.senderSignal = []
		this.receiverSignal = []

		for (let index = 0; index < this.data().length; index++) {
			const newSignal = {
				leftVertical: index === 0 ? false : this.data()[index - 1] === this.data()[index],
				centerVertical: true,

				topLeft: this.data()[index] === '0',
				topRight: this.data()[index] === '1',
				bottomLeft: this.data()[index] === '1',
				bottomRight: this.data()[index] === '0',
			}
			this.senderSignal.push(newSignal)
			this.receiverSignal.push({ ...newSignal })
		}
		this.receiverData = this.data()

		return this.senderSignal
	})

	activateLeftTop(index: number, signals: BiphaseSignal[]) {
		this.biphaseService.activateLeftTop(index, signals)

		const dataUpdate = this.receiverData.split('')
		dataUpdate[index] = signals[index].topRight ? '?' : '0'
		this.receiverData = dataUpdate.join('')
	}

	activateRightTop(index: number, signals: BiphaseSignal[]) {
		this.biphaseService.activateRightTop(index, signals)

		const dataUpdate = this.receiverData.split('')
		dataUpdate[index] = signals[index].topLeft ? '?' : '1'
		this.receiverData = dataUpdate.join('')
	}

	activateLeftBottom(index: number, signals: BiphaseSignal[]) {
		this.biphaseService.activateLeftBottom(index, signals)

		const dataUpdate = this.receiverData.split('')
		dataUpdate[index] = signals[index].bottomRight ? '?' : '1'
		this.receiverData = dataUpdate.join('')
	}

	activateRightBottom(index: number, signals: BiphaseSignal[]) {
		this.biphaseService.activateRightBottom(index, signals)

		const dataUpdate = this.receiverData.split('')
		dataUpdate[index] = signals[index].bottomLeft ? '?' : '0'
		this.receiverData = dataUpdate.join('')
	}
}

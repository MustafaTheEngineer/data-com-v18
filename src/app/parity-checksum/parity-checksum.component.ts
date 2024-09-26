import {
	Component,
	computed,
	ElementRef,
	inject,
	Signal,
	signal,
	WritableSignal,
} from '@angular/core';
import { BinaryDataComponent } from '../binary-data/binary-data.component';
import { DecimalDataComponent } from '../decimal-data/decimal-data.component';
import { MessageComponent } from '../message/message.component';
import { MessageService } from '../message.service';

type ParityCheckTable = {
	dataBits: string[][];
	parityColumn: string[];
	parityRow: string[];
	final: string;
};

@Component({
	selector: 'app-parity-checksum',
	standalone: true,
	imports: [BinaryDataComponent, DecimalDataComponent, MessageComponent],
	templateUrl: './parity-checksum.component.html',
	styleUrl: './parity-checksum.component.scss',
})
export class ParityChecksumComponent {
	messageSerice = inject(MessageService);

	senderData = signal('');
	receiverData = signal('');
	partialData = signal(1);

	parity = computed(() => {
		return this.getParity(this.senderData);
	});

	setSenderData(data: string) {
		this.senderData.set(data);
		this.receiverData.set(data);
	}

	toggleData(signal: WritableSignal<string>, index: number) {
		signal.update(value => value.slice(0, index) + (value[index] === '0' ? '1' : '0') + value.slice(index + 1));
	}

	toggleSender(index: number) {
		this.toggleData(this.senderData, index);
		this.receiverData.set(this.senderData());
	}

	getParity(data: Signal<string>) {
		let count = 0;
		for (const iterator of data()) if (iterator === '1') ++count;

		return count % 2 === 0 ? 1 : 0;
	}

	senderParityTable = computed(() => {
		return this.parityTable(this.senderData);
	});

	receiverParityTable = computed(() => {
		return this.parityTable(this.receiverData);
	});

	errorState = computed(() => {
		if (this.senderData() == this.receiverData())
			return 'No error';

		console.log(this.senderParityTable().parityColumn, this.senderParityTable().parityRow)
		console.log(this.receiverParityTable().parityColumn, this.receiverParityTable().parityRow)

		if (this.senderParityTable().parityColumn.join('') !== this.receiverParityTable().parityColumn.join('') || this.senderParityTable().parityRow.join('') !== this.receiverParityTable().parityRow.join('')) {
			this.messageSerice.setMessage({
				message: 'Error detected',
				type: 'success',
				timeout: 3000,
			})

			return 'Correctable single-bit error';
		}

		this.messageSerice.setMessage({
			message: 'Uncorrectable error pattern detected',
			type: 'warning',
			timeout: 3000,
		})

		return 'Uncorrectable error';


		this.messageSerice.setMessage({
			message: 'No error detected',
			type: 'info',
			timeout: 3000,
		})

	});

	parityTable(data: WritableSignal<string>) {
		let result: ParityCheckTable = {
			dataBits: [],
			parityColumn: [],
			parityRow: [],
			final: '',
		};

		if (data().length % this.partialData() !== 0) return result;

		let k = 0;
		let parityColumnNumber: number;
		let parityRowNumber = 0;

		for (let i = 0; i < this.partialData(); i++) {
			result.dataBits.push([]);
			parityColumnNumber = 0;

			for (let j = 0; j < data().length / this.partialData(); j++) {
				result.dataBits[i][j] = data()[k++];
				if (result.dataBits[i][j] == '1') ++parityColumnNumber;
			}

			parityColumnNumber % 2 == 1
				? result.parityColumn.push('1')
				: result.parityColumn.push('0');
		}

		for (let i = 0; i < result.dataBits[0].length; i++) {
			parityRowNumber = 0;
			for (let j = 0; j < this.partialData(); j++) {
				if (result.dataBits[j][i] == '1') ++parityRowNumber;
			}

			parityRowNumber % 2 == 1
				? result.parityRow.push('1')
				: result.parityRow.push('0');
		}

		for (let i = 0; i < result.parityColumn.length; i++) {
			parityRowNumber = 0;
			if (result.parityColumn[i] == '1') ++parityRowNumber;
			if (result.parityRow[i] == '1') ++parityRowNumber;
		}

		parityRowNumber % 2 == 1 ? (result.final = '1') : (result.final = '0');

		return result;
	}

	getPartialData(data: number) {
		if (data !== 0 && this.receiverData().length % data != 0) {
			this.messageSerice.setMessage({
				message: 'Data length is not divisible by partial data',
				type: 'warning',
				timeout: 6000,
			});
		}
		this.partialData.set(data);
	}
}

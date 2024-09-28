import {
	Component,
	computed,
	ElementRef,
	inject,
	signal,
	viewChild,
	viewChildren,
	WritableSignal,
} from '@angular/core';
import { BinaryDataComponent } from '../../binary-data/binary-data.component';
import { DecimalDataComponent } from '../../decimal-data/decimal-data.component';
import { MessageComponent } from '../../message/message.component';
import { MessageService } from '../../message.service';
import { GuideComponent } from '../../guide/guide.component';

type ParityCheckTable = {
	dataBits: string[];
	parityColumn: string;
	parityRow: string;
	final: string;
};

@Component({
	selector: 'app-parity-checksum',
	standalone: true,
	imports: [BinaryDataComponent, DecimalDataComponent, MessageComponent, GuideComponent],
	templateUrl: './parity-checksum.component.html',
	styleUrl: './parity-checksum.component.scss',
})
export class ParityChecksumComponent {
	visited = false
	ngOnInit() {
		if (document.cookie.includes('parity-checksum=true')) {
			this.visited = true
		} 
	}

	ngOnDestroy() {
		document.cookie = 'parity-checksum=true; SameSite=None; Secure';
	}

	messageService = inject(MessageService);

	senderData = signal('');
	receiverData = signal('');
	columnNumber = signal(1);

	parity = computed(() => {
		return this.getParity(this.senderData());
	});

	countSender1 = computed(() => {
		return this.count1(this.senderData());
	})

	countReceiver1 = computed(() => {
		return this.count1(this.receiverData());
	})

	count1 (data: string) {
		return data.split('1').length - 1;
	}

	setSenderData(data: string) {
		this.senderData.set(data);
		this.receiverData.set(data);
		this.columnNumber.set(1);
	}

	toggleData(signal: WritableSignal<string>, index: number) {
		signal.update(value => value.slice(0, index) + (value[index] === '0' ? '1' : '0') + value.slice(index + 1));
	}

	toggleSender(index: number) {
		this.toggleData(this.senderData, index);
		this.receiverData.set(this.senderData());
	}

	getParity(data: string) {
		let count = 0;
		for (const iterator of data) if (iterator === '1') ++count;

		return count % 2 === 0 ? 1 : 0;
	}

	senderParityTable = computed(() => {
		return this.parityTable(this.senderData);
	});

	receiverParityTable = computed(() => {
		return this.parityTable(this.receiverData);
	});

	errorState = computed(() => {
		if (this.senderData() === this.receiverData())
			return 'No error';

		const differenceCount = this.differentBits(this.senderData(), this.receiverData());

		if (differenceCount === 1) {
			this.messageService.setMessage({
				message: 'Error detected and can be corrected',
				type: 'success',
				timeout: 5000,
			})

			return 'Correctable single-bit error';
		}

		if (this.senderParityTable().parityColumn !== this.receiverParityTable().parityColumn || this.senderParityTable().parityRow !== this.receiverParityTable().parityRow) {
			this.messageService.setMessage({
				message: 'Error detected but cannot be corrected',
				type: 'success',
				timeout: 5000,
			})

			return 'Detectable error';
		}

		this.messageService.setMessage({
			message: 'Uncorrectable error pattern detected',
			type: 'warning',
			timeout: 3000,
		})

		return 'Uncorrectable error';
	});

	differentBits(data1: string, data2: string) {
		let count = 0;
		for (let i = 0; i < data1.length; i++) if (data1[i] !== data2[i]) ++count;
		return count;
	}

	sliceData(data: string, columnNumber: number) {
		let result: string[] = [];
		const partial = data.length / columnNumber;
		for (let i = 0; i < data.length; i += partial) {
			result.push(data.slice(i, i + partial));
		}
		return result;
	}

	parityTable(data: WritableSignal<string>) {
		let result: ParityCheckTable = {
			dataBits: [],
			parityColumn: '',
			parityRow: '',
			final: '',
		};

		if (data().length % this.columnNumber() !== 0) return result;

		let k = 0;
		let parityRowNumber = 0;

		result.dataBits = this.sliceData(data(), this.columnNumber());

		result.dataBits.forEach(value => {
			result.parityColumn += this.getParity(value).toString();
		})

		for (let i = 0; i < result.dataBits[0].length; i++) {
			parityRowNumber = 0;
			for (let j = 0; j < this.columnNumber(); j++) {
				if (result.dataBits[j][i] == '1') ++parityRowNumber;
			}

			parityRowNumber % 2 == 1
				? result.parityRow += '1'
				: result.parityRow += '0';
		}

		for (let i = 0; i < result.parityColumn.length; i++) {
			parityRowNumber = 0;
			if (result.parityColumn[i] == '1') ++parityRowNumber;
			if (result.parityRow[i] == '1') ++parityRowNumber;
		}

		parityRowNumber % 2 == 1 ? (result.final = '1') : (result.final = '0');

		return result;
	}

	getPartialData(data: number | null) {
		if (!data) return
		if (data !== 0 && this.receiverData().length % data != 0) {
			this.messageService.setMessage({
				message: 'Data length is not divisible by partial data',
				type: 'warning',
				timeout: 6000,
			});
		}
		this.columnNumber.set(data);
	}
}

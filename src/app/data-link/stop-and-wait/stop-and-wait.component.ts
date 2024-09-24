import {
	Component,
	computed,
	ElementRef,
	signal,
	viewChild,
	viewChildren,
} from '@angular/core';

export type Frame = {
	id: number;
	data: string;
};

export type Process = {
	id: number;
	frame: Frame;
	node: 'sender' | 'receiver';
	sent: boolean;
	received: boolean;
	startIndex: number;
	endIndex: number;
};

@Component({
	selector: 'app-stop-and-wait',
	standalone: true,
	imports: [],
	templateUrl: './stop-and-wait.component.html',
	styleUrl: './stop-and-wait.component.scss',
})
export class StopAndWaitComponent {
	senderFrames: Frame[] = [
		{ id: 0, data: 'frame 0' },
		{ id: 1, data: 'frame 1' },
		{ id: 2, data: 'frame 2' },
		{ id: 3, data: 'frame 3' },
		{ id: 4, data: 'frame 4' },
		{ id: 5, data: 'frame 5' },
		{ id: 6, data: 'frame 6' },
	];
	receiverFrames: Frame[] = [];
	senderAck = 0;
	receiverAck = 0;

	idTracker = 0;
	timeTracker = signal(0);
	lineNumber = computed(() => [].constructor(this.timeTracker() + 1));

	frameList = signal<Process[]>([]);
	frameSentIndex = 0;
	svg = viewChild.required('svg', { read: ElementRef });
	senderLine = viewChild.required('senderLine', { read: ElementRef });

	dashedLines = viewChildren('dashedLine', { read: ElementRef });
	dashedLineY = computed(
		() =>
			this.dashedLines().map(
				(line) => line.nativeElement.y1.baseVal.value
			) as number[]
	);
	setDashedLinePositions = computed(() => {
		this.dashedLines().forEach((line, index) => {
			line.nativeElement.y1.baseVal.value =
				this.senderLine().nativeElement.y1.baseVal.value + index * 5;
			line.nativeElement.y2.baseVal.value =
				this.senderLine().nativeElement.y1.baseVal.value + index * 5;
		});
		return;
	});

	setHeight = computed(() => {
		if (this.dashedLines().length) {
			if (
				this.dashedLines()[
					this.dashedLines().length - 1
				].nativeElement.getBoundingClientRect().bottom >
				this.svg().nativeElement.getBoundingClientRect().bottom
			) {
				const viewBox = this.svg()
					.nativeElement.getAttribute('viewBox')
					.split(' ');
				viewBox[3] = `${Number(viewBox[3]) + this.frameList().length * 35}`;
				this.svg().nativeElement.setAttribute('viewBox', viewBox.join(' '));
			}
		}
	});

	addFrame(frame: Frame, node: 'sender' | 'receiver') {
		this.timeTracker.update((prev) =>
			node === 'sender' ? prev + 10 : prev + 6
		);

		this.frameList().push({
			frame: {
				id: frame.id,
				data: frame.data,
			},
			id: this.idTracker++,
			node: node,
			sent: true,
			received: true,
			startIndex: this.timeTracker() - 4,
			endIndex: this.timeTracker(),
		});

		this.frameList.set([...this.frameList()]);
	}

	ngOnInit() {
		this.senderFrames.forEach((frame) => {
			this.addFrame(frame, 'sender');
			this.receiverFrames.push({ id: frame.id, data: `ACK ${frame.data}` });
			this.addFrame(
				this.receiverFrames[this.receiverFrames.length - 1],
				'receiver'
			);
		});
	}

	modalVisible = false;
	frameForModal: Process | null = null;

	openModal(frame: Process) {
		this.modalVisible = true;
		this.frameForModal = frame;
	}

	toggleReceived(): void {
		this.frameList()[this.frameForModal!.id].received =
			!this.frameList()[this.frameForModal!.id].received;

		let processCorrupted: Process = this.frameList()[0];
		let processIndex = 0;

		for (let i = 0; i < this.frameList().length; i++) {
			if (this.frameList()[i] === this.frameForModal) {
				processCorrupted = this.frameList()[i];
				processIndex = i;
				break;
			}
		}

		this.frameList.set([...this.frameList().slice(0, processIndex + 1)]);
		this.idTracker = processCorrupted.id + 1;

		if (this.frameForModal?.node === 'sender') {
			
			this.receiverFrames.splice(
				0,
				processCorrupted.frame.id
			);

			this.timeTracker.set(processCorrupted.startIndex + (this.frameForModal.received ? 4 : 6));

			if (this.frameForModal.received) {
				this.receiverFrames.push({
					id: this.senderFrames[processCorrupted.frame.id].id,
					data: `ACK ${this.senderFrames[processCorrupted.frame.id].data}`,
				});
				this.addFrame(
					this.receiverFrames[this.receiverFrames.length - 1],
					'receiver'
				);
			} 

			for (
				let i = processCorrupted.frame.id + (this.frameForModal.received ? 1 : 0);
				i < this.senderFrames.length;
				i++
			) {
				this.addFrame(this.senderFrames[i], 'sender');
				this.receiverFrames.push({
					id: this.senderFrames[i].id,
					data: `ACK ${this.senderFrames[i].data}`,
				});
				this.addFrame(
					this.receiverFrames[this.receiverFrames.length - 1],
					'receiver'
				);
			}
		}
	}

	
}

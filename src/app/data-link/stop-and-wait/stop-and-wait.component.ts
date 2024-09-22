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
	idTracker = 0;
	timeTracker = signal(0);
	lineNumber = computed(() => [].constructor(this.timeTracker()));

	frameList = signal<Process[]>([]);
	processList = computed(() => { });
	frameSentIndex = 0;
	svg = viewChild.required('svg', { read: ElementRef });
	senderLine = viewChild.required('senderLine', { read: ElementRef });

	dashedLines = viewChildren('dashedLine', { read: ElementRef });
	dashedLineY = computed(() =>
		this.dashedLines().map((line) => line.nativeElement.y1.baseVal.value) as number[]
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
				viewBox[3] = `${Number(viewBox[3]) + 100}`;
				this.svg().nativeElement.setAttribute('viewBox', viewBox.join(' '));
			}
		}
	});

	addFrame(frame: Omit<Frame, 'id'>) {
		this.timeTracker.update((prev) => prev + 10);

		this.frameList().push({
			frame: {
				id: this.idTracker++,
				data: frame.data,
			},
			node: 'sender',
			sent: true,
			received: true,
			startIndex: this.timeTracker() - 4,
			endIndex: this.timeTracker(),
		});

		this.timeTracker.update((prev) => prev + 6);

		this.frameList().push({
			frame: {
				id: this.idTracker++,
				data: `ACK ${frame.data}`,
			},
			node: 'receiver',
			sent: true,
			received: true,
			startIndex: this.timeTracker() - 4,
			endIndex: this.timeTracker() - 1,
		});

		this.frameList.set([...this.frameList()]);
	}

	ngAfterViewInit() {
		this.addFrame({ data: 'frame 0' });
	}

	modalVisible = false;
	frameForModal: Process | null = null;

	openModal(frame: Process) {
		this.modalVisible = true;
		this.frameForModal = frame;
	}

	toggleReceived(): void {
		this.frameList()[this.frameForModal!.frame.id].received =
			!this.frameList()[this.frameForModal!.frame.id].received;
	}
}

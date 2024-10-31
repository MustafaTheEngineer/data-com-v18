import { Injectable, signal } from '@angular/core';

export type BiphaseSignal = {
	leftVertical: boolean;
	centerVertical: boolean;

	topLeft: boolean;
	topRight: boolean;
	bottomLeft: boolean;
	bottomRight: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class BiphaseService {

	centerVerticalStyle(index: number, data: string, signals: BiphaseSignal[]) {
		return {
			'border-color': signals[index].topLeft && data[index] === '1' || signals[index].bottomLeft && data[index] === '0' ? 'red' : 'blue',
			'opacity': signals[index].topLeft && signals[index].topRight || signals[index].bottomLeft && signals[index].bottomRight ? 0 : 1
		}
	}

	topLeftStyle(index: number, data: string, signals: BiphaseSignal[]) {
		return {
			'opacity': signals[index].topLeft ? 1 : 0.3,
			'border-color': signals[index].topLeft ? (data[index] === '1' && signals[index].topLeft ? 'red' : 'blue') : 'white'
		}
	}

	topRightStyle(index: number, data: string, signals: BiphaseSignal[]) {
		return {
			'opacity': signals[index].topRight ? 1 : 0.3,
			'border-color': signals[index].topRight ? (data[index] === '0' && signals[index].topRight ? 'red' : 'blue') : 'white'
		}
	}

	bottomRightStyle(index: number, data: string, signals: BiphaseSignal[]) {
		return {
			'opacity': signals[index].bottomRight ? 1 : 0.3,
			'border-color': signals[index].bottomRight ? (data[index] === '1' && signals[index].bottomRight ? 'red' : 'blue') : 'white'
		}
	}

	bottomLeftStyle(index: number, data: string, signals: BiphaseSignal[]) {
		return {
			'opacity': signals[index].bottomLeft ? 1 : 0.3,
			'border-color': signals[index].bottomLeft ? (data[index] === '0' && signals[index].bottomLeft ? 'red' : 'blue') : 'white'
		}
	}

	leftVerticalStyle(signal: boolean) {
		return {
			'border-color': signal ? 'blue' : 'white',
			'border-left-style': signal ? 'solid' : 'dashed'
		}
	}

	highlightSignal(signal: boolean, element: HTMLDivElement) {
		if (!signal) element.style.opacity = '0.5'
	}

	dehighlightSignal(signal: boolean, element: HTMLDivElement) {
		if (!signal) element.style.opacity = '0.3'
	}

	activateLeftTop(index: number, signals: BiphaseSignal[]) {
		signals[index].topLeft = true
		signals[index].bottomLeft = false

		if (signals[index].topRight) signals[index].centerVertical = false
		if (index > 0) signals[index].leftVertical = signals[index - 1].bottomRight
	}

	activateRightTop(index: number, signals: BiphaseSignal[]) {
		signals[index].topRight = true
		signals[index].bottomRight = false

		if (index < signals.length - 1) signals[index + 1].leftVertical = signals[index + 1].bottomLeft
	}

	activateLeftBottom(index: number, signals: BiphaseSignal[]) {
		signals[index].topLeft = false
		signals[index].bottomLeft = true

		if (index > 0) signals[index].leftVertical = !signals[index - 1].bottomRight
	}

	activateRightBottom(index: number, signals: BiphaseSignal[]) {
		signals[index].topRight = false
		signals[index].bottomRight = true

		if (index < signals.length - 1) signals[index + 1].leftVertical = !signals[index + 1].bottomLeft
	}
}

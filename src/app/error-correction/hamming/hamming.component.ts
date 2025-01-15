import { Component, computed, signal } from '@angular/core';

@Component({
	selector: 'app-hamming',
	standalone: true,
	imports: [],
	templateUrl: './hamming.component.html',
	styleUrl: './hamming.component.scss'
})
export class HammingComponent {
	senderData = [1, 0, 0, 1]; // 4 bits of data
	receiverData = [1, 0, 0, 1, 0, 0, 1]; // 7 bits of data
	parityBits = this.calculateParityBits(this.senderData);

	calculateParityBits(dataBits: number[]): number[] {
		// Assume dataBits is of size 4 for Hamming(7,4)
		const p1 = dataBits[0] ^ dataBits[1] ^ dataBits[3];
		const p2 = dataBits[0] ^ dataBits[2] ^ dataBits[3];
		const p3 = dataBits[1] ^ dataBits[2] ^ dataBits[3];

		return [p1, p2, p3];
	}

	// Function to encode data using Hamming(7,4)
	encodeHamming(dataBits: number[]): number[] {
		if (dataBits.length !== 4) {
			throw new Error("Data must be exactly 4 bits.");
		}

		const [p1, p2, p3] = this.calculateParityBits(dataBits);

		// Arrange bits in order: p1, p2, d1, p3, d2, d3, d4
		return [p1, p2, dataBits[0], p3, dataBits[1], dataBits[2], dataBits[3]];
	}

	// Function to decode and correct a received Hamming code
	decodeHamming(receivedBits: number[]): { corrected: number[]; data: number[]; errorPosition: number; } {
		if (receivedBits.length !== 7) {
			throw new Error("Received bits must be exactly 7.");
		}

		const [p1, p2, d1, p3, d2, d3, d4] = receivedBits;

		// Recalculate parity bits based on received data
		const c1 = p1 ^ d1 ^ d2 ^ d4;
		const c2 = p2 ^ d1 ^ d3 ^ d4;
		const c3 = p3 ^ d2 ^ d3 ^ d4;

		// Calculate error position (syndrome)
		const errorPosition = c1 * 1 + c2 * 2 + c3 * 4;

		let correctedBits = [...receivedBits];

		if (errorPosition !== 0) {
			// Correct the error by flipping the bit at the error position
			correctedBits[errorPosition - 1] ^= 1;
		}

		// Extract the original data bits: d1, d2, d3, d4
		const dataBits = [correctedBits[2], correctedBits[4], correctedBits[5], correctedBits[6]];

		return {
			corrected: correctedBits,
			data: dataBits,
			errorPosition,
		};
	}

	ordered7_4 () {
		return [this.receiverData[4], this.receiverData[5], this.receiverData[0], this.receiverData[6], this.receiverData[1], this.receiverData[2], this.receiverData[3]]
	}

	ngAfterViewInit() {
		// Example usage
		const dataBits = [1, 0, 0, 1]; // 4 bits of data
		const encoded = this.encodeHamming(dataBits);
		console.log("Encoded bits:", encoded);

		// Introduce an error for testing
		const received = [...encoded];
		received[1] ^= 1; // Flip bit at position 3
		console.log("Received bits with error:", received);

		const decoded = this.decodeHamming(received);
		console.log("Corrected bits:", decoded.corrected);
		console.log("Original data:", decoded.data);
		console.log("Error position:", decoded.errorPosition);
	}

	toogleSender7_4(index: number) {
		this.senderData[index] = this.senderData[index] === 0 ? 1 : 0;
		this.receiverData = [...this.senderData, ...this.calculateParityBits(this.senderData)]
	}

	toogleReceiver7_4(index: number) {
		this.receiverData[index] = this.receiverData[index] === 0 ? 1 : 0;
	}

	calcXOR(bits: number[]) {
		if (bits.length === 0) return 0;
		if (bits.length === 1) return bits[0];
		let result = bits[0];
		for (let i = 1; i < bits.length; i++) {
			result ^= bits[i];
		}

		return result;
	}

	is7_4Equal() {
		return [...this.senderData, ...this.calculateParityBits(this.senderData)].join('') === this.receiverData.join('');
	}
}

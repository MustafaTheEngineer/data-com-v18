import {
	Component,
	input,
	model,
} from '@angular/core';
import { InputDataDirective } from '../input-data.directive';

@Component({
	selector: 'app-decimal-data',
	standalone: true,
	imports: [InputDataDirective],
	templateUrl: './decimal-data.component.html',
	styleUrl: './decimal-data.component.scss',
})
export class DecimalDataComponent {
	warning = '';
	decimalData = model<number>(0);
	placeholder = input<string | undefined>(undefined);
	value = input<string>('');

	isDecimal(data: string) {
		if (Number.isInteger(Number(data))) {
			this.decimalData.set(Number(data));
			this.warning = '';
			return;
		}
		this.warning = 'Data is not decimal'
	}
}

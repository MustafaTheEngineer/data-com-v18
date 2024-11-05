import { Component, computed, signal } from '@angular/core';
import { BinaryDataComponent } from '../../binary-data/binary-data.component';
import { NrzComponent } from './nrz/nrzl/nrz.component';
import { ManchesterComponent } from './biphase/manchester/manchester.component';
import { DiffManchesterComponent } from './biphase/diff-manchester/diff-manchester.component';
import { BipolarComponent } from './multilevel/bipolar/bipolar.component';
import { NrziComponent } from './nrz/nrzi/nrzi.component';

enum Schemes {
	NRZ = 'NRZ-L',
	NRZI = 'NRZI',
	Manchester = 'Manchester',
	DifferentialManchester = 'Differential Manchester',
	AMI = 'Bipolar AMI',
}

@Component({
	selector: 'app-digital-to-digital',
	standalone: true,
	imports: [BinaryDataComponent, NrzComponent, NrziComponent,ManchesterComponent, DiffManchesterComponent, BipolarComponent],
	templateUrl: './digital-to-digital.component.html',
	styleUrl: './digital-to-digital.component.scss'
})
export class DigitalToDigitalComponent {
	data = signal('');
	scheme: Schemes = Schemes.NRZ;

	schemes = Object.values(Schemes);
}

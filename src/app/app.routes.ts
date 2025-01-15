import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { HexDataComponent } from './hex-data/hex-data.component';
import { InternetChecksumComponent } from './error-detection/internet-checksum/internet-checksum.component';
import { CrcComponent } from './error-detection/crc/crc.component';
import { SlidingWindowComponent } from './data-link/sliding-window/sliding-window.component';
import { HdlcComponent } from './data-link/hdlc/hdlc.component';
import { StopAndWaitComponent } from './data-link/stop-and-wait/stop-and-wait.component';
import { ParityChecksumComponent } from './error-detection/parity-checksum/parity-checksum.component';
import { HomeComponent } from './home/home.component';
import { AnalogVisualComponent } from './signal-function-visual/analog-visual/analog-visual.component';
import { DigitalToDigitalComponent } from './signal-encoding/digital-to-digital/digital-to-digital.component';
import { DigitalToAnalogComponent } from './signal-encoding/digital-to-analog/digital-to-analog.component';
import { PamSimulationComponent } from './signal-encoding/analog-to-digital/pam-simulation/pam-simulation.component';
import { HammingComponent } from './error-correction/hamming/hamming.component';

export const routes: Routes = [
	{
		path: '', component: HomeComponent
		
	},
	{
		path: 'settings', component: SettingsComponent
		
	},
	{
		path: 'hex-data', component: HexDataComponent
	},
	{
		path: 'internet-checksum', component: InternetChecksumComponent
	},
	{
		path: 'crc', component: CrcComponent
	},
	{
		path: 'sliding-window', component: SlidingWindowComponent
	},
	{
		path: 'hdlc', component: HdlcComponent
	},
	{
		path: 'stop-and-wait', component: StopAndWaitComponent
	},
	{
		path: 'parity-checksum', component: ParityChecksumComponent
	},
	{
		path: 'analog-visual', component: AnalogVisualComponent
	},
	{
		path: 'digital-to-digital', component: DigitalToDigitalComponent
	},
	{
		path: 'digital-to-analog', component: DigitalToAnalogComponent
	},
	{
		path: 'analog-to-digital', component: PamSimulationComponent
	},
	{
		path: 'hamming', component: HammingComponent
	}
];

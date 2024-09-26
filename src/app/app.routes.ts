import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { HexDataComponent } from './hex-data/hex-data.component';
import { InternetChecksumComponent } from './internet-checksum/internet-checksum.component';
import { CrcComponent } from './crc/crc.component';
import { SlidingWindowComponent } from './data-link/sliding-window/sliding-window.component';
import { HdlcComponent } from './data-link/hdlc/hdlc.component';
import { StopAndWaitComponent } from './data-link/stop-and-wait/stop-and-wait.component';
import { ParityChecksumComponent } from './parity-checksum/parity-checksum.component';

export const routes: Routes = [
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
];

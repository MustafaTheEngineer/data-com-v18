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
];

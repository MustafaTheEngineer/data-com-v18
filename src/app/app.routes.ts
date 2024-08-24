import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { HexDataComponent } from './hex-data/hex-data.component';
import { InternetChecksumComponent } from './internet-checksum/internet-checksum.component';

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
	
];

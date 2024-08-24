import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { HexDataComponent } from './hex-data/hex-data.component';

export const routes: Routes = [
	{
		path: 'settings', component: SettingsComponent
		
	},
	{
		path: 'hex-data', component: HexDataComponent
	}
];

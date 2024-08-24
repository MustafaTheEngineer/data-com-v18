import { Component, signal, WritableSignal } from '@angular/core';

type ColorInput = {
  title: string;
  color: string;
  styleName: string;
};

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  colors: WritableSignal<ColorInput[]> = signal([
    {
      title: 'Background Color',
      color: '000000',
      styleName: 'background-color',
    },
    {
      title: 'Color',
      color: '000000',
      styleName: 'color',
    },
  ]);

  setColors() {
	const colorInputs = document.querySelectorAll('div input') as NodeListOf<HTMLInputElement>

	for (let i = 0; i < this.colors().length; i++) {
		if (Number.isNaN(Number('0x' + colorInputs[i].value)) === false && colorInputs[i].value.length === 6) {
			document.body.style.setProperty(this.colors()[i].styleName, '#' + colorInputs[i].value)
		}
		
	}
  }
}

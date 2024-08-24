import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[inputData]',
  standalone: true
})
export class InputDataDirective {
  dataFromUser = output<string>()

  @HostListener('keyup', ['$event.target'])
  onClick(btn: HTMLInputElement){
	this.dataFromUser.emit(btn.value);
  }
}

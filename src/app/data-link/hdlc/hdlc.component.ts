import { Component } from '@angular/core';

export type HdlcFrame = {
  id: number;
  data: string;
  acknowledged: boolean;
}

@Component({
  selector: 'app-hdlc',
  standalone: true,
  imports: [],
  templateUrl: './hdlc.component.html',
  styleUrl: './hdlc.component.scss',
})
export class HdlcComponent {}

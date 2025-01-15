import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { sections } from '../sections';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
	sections = sections;
}

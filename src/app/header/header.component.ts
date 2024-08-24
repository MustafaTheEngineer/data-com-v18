import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
	sidebar = signal(false);
  sidebarContainer = computed(() => (this.sidebar() ? 'flex' : 'none'));

  sidebarClick() {
    this.sidebar.update((value) => (value == false ? true : false));
  }

}

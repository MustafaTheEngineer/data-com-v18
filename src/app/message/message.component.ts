import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { MessageService } from '../message.service';
import anime from 'animejs';

@Component({
  selector: 'div[app-message]',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  messageService = inject(MessageService);

  messages = viewChildren<ElementRef>('message');

  animation = computed(() => {
    if (!this.messages().length) return;
    anime({
      targets: this.messages()[this.messages().length - 1].nativeElement,
      opacity: [0, 1],
      easing: 'easeOutCubic',
    });
  });
}

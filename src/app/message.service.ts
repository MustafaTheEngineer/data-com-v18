import { computed, Injectable, signal } from '@angular/core';

export type ManageMessage = {
  id: number;
  message: string;
  timeout?: number;
  type: 'warning' | 'info' | 'success';
};

export type Message = Omit<ManageMessage, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messages = signal<ManageMessage[]>([]);
  getMessages = computed(() => this.messages());
  private messageId = 0;

  setMessage(newMessage: Message) {
    const id = this.messageId;
    this.messages.set([
      ...this.messages(),
      {
        id,
        message: newMessage.message,
        timeout: newMessage.timeout,
        type: newMessage.type,
      },
    ]);

    if (newMessage.timeout) {
      setTimeout(() => {
		if (this.messages().length !== 1) {
			this.messages.set(this.messages().filter((value) => value.id !== id));	
		}
      }, newMessage.timeout);
    }

    ++this.messageId;
  }

  deleteMessage(id: number) {
	this.messages.set(this.messages().filter((value) => value.id !== id));
  }
}

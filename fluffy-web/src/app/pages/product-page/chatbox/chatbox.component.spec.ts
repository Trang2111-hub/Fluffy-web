import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent {
  userMessage: string = '';
  messages: { sender: 'user' | 'bot', text: string }[] = [];

  constructor(private dialogRef: MatDialogRef<ChatboxComponent>) {}

  closeChat() {
    this.dialogRef.close();
  }

  sendMessage() {
    if (this.userMessage.trim()) {
      this.messages.push({ sender: 'user', text: this.userMessage });
      this.userMessage = '';

      setTimeout(() => {
        this.messages.push({ sender: 'bot', text: 'Cảm ơn bạn đã nhắn tin! Mình sẽ hỗ trợ ngay.' });
      }, 1000);
    }
  }

  selectAssistant(type: string) {
    const response = type === 'ai' 
      ? 'Bạn đã chọn Trợ lý AI, mình sẽ giúp bạn ngay!' 
      : 'Bạn đã chọn Tư vấn viên, vui lòng đợi một chút!';
    
    this.messages.push({ sender: 'bot', text: response });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // cho ngModel
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';  // cho mat-icon
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent {
  userMessage = '';
  messages: { sender: 'user' | 'bot', text: string }[] = [];
  selectedAssistant: 'ai' | 'human' | null = null;

  constructor(private dialogRef: MatDialogRef<ChatboxComponent>) {}

  closeChat() {
    this.dialogRef.close();
  }

  selectAssistant(type: 'ai' | 'human') {
    this.selectedAssistant = type;
    const welcomeMessage = type === 'ai' 
      ? 'Xin chào! Mình là trợ lý AI của bạn tại Fluffy. Mình sẵn sàng giúp bạn với câu hỏi về chính sách và tìm kiếm sản phẩm.'
      : 'Xin chào! Mình là tư vấn viên của Fluffy. Mình sẽ hỗ trợ bạn trong quá trình mua sắm.';
    
    this.messages = [{ sender: 'bot', text: welcomeMessage }];
  }

  sendMessage() {
    if (this.userMessage.trim()) {
      this.messages.push({ sender: 'user', text: this.userMessage });
      const currentMessage = this.userMessage;
      this.userMessage = '';

      setTimeout(() => {
        let response = '';
        if (this.selectedAssistant === 'ai') {
          response = 'Cảm ơn bạn đã hỏi! Mình là trợ lý AI sẽ cố gắng hỗ trợ bạn tốt nhất.';
        } else {
          response = 'Cảm ơn bạn đã liên hệ! Tư vấn viên sẽ phản hồi trong thời gian sớm nhất.';
        }
        this.messages.push({
          sender: 'bot',
          text: response
        });
      }, 1000);
    }
  }
}

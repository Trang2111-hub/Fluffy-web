import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-salespolicy',
  standalone: true,
  templateUrl: './salespolicy.component.html',
  styleUrl: './salespolicy.component.css',
  imports: [CommonModule] 
})
export class SalespolicyComponent implements OnInit{
  policies = [
    { id: 'policy-1', title: 'Chính sách đổi trả và bảo hành' },
    { id: 'policy-2', title: 'Chính sách bảo mật' },
    { id: 'policy-3', title: 'Chính sách vận chuyển' },
    { id: 'policy-4', title: 'Chính sách thanh toán' }
  ];

  constructor() {}

  ngOnInit(): void {}

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  }
}

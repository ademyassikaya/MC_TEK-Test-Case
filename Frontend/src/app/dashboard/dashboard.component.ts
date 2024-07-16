import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import axios from 'axios';
import { EditReportModalComponent } from '../edit-report-modal/edit-report-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule, EditReportModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  authService = inject(AuthService);
  router = inject(Router);
  data: any[] = [];
  isEditModalOpen: boolean = false;
  selectedReport: any;

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    axios
      .get('http://localhost:3000/draw/', { headers, withCredentials: false })
      .then((response) => {
        console.log('Veri başarıyla alındı:', response.data);
        this.data = response.data;
      })
      .catch((error) => {
        console.error('Veri alınamadı:', error);
      });
  }

  openEditModal(report: any): void {
    this.selectedReport = report;
    this.isEditModalOpen = true;
  }
  deleteItem(item: any): void {
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    axios
      .delete(`http://localhost:3000/draw/${item.id}`, {
        headers,
        withCredentials: false,
      })
      .then((response) => {
        console.log('Veri başarıyla silindi:', response.data);
        this.getData();
      });
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  updateReport(updatedReport: any): void {
    const index = this.data.findIndex((item) => item.id === updatedReport.id);
    if (index !== -1) {
      this.data[index] = updatedReport;
    }
    this.closeEditModal();
  }
}

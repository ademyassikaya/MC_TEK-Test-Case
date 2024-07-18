import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { AuthService } from '../auth/auth.service';
import { EditReportModalComponent } from '../edit-report-modal/edit-report-modal.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [NavbarComponent, CommonModule, EditReportModalComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent {
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
        this.data = response.data;
      })
      .catch((error) => {
        console.error('Data could not be retrieved:', error);
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

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-edit-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-report-modal.component.html',
  styleUrl: './edit-report-modal.component.css',
})
export class EditReportModalComponent {
  @Input() report: any;
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<any>();

  updatedReport: any = {};

  ngOnChanges(): void {
    if (this.report) {
      this.updatedReport = { ...this.report };
    }
  }

  saveChanges(): void {
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    axios
      .put(
        `http://localhost:3000/draw/${this.updatedReport.id}`,
        {
          name: this.updatedReport.name,
          size: this.updatedReport.size,
          type: this.updatedReport.kind,
          coordinates: this.updatedReport.coordinates,
        },
        { headers, withCredentials: false }
      )
      .then((response) => {
        this.update.emit(response.data);
        this.close.emit();
      })
      .catch((error) => {
        console.error('Veri güncellenemedi:', error);
      });
  }

  closeModal(): void {
    this.close.emit();
  }
}

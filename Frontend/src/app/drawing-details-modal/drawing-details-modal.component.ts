import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-drawing-details-modal',
  standalone: true,
  templateUrl: './drawing-details-modal.component.html',
  styleUrls: ['./drawing-details-modal.component.css'],
  imports: [CommonModule, FormsModule],
})
export class DrawingDetailsModalComponent {
  @Input() showModal = false;
  @Input() drawingType = '';
  @Input() drawingSize = 0;
  @Output() save = new EventEmitter<{
    name: string;
    type: string;
    size: number;
  }>();
  @Output() cancel = new EventEmitter<void>();

  drawingName = '';
  ngOnChanges(changes: any) {
    if (
      changes.showModal &&
      !changes.showModal.firstChange &&
      !changes.showModal.currentValue
    ) {
      this.reset();
    }
  }

  onSave() {
    this.save.emit({
      name: this.drawingName,
      type: this.drawingType,
      size: this.drawingSize,
    });
  }

  onCancel() {
    this.cancel.emit();
  }

  private reset() {
    this.drawingName = ''; // Reset drawingName
  }

  getUnit(type: string): string {
    return type === 'Polygon' || type === 'Circle' ? 'm²' : 'm'; // Adjust as per your requirements
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenLayersMapService } from '../open-layers-map.service';

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
  @Output() onDelete = new EventEmitter<void>();

  drawingName = '';
  openLayersMapService = inject(OpenLayersMapService);
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
  onDeleteDrawing() {
    this.onDelete.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  isNewDrawing(): boolean {
    const existingDrawingId = this.openLayersMapService.getModifiedDrawingId();
    return existingDrawingId ? false : true;
  }
  private reset() {
    this.drawingName = '';
  }

  getUnit(type: string): string {
    return type === 'Polygon' || type === 'Circle' ? 'm²' : 'm';
  }
}

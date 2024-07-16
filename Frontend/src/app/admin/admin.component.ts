import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import { DrawEvent } from 'ol/interaction/Draw';
import { OpenLayersMapService } from '../open-layers-map.service';
import { DrawingDetailsModalComponent } from '../drawing-details-modal/drawing-details-modal.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../auth/auth.service';
import { Circle, Point } from 'ol/geom';
import axios from 'axios';
import { ModifyEvent } from 'ol/interaction/Modify';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DrawingDetailsModalComponent,
    NavbarComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements AfterViewInit {
  ngOnInit(): void {
    console.log(0);
    // this.getData();
  }
  openLayersMapService = inject(OpenLayersMapService);
  httpClient = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  showModal = false;
  drawingType = '';
  drawingSize = 0;
  flatCoordinates = {};
  name = '';
  drawData = {};

  onDrawingModeChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.openLayersMapService.setDrawingMode(selectedValue);
  }

  ngOnDestroy(): void {
    this.openLayersMapService.setMapUndefined();
  }

  ngAfterViewInit(): void {
    this.openLayersMapService.viewChanged.subscribe(({ center, zoom }) => {});

    this.openLayersMapService.initializeMap('map');

    if (this.openLayersMapService?.getMap()) {
      this.getData();
    }

    this.openLayersMapService.drawEnd.subscribe((event: DrawEvent) => {
      const feature = event.feature;
      const geometry: Geometry | undefined = feature.getGeometry();
      if (geometry) {
        if (geometry instanceof Polygon) {
          this.flatCoordinates = this.flattenCoordinates(
            geometry.getCoordinates()[0]
          );
        } else if (geometry instanceof LineString) {
          this.flatCoordinates = this.flattenCoordinates(
            geometry.getCoordinates()
          );
        } else if (geometry instanceof Circle) {
          const center = geometry.getCenter();
          const radius = geometry.getRadius();
          this.flatCoordinates = [
            center[0] - radius,
            center[1],
            center[0],
            center[1] + radius,
            center[0] + radius,
            center[1],
            center[0],
            center[1] - radius,
            center[0] - radius,
            center[1],
          ];
        } else if (geometry instanceof Point) {
          const coordinates = geometry.getCoordinates();
          this.flatCoordinates = coordinates;
          console.log('trt1', this.flatCoordinates);
        }
        this.drawingType = geometry.getType();
        this.drawingSize = this.calculateSize(geometry);
        this.showModal = true;
      }
    });
    this.openLayersMapService.modifyEnd.subscribe((event: ModifyEvent) => {
      const features = event.features.getArray();
      if (features.length > 0) {
        const feature = features[0]; // Assuming modifying only one feature at a time
        const geometry: Geometry | undefined = feature.getGeometry();
        if (geometry) {
          let coordinates: number[] = [];
          if (geometry instanceof Polygon) {
            coordinates = this.flattenCoordinates(geometry.getCoordinates()[0]);
          } else if (geometry instanceof LineString) {
            coordinates = this.flattenCoordinates(geometry.getCoordinates());
          } else if (geometry instanceof Circle) {
            const center = geometry.getCenter();
            const radius = geometry.getRadius();
            coordinates = [
              center[0] - radius,
              center[1],
              center[0],
              center[1] + radius,
              center[0] + radius,
              center[1],
              center[0],
              center[1] - radius,
              center[0] - radius,
              center[1],
            ];
          } else if (geometry instanceof Point) {
            const coordinates = geometry.getCoordinates();
            this.flatCoordinates = [coordinates[0], coordinates[1]];
            console.log('trt', this.flatCoordinates);
          }
          this.drawingType = geometry.getType();
          this.drawingSize = this.calculateSize(geometry);
          this.showModal = true;
          // Assuming flatCoordinates is an array or object property
          this.flatCoordinates = coordinates; // Update flatCoordinates property
        }
      }
    });
  }

  flattenCoordinates(coordinates: number[][]): number[] {
    return coordinates.flat();
  }

  calculateSize(geometry: Geometry): number {
    if (geometry instanceof Polygon) {
      return this.calculatePolygonArea(geometry);
    } else if (geometry instanceof LineString) {
      return this.calculateLineLength(geometry);
    } else if (geometry instanceof Circle) {
      return this.calculateCircleArea(geometry);
    }
    return 0;
  }

  calculatePolygonArea(polygon: Polygon): number {
    const area = polygon.getArea();
    return area;
  }

  calculateLineLength(lineString: LineString): number {
    const length = lineString.getLength();
    return length;
  }

  calculateCircleArea(circle: Circle): number {
    const area = Math.PI * Math.pow(circle.getRadius(), 2);
    return area;
  }
  getData() {
    // Örnek kullanıcı kimliği, gerçek projenizde bu değeri kullanıcı oturum açma işleminden almalısınız.
    const accessToken = localStorage.getItem('accessToken');
    // Axios kullanarak GET isteği gönderme
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    axios
      .get(`http://localhost:3000/draw/`, {
        headers,
        withCredentials: false,
      })
      .then((response) => {
        console.log('Veri:', response.data);
        this.openLayersMapService.loadDrawings(response.data);
        // İşlemlerinizi burada gerçekleştirin.
      })
      .catch((error) => {
        console.error('Hata oluştu:', error);
      });
  }

  onSaveDrawing(details: { name: string; type: string; size: number }) {
    // size bilgisini string parse edermisin
    const sizeParse = details.size.toString();

    const drawingData = {
      name: details.name,
      kind: details.type,
      size: sizeParse,
      coordinates: this.flatCoordinates,
    };

    // Get accessToken from localStorage
    const accessToken = localStorage.getItem('accessToken');

    // Include accessToken in Axios request headers
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const existingDrawingId = this.openLayersMapService.getModifiedDrawingId();
    if (existingDrawingId) {
      axios
        .put(`http://localhost:3000/draw/${existingDrawingId}`, drawingData, {
          headers,
          withCredentials: false,
        })
        .then((response) => {
          this.openLayersMapService.setDrawingMode(this.drawingType);
          this.showModal = false;
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error updating drawing:', error);
        });
    } else {
      axios
        .post('http://localhost:3000/draw/create', drawingData, {
          headers,
          withCredentials: false,
        })
        .then((response) => {
          this.openLayersMapService.setDrawingMode(this.drawingType);
          const newDrawingId = response.data.id;
          this.openLayersMapService.setModifiedDrawingId(newDrawingId);

          this.showModal = false;
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error saving drawing:', error);
        });
    }
  }

  onDeleteDrawing() {
    const existingDrawingId = this.openLayersMapService.getModifiedDrawingId();
    if (existingDrawingId) {
      // Get accessToken from localStorage
      const accessToken = localStorage.getItem('accessToken');

      // Include accessToken in Axios request headers
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      axios
        .delete(`http://localhost:3000/draw/${existingDrawingId}`, {
          headers,
          withCredentials: false,
        })
        .then((response) => {
          this.openLayersMapService.setDrawingMode(this.drawingType);
          this.openLayersMapService.setModifiedDrawingId(null);
          this.showModal = false;
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error deleting drawing:', error);
        });
    }
  }

  onCancelDrawing() {
    this.showModal = false;
    // Keep drawing mode for the current type
    this.openLayersMapService.setDrawingMode(this.drawingType);
  }
}

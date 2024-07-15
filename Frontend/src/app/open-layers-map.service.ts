import { Injectable, EventEmitter } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Draw, Modify, Snap } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw'; // Correct import for DrawEvent
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle';
import { ModifyEvent } from 'ol/interaction/Modify';

@Injectable({
  providedIn: 'root',
})
export class OpenLayersMapService {
  private map!: Map;
  private vectorSource!: VectorSource;
  private drawInteraction?: Draw;
  drawEnd = new EventEmitter<DrawEvent>();
  modifyEnd = new EventEmitter<ModifyEvent>(); // Add modifyEnd EventEmitter
  private modifiedFeatureId: string | null = null;

  initializeMap(target: string): void {
    this.vectorSource = new VectorSource({ wrapX: false });

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33',
          }),
        }),
      }),
    });

    const rasterLayer = new TileLayer({
      source: new OSM(),
    });

    this.map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: target,
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    // Add modify and snap interactions
    const modify = new Modify({ source: this.vectorSource });
    modify.on('modifyend', (event: ModifyEvent) => {
      this.handleModifyEnd(event);
      this.modifyEnd.emit(event); // Emit the ModifyEvent
    });
    this.map.addInteraction(modify);

    const snap = new Snap({ source: this.vectorSource });
    this.map.addInteraction(snap);
  }

  setDrawingMode(mode: string): void {
    if (this.drawInteraction) {
      this.map.removeInteraction(this.drawInteraction);
    }

    if (mode !== 'None') {
      let geometryType: 'Point' | 'LineString' | 'Polygon' | 'Circle';

      switch (mode) {
        case 'Point':
          geometryType = 'Point';
          break;
        case 'LineString':
          geometryType = 'LineString';
          break;
        case 'Polygon':
          geometryType = 'Polygon';
          break;
        case 'Circle':
          geometryType = 'Circle';
          break;
        default:
          return;
      }

      this.drawInteraction = new Draw({
        source: this.vectorSource,
        type: geometryType,
      });

      // Ensure the drawing interaction ends when the shape is complete
      this.drawInteraction.on('drawend', (event: DrawEvent) => {
        this.map.removeInteraction(this.drawInteraction!);
        this.drawInteraction = undefined;
        this.drawEnd.emit(event); // Emit the DrawEvent
      });

      this.map.addInteraction(this.drawInteraction);
    }
  }

  loadDrawings(drawings: any[]): void {
    console.log('tesload');
    drawings.forEach((drawing) => {
      let geometry;
      const coordinates = JSON.parse(drawing.coordinates);

      switch (drawing.kind) {
        case 'Polygon':
          geometry = new Polygon([coordinates]);
          break;
        case 'LineString':
          geometry = new LineString(coordinates);
          break;
        case 'Circle':
          const [center, edge] = coordinates;
          const radius = Math.sqrt(
            Math.pow(edge[0] - center[0], 2) + Math.pow(edge[1] - center[1], 2)
          );
          geometry = new Circle(center, radius);
          break;
        case 'Point':
          geometry = new Point(coordinates);
          break;
        default:
          return;
      }

      const feature = new Feature({ geometry });
      feature.setId(drawing.id);
      this.vectorSource.addFeature(feature);
    });
  }
  handleModifyEnd(event: ModifyEvent): void {
    console.log('tsddhnmmmmmmmm');
    const features = event.features.getArray();
    if (features.length > 0) {
      const modifiedFeature = features[0]; // Assuming modifying only one feature at a time
      const featureId = modifiedFeature.getId(); // Get ID of the modified feature
      this.modifiedFeatureId =
        featureId !== undefined ? featureId.toString() : null;
      // Now you can use featureId to identify the modified drawing
      console.log('Modified feature ID:', featureId);

      // Optionally, you can send this ID to your backend for further processing
    }
  }
  getModifiedDrawingId(): string | null {
    return this.modifiedFeatureId;
  }
  setModifiedDrawingId(id: string | null) {
    this.modifiedFeatureId = id;
  }
}

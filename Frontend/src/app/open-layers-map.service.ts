import { EventEmitter, Injectable } from '@angular/core';
import { Feature } from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import Circle from 'ol/geom/Circle';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { Draw, Modify, Snap } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import { ModifyEvent } from 'ol/interaction/Modify';
import { Vector as VectorLayer } from 'ol/layer';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

@Injectable({
  providedIn: 'root',
})
export class OpenLayersMapService {
  private map: Map | undefined = undefined;
  private vectorSource!: VectorSource;
  private drawInteraction?: Draw;
  drawEnd = new EventEmitter<DrawEvent>();
  modifyEnd = new EventEmitter<ModifyEvent>();
  viewChanged = new EventEmitter<{ center: number[]; zoom: number }>();

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
    setTimeout(() => {
      this.map?.updateSize();
    }, 0);

    const storedCenter = localStorage.getItem('mapCenter');
    const storedZoom = localStorage.getItem('mapZoom');

    if (storedCenter && storedZoom) {
      const center = JSON.parse(storedCenter);
      const zoom = parseFloat(storedZoom);
      this.map.getView().setCenter(center);
      this.map.getView().setZoom(zoom);
    }

    this.map.getView().on('change', () => {
      const view = this.map?.getView();
      const center = view?.getCenter();
      const zoom = view?.getZoom();

      if (center !== undefined && zoom !== undefined) {
        this.viewChanged.emit({ center, zoom });

        localStorage.setItem('mapCenter', JSON.stringify(center));
        localStorage.setItem('mapZoom', zoom.toString());
      }
    });

    const modify = new Modify({ source: this.vectorSource });
    modify.on('modifyend', (event: ModifyEvent) => {
      this.handleModifyEnd(event);
      this.modifyEnd.emit(event);
    });
    this.map.addInteraction(modify);

    const snap = new Snap({ source: this.vectorSource });
    this.map.addInteraction(snap);
  }

  setDrawingMode(mode: string): void {
    if (this.drawInteraction) {
      this.map?.removeInteraction(this.drawInteraction);
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

      this.drawInteraction.on('drawend', (event: DrawEvent) => {
        this.map?.removeInteraction(this.drawInteraction!);
        this.drawInteraction = undefined;
        this.drawEnd.emit(event);
      });

      this.map?.addInteraction(this.drawInteraction);
    }
  }

  loadDrawings(drawings: any[]): void {
    if (this.map) {
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
              Math.pow(edge[0] - center[0], 2) +
                Math.pow(edge[1] - center[1], 2)
            );
            geometry = new Circle(center, radius);
            break;
          case 'Point':
            if (coordinates && coordinates.length === 1) {
              geometry = new Point(coordinates[0]);
            }
            break;
          default:
            return;
        }

        const feature = new Feature({ geometry });
        feature.setId(drawing.id);
        this.vectorSource.addFeature(feature);
      });
    }
  }

  handleModifyEnd(event: ModifyEvent): void {
    const features = event.features.getArray();
    if (features.length > 0) {
      const modifiedFeature = features[0];
      const featureId = modifiedFeature.getId();
      this.modifiedFeatureId =
        featureId !== undefined ? featureId.toString() : null;
    }
  }
  getModifiedDrawingId(): string | null {
    return this.modifiedFeatureId;
  }
  setModifiedDrawingId(id: string | null) {
    this.modifiedFeatureId = id;
  }

  setMapUndefined(): void {
    this.map = undefined;
  }

  getMap(): Map | undefined {
    return this.map;
  }
}

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: number[];
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent implements AfterViewInit{

  @ViewChild('map') divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];

  public zoom: number = 13;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-70.12463799223531, -20.271893280325457);

  ngAfterViewInit(): void {

    if ( !this.divMap ) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    this.readFromLocalStorage();

    // const markerHtml = document.createElement('div');
    // markerHtml.innerHTML = 'Sergio Cerda';

    // const marker = new Marker({
    //   // color: 'red',
    //   element: markerHtml,
    // })
    //   .setLngLat( this.currentLngLat )
    //   .addTo(this.map);

  }

  createMarker(): void{

    if ( !this.map ) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map?.getCenter();

    this.addMarker( lngLat, color);

    this.saveToLocalStorage();

  }

  addMarker( lngLat: LngLat, color:string): void {
    if ( !this.map ) return;

    const marker = new Marker({
      color: color,
      draggable: true
    })
      .setLngLat( lngLat )
      .addTo(this.map);

    this.markers.push({
      color: color,
      marker: marker
    });

    marker.on('dragend', () => this.saveToLocalStorage());

  }

  deleteMarker( index: number): void {
    this.markers[index].marker.remove();
    this.markers.splice( index, 1);
  }

  flyTo( marker: Marker ): void{

    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat(),
      speed: 3
    })

  }

  saveToLocalStorage(): void {
    const plainMArkers: PlainMarker[] = this.markers.map( ({color, marker}) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    });
    localStorage.setItem('plainMarkers', JSON.stringify(plainMArkers))
  }

  readFromLocalStorage(): void {
    const plainMArkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse( plainMArkersString );

    plainMarkers.forEach( ({color, lngLat}) => {
      const [ lng, lat ] = lngLat;
      const coords = new LngLat( lng, lat );

      this.addMarker(coords, color);
    })
  }


}

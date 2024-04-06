import { AfterViewInit, Component } from '@angular/core';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

(mapboxgl as any).accessToken = 'pk.eyJ1Ijoic3B5a3VnIiwiYSI6ImNsdW5heDltajFsaDIybWxob2lzdHkxNzAifQ.mH8ANOGY22b6flamgHKB0w';

@Component({
  templateUrl: './full-screen-page.component.html',
  styleUrl: './full-screen-page.component.css'
})
export class FullScreenPageComponent implements AfterViewInit{

  ngAfterViewInit(): void {

    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-70.14027, -20.25800], // starting position [lng, lat]
      zoom: 12, // starting zoom
    });

  }



}

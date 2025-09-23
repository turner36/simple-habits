import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule, Platform } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DatePipe]
})
export class Tab1Page implements OnInit, OnDestroy {
  now = new Date();
  private timer: any;
  cordovaAvailable = false;

  constructor(private vibration: Vibration, private platform: Platform) {}

  ngOnInit() {
    this.timer = setInterval(() => (this.now = new Date()), 1000);
    this.platform.ready().then(() => {
      this.cordovaAvailable = !!(window as any).cordova;
    });
  }
  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  vibrate() {
    if ((window as any).cordova) this.vibration.vibrate(200);
    else if ('vibrate' in navigator) (navigator as any).vibrate(200);
    else alert('Vibration not available here.');
  }
}

import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

import { FirebaseService } from '../services/firebase.service';
import { Habit } from '../models';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab1Page implements OnInit {
  now = new Date();
  timer: any;

  habits: Habit[] = [];
  newHabitName = '';
  newHabitFreq: 'daily' | 'weekly' = 'daily';
  loading = false;

  cordovaAvailable = false;

  constructor(
    private fb: FirebaseService,
    private vib: Vibration,
    private toasts: ToastController
  ) {}

  ngOnInit() {
    this.timer = setInterval(() => (this.now = new Date()), 1000);
    this.cordovaAvailable = typeof (window as any).cordova !== 'undefined';
    this.refresh();
  }
  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  async present(msg: string) {
    (await this.toasts.create({ message: msg, duration: 1400 })).present();
  }

  async refresh() {
    this.loading = true;
    try {
      this.habits = await this.fb.listHabits();
    } catch (e) {
      console.error(e);
      this.present('Failed to load habits');
    } finally {
      this.loading = false;
    }
  }

  async addHabit() {
    const name = this.newHabitName.trim();
    if (!name) { this.present('Enter a habit name'); return; }

    try {
      await this.fb.addHabit(name, this.newHabitFreq);
      this.newHabitName = '';
      this.newHabitFreq = 'daily';
      await this.present('Habit added');
      await this.refresh();
    } catch (e) {
      console.error(e);
      this.present('Add failed (check network/Firebase rules)');
    }
  }

  async complete(h: Habit) {
    try {
      await this.fb.completeToday(h);
      if (this.cordovaAvailable) this.vib.vibrate(150);
      else if ('vibrate' in navigator) (navigator as any).vibrate(150);
      await this.present(`Great job: ${h.name}!`);
      await this.refresh();
    } catch (e) {
      console.error(e);
      this.present('Could not update streak');
    }
  }
}

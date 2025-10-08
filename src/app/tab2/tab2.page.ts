import { Component, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  standalone: true,
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class Tab2Page implements OnDestroy {
  habits: { name: string; streak: number }[] = [];
  totalStreak = 0;

  private sub?: Subscription;

  constructor(private fb: FirebaseService) {
    this.sub = this.fb.watchHabits().subscribe({
      next: (items) => {
        this.habits = items;
        this.totalStreak = items.reduce((sum, h) => sum + (h.streak || 0), 0);
      },
      error: (e) => console.error('[Progress watch] error:', e),
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}

// src/app/services/firebase.service.ts
import { Injectable } from '@angular/core';

// Firebase Web SDK (no AngularFire providers needed)
import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore, Firestore, collection, addDoc, getDocs,
  orderBy, query, doc, updateDoc, onSnapshot
} from 'firebase/firestore';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Habit } from '../models';    
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app!: FirebaseApp;
  private db!: Firestore;

  constructor(private auth: AuthService) {
    // Initialize Firebase once (safe if called multiple times)
    this.app = getApps().length ? getApp() : initializeApp(environment.firebase);
    this.db  = getFirestore(this.app);
    console.log('[Firestore] initialized:', !!this.db);
  }

  /** Ensure we have an anonymous user before any Firestore access. */
  private async ensureUser(): Promise<void> {
    await this.auth.ensureAnonSignIn();
    if (!this.auth.uid) throw new Error('Auth not ready (no UID)');
  }

  /** users/{uid}/habits path for the signed-in user */
  private userPath(): string {
    const uid = this.auth.uid;
    if (!uid) throw new Error('No UID');
    return `users/${uid}/habits`;
  }

  // ---------- Reads ----------

  /** One-time read of all habits (ordered by name). */
  async listHabits(): Promise<Habit[]> {
    await this.ensureUser();
    try {
      const qRef = query(collection(this.db, this.userPath()), orderBy('name', 'asc'));
      const snap = await getDocs(qRef);
      const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Habit) }));
      console.log('[listHabits] count =', items.length);
      return items;
    } catch (err) {
      console.error('[listHabits] failed:', err);
      throw err;
    }
  }

  /** Live stream of habits; emits on any change (add/update/delete). */
  watchHabits(): Observable<Habit[]> {
    return new Observable<Habit[]>((sub) => {
      let unsubscribe: (() => void) | undefined;

      (async () => {
        try {
          await this.ensureUser();
          const qRef = query(collection(this.db, this.userPath()), orderBy('name', 'asc'));
          unsubscribe = onSnapshot(
            qRef,
            (snap) => {
              const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Habit) }));
              sub.next(items);
            },
            (err) => sub.error(err)
          );
        } catch (e) {
          sub.error(e);
        }
      })();

      // teardown
      return () => { try { unsubscribe?.(); } catch {} };
    });
  }

  // ---------- Writes ----------

  /** Add a new habit; returns created document ID. */
  async addHabit(name: string, frequency: string = 'daily'): Promise<string> {
    await this.ensureUser();
    const habit: Habit = { name: name.trim(), frequency, streak: 0 };
    try {
      const ref = await addDoc(collection(this.db, this.userPath()), habit);
      console.log('[addHabit] added id =', ref.id);
      return ref.id;
    } catch (err) {
      console.error('[addHabit] failed:', err);
      throw err;
    }
  }

  /** Mark today complete: increments streak if not already done today. */
  async completeToday(habit: Habit): Promise<void> {
    await this.ensureUser();
    if (!habit.id) return;

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const patch = {
      streak: habit.lastCompleted === today ? habit.streak : (habit.streak + 1),
      lastCompleted: today,
    };

    try {
      await updateDoc(doc(this.db, `${this.userPath()}/${habit.id}`), patch);
      console.log('[completeToday] updated', habit.id, patch);
    } catch (err) {
      console.error('[completeToday] failed:', err);
      throw err;
    }
  }
}

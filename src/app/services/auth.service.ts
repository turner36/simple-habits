// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, User, Auth } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private app!: FirebaseApp;
  private auth!: Auth;
  private _user: User | null = null;

  constructor() {
    // Initialize Firebase app exactly once 
    this.app = getApps().length ? getApp() : initializeApp(environment.firebase);
    this.auth = getAuth(this.app);

    onAuthStateChanged(this.auth, (u) => {
      this._user = u;
      console.log('[Auth] state change uid=', u?.uid);
    });

    // Kick off anonymous sign-in immediately
    this.ensureAnonSignIn().catch(err => console.error('[Auth] sign-in failed:', err));
  }

  async ensureAnonSignIn(): Promise<User> {
    if (this._user) return this._user;
    const res = await signInAnonymously(this.auth);
    this._user = res.user;
    return res.user;
  }

  get uid(): string | null { return this._user?.uid ?? null; }
}

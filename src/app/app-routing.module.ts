import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: 'tab1', loadComponent: () => import('./tab1/tab1.page').then(m => m.Tab1Page) },
      { path: 'tab2', loadComponent: () => import('./tab2/tab2.page').then(m => m.Tab2Page) },
      { path: 'tab3', loadComponent: () => import('./tab3/tab3.page').then(m => m.Tab3Page) },
      { path: '', redirectTo: 'tab1', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'tabs' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

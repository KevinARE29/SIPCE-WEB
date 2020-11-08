// HACK: Added for testing purposes

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';

import { LargeDocumentComponent } from './components/large-document/large-document.component';
import { OnePageComponent } from './components/one-page/one-page.component';

const routes: Routes = [
  {
    path: 'one-page',
    component: OnePageComponent,
    canLoad: [AuthGuard]
  },
  {
    path: 'two-pages',
    component: LargeDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentTestingRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecurityPoliciesComponent } from './components/security-policies.component';

const routes: Routes = [{ 
    path: 'politicas-seguridad', 
    component: SecurityPoliciesComponent 
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class SecurityPoliciesRoutingModule { }

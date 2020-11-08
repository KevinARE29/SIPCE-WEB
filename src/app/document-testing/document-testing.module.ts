// HACK: Added for testing purposes

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { DocumentTestingRoutingModule } from './document-testing-routing.module';
import { OnePageComponent } from './components/one-page/one-page.component';
import { LargeDocumentComponent } from './components/large-document/large-document.component';

@NgModule({
  declarations: [OnePageComponent, LargeDocumentComponent],
  imports: [AntDesignModule, CommonModule, DocumentTestingRoutingModule]
})
export class DocumentTestingModule {}

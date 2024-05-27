import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ExportPageComponent } from './export-page/export-page.component';
import { ImportPageComponent } from './import-page/import-page.component';

const routes: Routes = [
  {path: "", component: HomepageComponent},
  {path: "export", component: ExportPageComponent},
  {path: "import", component: ImportPageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ExportPageComponent } from './export-page/export-page.component';
import { ImportPageComponent } from './import-page/import-page.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { RecieveMessageComponent } from './recieve-message/recieve-message.component';

const routes: Routes = [
  {path: "", component: HomepageComponent},
  {path: "export", component: ExportPageComponent},
  {path: "import", component: ImportPageComponent},
  {path: "send", component: SendMessageComponent},
  {path: "recieve", component: RecieveMessageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

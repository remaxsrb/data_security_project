import { Component } from '@angular/core';
import { publicKeyRing } from './models/publicKeyRing';
import { privateKeyRing } from './models/privateKeyRing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'data_security_project';

  isNewFormVisible = false;
  isUploadVisible = false;
  selectedFile = false;
  

  publicKeyRingData: publicKeyRing[] = [];
  privateKeyRingData: privateKeyRing[] = [];

  newData = {name: '', email: '', password: '', algorithm: '', keySize: 0};

  showNewPromt() {
    this.isNewFormVisible = true;
    this.isUploadVisible = false;
  }

  onNewSubmit() {
    this.isNewFormVisible = false;
    this.publicKeyRingData.push({name: this.newData.name, email: this.newData.email, keyId: 1, algorithm: this.newData.algorithm});
    this.privateKeyRingData.push({name: this.newData.name, email: this.newData.email, keyId: 1, algorithm: this.newData.algorithm});
  }

  showUpload() {
    this.isUploadVisible = true;
    this.isNewFormVisible = false;

  }

  onUpload() {
    this.isUploadVisible = false;
  }

}

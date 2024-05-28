import { Component } from '@angular/core';

@Component({
  selector: 'app-recieve-message',
  templateUrl: './recieve-message.component.html',
  styleUrls: ['./recieve-message.component.css'],
})
export class RecieveMessageComponent {
  fileUploaded: boolean = false;

  message: string = '';

  isEncrypted: boolean = false;
  isSigned: boolean = false;
  isCompressed: boolean = false;
  isEncoded: boolean = false;

  encriptionKey: any = null;
  encriptionAlgorithm: string = '';
  signingKey: any = null;

  timestamp: string = '';
  status: string = '';

  onUpload() {
    this.fileUploaded = true;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
  }
}

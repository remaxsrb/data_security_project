import { Component } from '@angular/core';
import { MessagingService } from '../services/messaging.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recieve-message',
  templateUrl: './recieve-message.component.html',
  styleUrls: ['./recieve-message.component.css'],
})
export class RecieveMessageComponent {
  constructor(
    private messagingService: MessagingService,
    private router: Router
  ) {}

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
  password: string = '';

  recievedFile: any = null;

  onUpload() {

    if (this.password === '')
      this.messagingService
        .recievePlainMessage(this.recievedFile)
        .subscribe((data) => {
          this.message = data.message;
          this.encriptionAlgorithm = data.encriptionAlgorithm;
          this.encriptionKey = data.encryption_key_id;
          this.signingKey = data.signing_key_id;
          this.isCompressed = data.compressed;
          this.isSigned = data.signed;
          this.isEncrypted = data.encrypted;
          this.isEncoded = data.radix;
          this.status = 'Sucess'
        });
    else
      this.messagingService
        .recieveEncryptedMessage(this.recievedFile, this.password)
        .subscribe((data) => {
          this.message = data.message;
          this.encriptionAlgorithm = data.algorithm;
          this.encriptionKey = data.encryption_key_id;
          this.signingKey = data.signing_key_id;
          this.isCompressed = data.compressed;
          this.isSigned = data.signed;
          this.isEncrypted = data.encrypted;
          this.isEncoded = data.radix;
          this.status = 'Sucess'

        });
  }

  onFileSelected(event: any) {
    this.fileUploaded = true;

    const file: File = event.target.files[0];
    this.recievedFile = file;
  }
}

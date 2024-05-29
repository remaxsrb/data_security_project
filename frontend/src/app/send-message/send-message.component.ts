import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../services/messaging.service';
import { Router } from '@angular/router';
import { publicKey } from '../models/publicKey';
import { privateKey } from '../models/privateKey';
import { KeyRingService } from '../services/key-ring.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {

  constructor(private messagingService: MessagingService, private keyRingsService: KeyRingService, private router: Router) {}

  ngOnInit(): void {

    this.keyRingsService.getAllPrivateKeys().subscribe(
      data => {
        
        this.privateKeyRing = data
      }
    )

    this.keyRingsService.getAllPublicKeys().subscribe(
      data => {
        this.publicKeyRing = data
      }
    )

  }

  publicKeyRing: publicKey[] = [];
  privateKeyRing: privateKey[] = [];

  message: string = '';
  
  isEncrypted: boolean = false;
  encriptionKey: any = null; //public key, emails is bined, later its changed to key_id
  encriptionAlgorithm: string = '';

  isSigned: boolean = false;
  signingKey: any = null; //private key, emails is bined, later its changed to key_id

  isCompressed: boolean = false;
  isEncoded: boolean = false;

  signingPassword: string = '';

  

  onSend() {


    if (this.isEncrypted===true) {
      this.encriptionKey = this.publicKeyRing.filter(key => key.email === this.encriptionKey)[0].key_id;


      if (this.isSigned===true) {

        this.signingKey = this.privateKeyRing.filter(key => key.email === this.signingKey)[0].key_id;

        this.messagingService.sendEncriptedSignedMessage(this.message, this.isEncrypted, this.encriptionKey, this.encriptionAlgorithm, this.isSigned, this.signingKey , this.signingPassword,this.isCompressed, this.isEncoded).subscribe();

      }
      else {

        this.messagingService.sendEncriptedMessage(this.message, this.isEncrypted, this.encriptionKey, this.encriptionAlgorithm, this.isSigned, this.signingPassword, this.isCompressed, this.isEncoded).subscribe();


      }

    }

    else {
      this.isSigned = false;
      this.isCompressed = false;
      this.isEncoded = false;

      this.messagingService.sendPlainMessage(this.message, this.isEncrypted, this.isSigned, this.isCompressed, this.isEncoded).subscribe();
    }
  }


}

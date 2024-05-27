import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { privateKeyRing } from '../models/privateKeyRing';
import { publicKeyRing } from '../models/publicKeyRing';
import { KeyRingService } from '../services/key-ring.service';

@Component({
  selector: 'app-import-page',
  templateUrl: './import-page.component.html',
  styleUrls: ['./import-page.component.css']
})
export class ImportPageComponent implements OnInit {

  constructor(private service: KeyRingService, private router: Router) {}

  publicKeyRingData: publicKeyRing[] = [];
  privateKeyRingData: privateKeyRing[] = [];

  keyType: string = '';

  showPublicKeyRing: boolean = false;
  showPrivateKeyRing: boolean = false;

  importData = {type: '', key: '', password: '', name: '', email: ''}; 


  ngOnInit(): void {

    this.service.getAllPrivateKeys().subscribe(
      data => {
        
        this.privateKeyRingData = data
      }
    )

    this.service.getAllPublicKeys().subscribe(
      data => {
        this.publicKeyRingData = data
      }
    )
      
  }

  onRadioKeyTypeChange(event: any) {
    
    if (this.keyType === 'public') {
      this.showPrivateKeyRing = false;
      this.showPublicKeyRing = true;
    }

    if (this.keyType === 'private') {
      this.showPrivateKeyRing = true;
      this.showPublicKeyRing = false;
    }
    
  }


  onFileSelected(event: any) {

    const file: File = event.target.files[0];
    this.importData.key = file.name;
  }

  onImport() {

    this.service.importKey(this.importData.type, this.importData.key, this.importData.password, this.importData.name, this.importData.email

    ).subscribe(
      data => {
        this.privateKeyRingData = data[0];
        this.publicKeyRingData = data[1];
      }
    )

  }
}


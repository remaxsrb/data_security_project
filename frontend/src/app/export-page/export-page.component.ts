import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeyRingService } from '../services/key-ring.service';
import { privateKeyRing } from '../models/privateKeyRing';
import { publicKeyRing } from '../models/publicKeyRing';

@Component({
  selector: 'app-export-page',
  templateUrl: './export-page.component.html',
  styleUrls: ['./export-page.component.css']
})
export class ExportPageComponent implements OnInit {

  constructor(private service: KeyRingService, private router: Router) {}

  publicKeyRingData: publicKeyRing[] = [];
  privateKeyRingData: privateKeyRing[] = [];

  keyType: string = '';

  showPublicKeyRing: boolean = false;
  showPrivateKeyRing: boolean = false;

  selectedKeyId: string = '';

  keyToExport: any = {};

  exportData = {type: '', id: '', filename: '', password: ''}; 


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

  onRadioKeyChoiceChange(event: any) {

  }

  onExport() {

    

    if (this.keyType === 'public') {
      this.keyToExport = this.publicKeyRingData.filter(key => key.key_id === this.selectedKeyId);

      this.exportData.type = 'public';
      this.exportData.id = this.keyToExport._id;
  
    }

    

    if (this.keyType === 'private') {
      this.keyToExport = this.privateKeyRingData.filter(key => key.key_id === this.selectedKeyId);

      this.exportData.type = 'private';
      this.exportData.id = this.keyToExport._id;
      this.exportData.password = this.keyToExport.password;

    }

    this.service.exportKey(this.exportData.type, this.exportData.id, this.exportData.filename, this.exportData.password

    ).subscribe()

  }
}

import { Component, OnInit } from '@angular/core';
import { privateKey } from '../models/privateKey';
import { publicKey } from '../models/publicKey';
import { KeyRingService } from '../services/key-ring.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit{


  constructor(private service: KeyRingService, private router: Router) {}

  isNewFormVisible = false;
  isUploadVisible = false;
  

  publicKeyRing: publicKey[] = [];
  privateKeyRing: privateKey[] = [];

  checkboxStates: boolean[] = [];

  toDelete: string[] = [];

  newData = {name: '', email: '', password: '', algorithm: '', bitsize: 0};


  ngOnInit(): void {

    this.service.getAllPrivateKeys().subscribe(
      data => {
        
        this.privateKeyRing = data
      }
    )

    this.service.getAllPublicKeys().subscribe(
      data => {
        this.publicKeyRing = data
      }
    )

    this.checkboxStates = new Array(this.privateKeyRing.length).fill(false);

  }

  showNewPromt() {
    this.isNewFormVisible = true;
    this.isUploadVisible = false;
  }


  onNewSubmit() {
    this.isNewFormVisible = false;

    this.service.createKeyPair(this.newData.name,  this.newData.email,  this.newData.password, this.newData.bitsize).subscribe(
      data => {
      }

    );

  }

  onCheckboxChange(index: number, event: Event, value: string) {

    const isChecked = (event.target as HTMLInputElement)?.checked ?? false;
    this.checkboxStates[index] = isChecked;

    if (isChecked===true && !this.toDelete.includes(value))
      this.toDelete.push(value);
    else
    this.toDelete = this.toDelete.filter(key => key !== value);
  }
    
  

  onDelete() {
    while(this.toDelete.length > 0)  { 
      const keyPairToDelete = this.toDelete.pop();
      if(keyPairToDelete !== undefined) {
        this.service.deleteKeyPair(keyPairToDelete).subscribe();
      }
    }
  }

  onImport() {
    this.router.navigate(['import']);

  }

  onExport() {
    this.router.navigate(['export']);
  }

  onSend() {
    this.router.navigate(['send']);

  }

  onReceieve() {
    this.router.navigate(['recieve']);

  }

}

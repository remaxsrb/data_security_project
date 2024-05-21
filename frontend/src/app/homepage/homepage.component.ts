import { Component, OnInit } from '@angular/core';
import { privateKeyRing } from '../models/privateKeyRing';
import { publicKeyRing } from '../models/publicKeyRing';
import { KeyRingService } from '../services/key-ring.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit{


  constructor(private service: KeyRingService) {}

  isNewFormVisible = false;
  isUploadVisible = false;
  selectedFile = false;

  publicKeyRingData: publicKeyRing[] = [];
  privateKeyRingData: privateKeyRing[] = [];

  checkboxStates: boolean[] = [];

  toDelete: string[] = [];

  newData = {name: '', email: '', password: '', algorithm: '', bitsize: 0};


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

    this.checkboxStates = new Array(this.privateKeyRingData.length).fill(false);

  }

  showNewPromt() {
    this.isNewFormVisible = true;
    this.isUploadVisible = false;
  }


  onNewSubmit() {
    this.isNewFormVisible = false;

    this.service.createKeyPair(this.newData.name,  this.newData.email,  this.newData.password, this.newData.bitsize).subscribe(
      data => {
        alert("Created KeyPair with id: " + data);
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


    alert(this.toDelete);
  }
    
  

  onDelete() {
    while(this.toDelete.length > 0)  { 
      const keyPairToDelete = this.toDelete.pop();
      if(keyPairToDelete !== undefined) {
        this.service.deleteKeyPair(keyPairToDelete).subscribe();
      }
    }
  }

  showUpload() {
    this.isUploadVisible = true;
    this.isNewFormVisible = false;

  }

  onUpload() {
    this.isUploadVisible = false;
  }

}

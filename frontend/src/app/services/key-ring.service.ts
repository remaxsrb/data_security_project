import { Injectable } from '@angular/core';
import { privateKeyRing } from '../models/privateKeyRing';
import { publicKeyRing } from '../models/publicKeyRing';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KeyRingService {

  constructor(private http: HttpClient) { }

  backendUrl = "http://127.0.0.1:5000/keys"

  getAllPublicKeys() {
    return this.http.get<publicKeyRing[]>(`${this.backendUrl}/public`);
  }

  getAllPrivateKeys() {
    return this.http.get<privateKeyRing[]>(`${this.backendUrl}/private`);
  }

  createKeyPair(name: string, email:string, password:string, bitsize: number) {

    const data = {
      name: name,
      email: email,
      bitsize: bitsize,
      password: password
    };

    return this.http.post<number>(`${this.backendUrl}/create`, data);

  }

  deleteKeyPair(key_id:string) {
    return this.http.delete<number>(`${this.backendUrl}/delete/${key_id}`);
  }
}

import { Injectable } from '@angular/core';
import { privateKey } from '../models/privateKey';
import { publicKey } from '../models/publicKey';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KeyRingService {

  constructor(private http: HttpClient) { }

  backendUrl = "http://127.0.0.1:5000/keys"

  getAllPublicKeys() {
    return this.http.get<publicKey[]>(`${this.backendUrl}/public`);
  }

  getAllPrivateKeys() {
    return this.http.get<privateKey[]>(`${this.backendUrl}/private`);
  }

  createKeyPair(name: string, email:string, password:string, bitsize: number) {

    const data = {
      name: name,
      email: email,
      bitsize: bitsize,
      password: password
    };

    return this.http.post<any>(`${this.backendUrl}/create`, data);

  }

  deleteKeyPair(key_id:string) {
    return this.http.delete<number>(`${this.backendUrl}/delete/${key_id}`);
  }

  exportKey(type: string, id:string, filename:string, password: string) {


    const data = {
      type: type,
      id: id,
      password: password,
      filename: filename
    };

    return this.http.post<number>(`${this.backendUrl}/export`, data);

  }

  importKey(type: string, file:File, password:string, name: string, email: string) {

    const formData: FormData = new FormData();
    formData.append('type', type);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('key', file, file.name);

    const data = JSON.stringify(formData);

    // const data = {
    //   type: type,
    //   key: key,
    //   password: password,
    //   name: name,
    //   email: email
    // };

    return this.http.post<any>(`${this.backendUrl}/import`, formData);

  }

}

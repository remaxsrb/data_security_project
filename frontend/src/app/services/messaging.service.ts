import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private http: HttpClient) { }

  backendUrl = "http://127.0.0.1:5000/message"


  sendPlainMessage(message: string, isEncrypted: boolean, isSigned: boolean, isCompressed: boolean, isEncoded: boolean) {

    const data = {
      message: message, 
      encription: isEncrypted,
      sign: isSigned,
      compressed: isCompressed,
      radix: isEncoded

    }

    return this.http.post<number>(`${this.backendUrl}/send`, data);


  }

  sendEncriptedMessage(message: string, isEncrypted: boolean, encription_key_id: string, algorithm:string, isSigned: boolean, isCompressed: boolean, isEncoded: boolean) {

    const data = {
      message: message, 
      encription: isEncrypted,
      algorithm: algorithm,
      sign: isSigned,
      compressed: isCompressed,
      radix: isEncoded

    }

    return this.http.post<number>(`${this.backendUrl}/send`, data);

  }

  sendEncriptedSignedMessage(message: string, isEncrypted: boolean, encription_key_id: string, algorithm:string, isSigned: boolean, signing_key_id: string, password: string ,isCompressed: boolean, isEncoded: boolean) {

    const data = {
      message: message, 
      encription: isEncrypted,
      algorithm: algorithm,
      sign: isSigned,
      sign_key_id: signing_key_id,
      password: password,
      compressed: isCompressed,
      radix: isEncoded

    }

    return this.http.post<number>(`${this.backendUrl}/send`, data);

  }

  recieveMessage() {}

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  constructor(private http: HttpClient) {}

  backendUrl = 'http://127.0.0.1:5000/message';

  sendPlainMessage(
    message: string,
    isEncrypted: boolean,
    isSigned: boolean,
    isCompressed: boolean,
    isEncoded: boolean
  ) {
    const data = {
      message: message,
      encryption: isEncrypted,
      encryption_key_id: '',
      algorithm: '',
      sign: isSigned,
      sign_key_id: '',
      compressed: isCompressed,
      password: '',
      radix: isEncoded
    };

    return this.http.post<any>(`${this.backendUrl}/send`, data);
  }

  sendEncriptedMessage(
    message: string,
    isEncrypted: boolean,
    encription_key_id: string,
    algorithm: string,
    isSigned: boolean,
    password: string,
    isCompressed: boolean,
    isEncoded: boolean
  ) {
    const data = {
      message: message,
      encryption: isEncrypted,
      encryption_key_id: encription_key_id,
      algorithm: algorithm,
      sign: isSigned,
      sign_key_id: '',
      compressed: isCompressed,
      password: password,
      radix: isEncoded
    };

    return this.http.post<any>(`${this.backendUrl}/send`, data);
  }

  sendEncriptedSignedMessage(
    message: string,
    isEncrypted: boolean,
    encription_key_id: string,
    algorithm: string,
    isSigned: boolean,
    signing_key_id: string,
    password: string,
    isCompressed: boolean,
    isEncoded: boolean
  ) {
    const data = {
      message: message,
      encryption: isEncrypted,
      encryption_key_id: encription_key_id,
      algorithm: algorithm,
      sign: isSigned,
      sign_key_id: signing_key_id,
      compressed: isCompressed,
      password: password,
      radix: isEncoded
    };

    return this.http.post<any>(`${this.backendUrl}/send`, data);
  }

  recievePlainMessage(messageFile: File) {
    const formData: FormData = new FormData();
    formData.append('message', messageFile, messageFile.name);
    formData.append('password', '');

    return this.http.post<any>(`${this.backendUrl}/receive`, formData);
  }

  recieveEncryptedMessage(messageFile: File, password: string) {
    const formData: FormData = new FormData();
    formData.append('message', messageFile, messageFile.name);
    formData.append('password', password);

    return this.http.post<any>(`${this.backendUrl}/receive`, formData);
  }
}

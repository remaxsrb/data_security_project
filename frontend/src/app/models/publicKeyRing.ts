export class publicKeyRing {

    _id: string = '';
    bitsize: number = 0;
    email: string ='';
    key_id: string = '';
    name: string ='';
    public_key: string ='';
    timestamp: { $date: string } | string = '';
}
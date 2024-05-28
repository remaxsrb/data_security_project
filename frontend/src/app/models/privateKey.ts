export class privateKey {
    _id: string = '';
    bitsize: number = 0;
    email: string ='';
    key_id: string = '';
    name: string ='';
    nonce: string ='';
    password: string ='';
    private_key: string ='';
    public_key: string ='';
    salt: string ='';
    tag: string ='';
    timestamp: { $date: string } | string = '';
}
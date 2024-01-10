// import * as CryptoJS from 'crypto-js';
import { Md5 } from 'ts-md5/dist/md5';
import * as CryptoJS from 'crypto-js';

export class LocalStorageManager {

    constructor() { }

    public hashedKey(key:any) {

        const md5 = new Md5();
        return md5.appendStr(key).end().toString();
    }

    public setItem(key:any, value:any) {
        if (value !== null && value !== undefined) {
            let encryptedData :any = CryptoJS.AES.encrypt(value.toString(), this.getEncryptKey());
            localStorage.setItem(this.hashedKey(key), encryptedData);
        }
    }

    public getItem(key:any) {
        var encryptedData = localStorage.getItem(this.hashedKey(key));
        if (encryptedData !== null && encryptedData !== undefined) {
            let bytes = CryptoJS.AES.decrypt(encryptedData.toString(), this.getEncryptKey());
            var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedData;
        }

    }
    public clearItems() {
        localStorage.clear();
    }

    // clear specific items 
    public clearItem(itemName:any) {
        localStorage.removeItem(itemName);
    }

    private getEncryptKey() {
        return this.hashedKey(process.env["secretkey"]);
    }
}

import { KMS } from 'aws-sdk';
import querystring from 'querystring';
import {Buffer} from 'buffer';

export async function Encrypt(data:any) {
    // const kms = new KMS();
    const kms = new KMS({
        accessKeyId: "AKIA267VP4XYBRWWLD5W",
        // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: "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",
        // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: "us-east-1",
        // region: process.env.REGION,
    });

    const encryptParams = {
      KeyId: "10d21e14-9887-4090-abf8-9503b320d5ef",
      EncryptionAlgorithm: 'RSAES_OAEP_SHA_256',
    //   Plaintext: data
      Plaintext: Buffer.from(data)
    };
    
    return new Promise((resolve, reject) => {
      kms.encrypt(encryptParams, (err, data) => {
        if (err) reject(err);
        else {
          let _ciphertextBlob :any = data.CiphertextBlob;
          let buff = Buffer.from(_ciphertextBlob);
          let encryptedBase64data = buff.toString('base64');
          resolve(encryptedBase64data);
        }
      });
    });

}

export async function Decrypt(data:any) {

    const kms = new KMS();

    const params = {
        KeyId: process.env.AWS_KMS_KEY_ID,
        EncryptionAlgorithm: 'RSAES_OAEP_SHA_256',
        CiphertextBlob: Buffer.from(data, 'base64')
    };

    return new Promise((resolve, reject) => {

        kms.decrypt(params, (err, data) => {

        if (err) reject(err);
        else {
            resolve(data.Plaintext ? data.Plaintext.toString() : data.Plaintext?.toString());
        };
        });

    });
}
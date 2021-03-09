/*
 * @Author: huxudong
 * @Date: 2020-12-09 16:28:31
 * @LastEditTime: 2021-03-09 08:59:16
 * @Description: JWE加解密
 */
import { CompactEncrypt, compactDecrypt, encoder, decoder, KeyLike } from "sinosun-jwe";
import AESCryptUtil from './AESCryptUtil';

class JWECryptUtil {
	// 头部
	header: any = { alg: "SM2", enc: "G128CBC-HG128", kid: '' };
	// 公钥
	publicKey: string = '04';
	// jwe参数的存储名
	storageKey: string = 'qtdaky';
	// 获取jwe参数
	getParams(): any {
		const { storageKey } = this;
		if (window[storageKey]) {
			return window[storageKey];
		} else {
			let jweParams: any = localStorage.getItem(storageKey);
			if (jweParams) {
				try {
					jweParams = AESCryptUtil.decrypt(jweParams);
					jweParams = JSON.parse(jweParams);
					window[storageKey] = jweParams;
					return jweParams;
				} catch (e) {
					throw new Error('jwe参数错误');
				}
			} else {
				throw new Error('缺少jwe参数');
			}
		}
	}
	// 将外部传入的加解密参数保存到本地
	saveParams(jweParams: any): void {
		const { storageKey } = this;
		window[storageKey] = jweParams;
		localStorage.setItem(storageKey, AESCryptUtil.encrypt(JSON.stringify(jweParams)));
	}
	// 清空本地中的加解密参数
	removeParams(): void {
		const { storageKey } = this;
		localStorage.setItem(storageKey, '');
	}
	// 加密
	async encrypt(originalData: string): Promise<any> {
		// console.log('前端上传的明文数据:', originalData);
		let { header, publicKey } = this;
		const { sm2pubkey, kid } = this.getParams();
		header.kid = kid;
		publicKey = publicKey + sm2pubkey;
		const jweAndcek = await new CompactEncrypt(encoder.encode(originalData)).setProtectedHeader(header).encrypt(publicKey);
		const encryptedData = jweAndcek["jwe"];
		// console.log('前端上传的加密数据:', encryptedData.split('.'));
		return {
			data: this.transferReqEncryptedData(encryptedData),
			cek: jweAndcek["cek"]
		}
	}
	// 将前端加密的数据拼接成接口需要的格式
	transferReqEncryptedData(encryptedData: string): any {
		const arr: string[] = encryptedData.split('.');
		const obj: any = {
			"protected": arr[0],
			"encrypted_key": arr[1],
			"iv": arr[2],
			"ciphertext": arr[3],
			"tag": arr[4],
		}
		return obj;
	}
	// 解密
	async decrypt(data: any, cek: KeyLike | string): Promise<string> {
		const encryptedData = this.transferResDecryptedData(data);
		// console.log('接口返回的加密数据:', encryptedData.split('.'));
		const { plaintext } = await compactDecrypt(encryptedData, cek);
		const decryptedData = decoder.decode(plaintext);
		// console.log('接口返回的明文数据:', decryptedData);
		return decryptedData;
	}
	// 将接口返回的数据拼接成解密需要的格式
	transferResDecryptedData(data: any): string {
		const { protected: protectedHeader, encrypted_key, iv, ciphertext, tag } = data;
		return protectedHeader + '.' + encrypted_key + '.' + iv + '.' + ciphertext + '.' + tag;
	}
}

export default new JWECryptUtil();





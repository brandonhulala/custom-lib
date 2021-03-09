/*
 * @Author: huxudong
 * @Date: 2020-12-09 16:28:31
 * @LastEditTime: 2021-03-08 14:15:58
 * @Description: AES加解密
 */
import CryptoJS from 'crypto-js/crypto-js';

class AESCryptUtil {
	// 公钥
	PUBLIC_KEY: string = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAngyZig4cMO3FHzLYFOM2F8opTxTFeOryjy5iCrCSjUwYdQsmdu7g4mrv25ngKNKgM8HqQyH+DmrbfGcw537wxChEgs8ZpnQRDLUJM5bk7fHtZlcO13tWIlkKJOwjTcRT7dIlQ72cNpfheJZcbhmadphx7sv0pdsaZ5sq7DapD8RmONi8tqKVqictj1LGot/i3qsyG3rZfIMxdaG47L+qIjQ1kx+RI56sfeNZ4csTIabXe6UcwLp/wKzpqwSHGU/1gF/i2n64x13xg6TVFYMLmsAIfpEW0wuRbdZvUWHMqKP7bUrTy5I/CDbyA01gt15E8sw3etMo1AV2q/V3vvQW6wIDAQAB';
	// 向量
	IV: number[] = [109, 115, 116, 112, 115, 105, 110, 111, 115, 117, 110, 99, 111, 109, 99, 110];
	// 参数，长度必须是8的倍数
	keyStr: string = 'SWPTCMhelloworld';
	// 加密
	encrypt(word: any) {
		const { IV, keyStr } = this;
		let key = CryptoJS.enc.Utf8.parse(keyStr);
		let ivBv = new Uint8Array(IV);
		let ivWA = u8arrayParse(ivBv);
		let srcs = CryptoJS.enc.Utf8.parse(word);
		let encrypted = CryptoJS.AES.encrypt(srcs, key, {
			iv: ivWA,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		let result = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
		return result;
	}
	// 解密
	decrypt(word: any) {
		word = base64UrlSafe2Base64UrlUnsafe(word);
		const { IV, keyStr } = this;
		let key = CryptoJS.enc.Utf8.parse(keyStr);
		let ivBv = new Uint8Array(IV);
		let ivWA = u8arrayParse(ivBv);
		let decrypt = CryptoJS.AES.decrypt(word, key, {
			iv: ivWA,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		let deData = CryptoJS.enc.Utf8.stringify(decrypt).toString();
		return deData;
	}
}

// Converts a Uint8Array to a word array
function u8arrayParse(u8arr: any): any {
	let len = u8arr.length;
	let words: any = [];
	for (let i = 0; i < len; i++) {
		words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
	}
	return CryptoJS.lib.WordArray.create(words, len);
}

// base65UrlSafe转base64
function base64UrlSafe2Base64UrlUnsafe(base64UrlSafeStr: string): string {
	return base64UrlSafeStr.replace(/_/g, '/').replace(/-/g, '+');
}

export default new AESCryptUtil()





/*
 * @Author: huxudong
 * @Date: 2020-12-09 16:28:31
 * @LastEditTime: 2021-03-03 16:27:01
 * @Description: 数据存储类，部分方法需要由子类实现
 */
class StorageUtil {
	// 获取localStorage中的参数
	getLocalStorage(key: string) {
		return this.getStorage('localStorage', key, [], true);
	}
	// 更改localStorage中的参数
	setLocalStorage(key: string, value: any) {
		return this.setStorage('localStorage', key, value);
	}
	// 获取sessionStorage中的参数
	getSessionStorage(key: string) {
		return this.getStorage('sessionStorage', key, [], true);
	}
	// 更改sessionStorage中的参数
	setSessionStorage(key: string, value: any) {
		return this.setStorage('sessionStorage', key, value);
	}
	// 获取本地参数
	getStorage(type: string, key: string, attrs: string[], isJson: boolean) {
		const storage: any = type == 'localStorage' ? localStorage : sessionStorage;
		let value;

		// 没有指定参数
		if (!key) {
			key = this.formatKey(key);

			// 返回所有的参数
			const result = {};
			for (let i = 0; i < storage.length; i++) {
				let key = storage.key(i);
				let value = storage.getItem(key) || '';
				if (value) {
					value = value.replace(/^"/, '').replace(/"$/, '');
					value = this.decrypt(value);
				}
				result[key] = value;
			}
			value = result;
		}
		// 指定某个参数
		else {
			key = this.formatKey(key);

			// 返回该参数的值
			value = storage.getItem(key) || '';
			if (value) {
				value = value.replace(/^"/, '').replace(/"$/, '');
				value = this.decrypt(value);
			}

			// 返回该参数的某些属性
			if (value && attrs && attrs.length) {
				const obj = JSON.parse(value);
				const result = {};
				attrs.forEach(e => {
					result[e] = obj[e] || '';
				});
				value = result;
			}
			// 转换参数值的类型
			if (typeof value == 'string') {
				if (isJson) {
					if (!value) {
						value = {};
					} else {
						try {
							value = JSON.parse(value);
						} catch (err) {
							console.log(err);

							// 如果解析出了问题，清空本地存储，然后重载页面
							localStorage.clear();
							sessionStorage.clear();
							location.reload();
							return;
						}
					}
				}
			} else {
				if (!isJson) {
					value = value ? JSON.stringify(value) : '';
				} else {
					value = value || {};
				}
			}
		}

		return value;
	}
	// 设置本地参数
	setStorage(type: string, key: string, value: any) {
		const storage: any = type == 'localStorage' ? localStorage : sessionStorage;
		key = this.formatKey(key);

		if (!value) {
			storage.setItem(key, '');
		} else {
			// 合并参数的值
			if (typeof value == 'string') value = JSON.parse(value);
			let oldVal = this.getStorage(type, key, [], true);
			value = {
				...oldVal,
				...value
			}

			// 加密参数的值
			value = this.encrypt(JSON.stringify(value));

			storage.setItem(key, value);
		}
	}
	// 格式化参数名
	formatKey(key: string): string {
		return key;
	}
	// 加密
	encrypt(value: string): string {
		return value;
	}
	// 解密
	decrypt(value: string): string {
		return value;
	}
}

export default StorageUtil;
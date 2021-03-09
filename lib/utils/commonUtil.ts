/*
 * @Author: huxudong
 * @Date: 2020-12-09 18:38:14
 * @LastEditTime: 2021-03-02 16:20:29
 * @Description: 提供项目中经常用到的公共函数
 */
import { blobToDownload } from './fileUtil';

// 生成指定位数的随机字符串
export function randomString(len: number = 32): string {
	let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	let pwd = '';
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * $chars.length));
	}
	return pwd;
}

// 获取url中的参数 
export function getUrlParams(url: string): any {
	url = url || window.location.href;
	let regexP = /[^#&\?]+=[^#&\?]*/ig, res = {};
	let ms = url.match(regexP);
	if (ms) {
		for (let i = 0; i < ms.length; i++) {
			let arr = ms[i].split('=');
			res[arr[0]] = decodeURI(arr[1]);
		}
	}
	return res;
}

// 长字符省略
export function longCharCut(charName: string, len: number): string {
	if (charName.length > len) charName = charName.substring(0, len) + '...';
	return charName;
}

// html转义
export function htmlEncodeByRegExp(str: string): string {
	if (str.length == 0) return "";
	var s = "";
	s = str.replace(/&/g, "&amp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/ /g, "&nbsp;");
	s = s.replace(/\'/g, "&#39;");
	s = s.replace(/\"/g, "&quot;");
	return s;
}

// 格式化一个JSON对象
export function formatJsonObj(target) {
	const result = {};

	for (const attr in target) {
		if (!/^_\w+_$/.test(attr)) {
			let value = target[attr];

			switch (Object.prototype.toString.call(value)) {
				case "[object Function]":
					continue;
				case "[object Object]":
					value = formatJsonObj(value);
					break;
				case "[object Array]":
					value = value.map(e => {
						if (Object.prototype.toString.call(e) == '[object Object]') {
							return formatJsonObj(e);
						} else {
							return e;
						}
					});
					break;
			}

			if (attr[0] == '_') {
				result[attr.substring(1)] = value;
			} else {
				result[attr] = value;
			}
		}
	}

	return result;
}

// 时间格式化
(Date as any).prototype.format = function (fmt: string): string {
	var showDayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
	var o = {
		"M+": this.getMonth() + 1, // 月份
		"d+": this.getDate(), // 日
		"E+": showDayArr[this.getDay()], //  周
		"D+": this.getDate(), // 日
		"H+": this.getHours(), //  小时
		"m+": this.getMinutes(), // 分
		"s+": this.getSeconds(), //  秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //  季度
		"S": this.getMilliseconds() // 毫秒
	};
	if (/(y+)/i.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

// 将日期转换成yyyy-mm-dd
export function dateFormat(date: any, sep: string = '-'): string {
	date = typeof date == 'object' ? date : new Date(date);

	const year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate()

	return year + sep + (month < 10 ? ('0' + month) : month) + sep + (day < 10 ? ('0' + day) : day);
}

// 获取当前函数的节流函数
export function throttle(fn: Function, delay: number = 300): Function {
	let open = true;
	return function () {
		const args = arguments;
		if (open) {
			open = false;
			setTimeout(() => {
				fn.apply(this, args);
				open = true;
			}, delay);
		}
	}
}

// 获取当前函数的防抖函数
export function debounce(fn: Function, delay: number = 400): Function {
	let timer: any = null;
	return function () {
		const args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	}
}

// 获取输入框中光标的位置
export function getCursorPos(target: any): any {
	const isIE = !(!document.all);
	let startIdx = 0, endIdx = 0;

	if (isIE) {
		const sTextRange = (document as any).selection.createRange();
		if (sTextRange.parentElement() == target) {
			const oTextRange = (document as any).body.createTextRange();
			oTextRange.moveToElementText(target);
			for (startIdx = 0; oTextRange.compareEndPoints("StartToStart", sTextRange) < 0; startIdx++) {
				oTextRange.moveStart('character', 1);
			}
			for (let i = 0; i <= startIdx; i++) {
				if (target.value.charAt(i) == '\n') {
					startIdx++;
				}
			}
			oTextRange.moveToElementText(target);
			for (endIdx = 0; oTextRange.compareEndPoints('StartToEnd', sTextRange) < 0; endIdx++) {
				oTextRange.moveStart('character', 1);
			}
			for (let i = 0; i <= endIdx; i++) {
				if (target.value.charAt(i) == '\n') {
					endIdx++;
				}
			}
		}
	} else {
		startIdx = target.selectionStart;
		endIdx = target.selectionEnd;
	}

	return { startIdx, endIdx };
}

// 判断是否为PC端
export function isPC(): boolean {
	var userAgentInfo = navigator.userAgent;
	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
	}
	return flag;
}

// 验证用户名
export function checkName(value: string, isStrong: boolean = false): boolean {
	return !isStrong
		? /^[0-9A-Za-z]{6,20}$/.test(value)
		: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value);
}

// 验证密码
export function checkPwd(value: string, isStrong: boolean = false): boolean {
	return !isStrong
		? /^[0-9A-Za-z]{8,20}$/.test(value)
		: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$.%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$.%^&*`~()-+=]+$)(?![0-9\W_!@#$.%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#.$%^&*`~()-+=]{8,20}$/.test(value);
}

// 验证邮箱规则
export function checkEmail(value: string): boolean {
	if (value && value != '') {
		var websiteCheck = /(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$)|(^$)/.test(value);
		if (!websiteCheck) return false;
	}
	return true;
}

// 验证网址的规则
export function checkWebsite(value: string): boolean {
	if (value && value != '') {
		var reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
		if (!reg.test(value)) return false;
	}
	return true;
}

// 弹框提示，过一段时间就会消失
export function showToast(text: string, time: number = 2000) {
	let tipsBox: any = document.querySelector('.tipsBox');
	if (!tipsBox) {
		tipsBox = document.createElement('div');
		tipsBox.className = 'tipsBox';
		tipsBox.innerHTML = `<span>${text}</span>`;
		document.body.appendChild(tipsBox);
	} else if (tipsBox.style.display == 'none') {
		tipsBox.style.display = 'block';
		tipsBox.innerHTML = `<span>${text}</span>`;
	} else {
		clearTimeout((window as any).tipsTimer);
		tipsBox.innerHTML = `<span>${text}</span>`;
	}
	(window as any).tipsTimer = setTimeout(() => {
		tipsBox.style.display = 'none';
	}, time);
}

// 下载文件
export function download(url: string, fileName: string): void {
	const xhr = new XMLHttpRequest();
	xhr.open("get", url);
	xhr.responseType = "blob";
	xhr.send();
	xhr.onload = function () {
		if (this.status === 200 || this.status === 304) {
			blobToDownload(this.response, fileName);
		} else {
			showToast("请求错误，请稍后重试", 2000);
		}
	}
}

// 获取类型名称
export function getClass(target) {
	return (Object as any).prototype.toString.call(target).match(/^\[object\s(.*)\]$/)[1];
}

// 数组去重
export function removedDuplicate(arr: any[], key: string): any[] {
	const newArr: any[] = [], tempArr: any[] = [];
	if (arr.length == 0) {
		return arr;
	} else {
		if (key) {
			for (let i = 0; i < arr.length; i++) {
				if (!tempArr[arr[i][key]]) {
					newArr.push(arr[i]);
					tempArr[arr[i][key]] = true;
				}
			}
			return newArr;
		} else {
			for (let i = 0; i < arr.length; i++) {
				if (!tempArr[arr[i]]) {
					newArr.push(arr[i]);
					tempArr[arr[i]] = true;
				}
			}
			return newArr;
		}
	}
}

// 判断数组是否是空白
export function isEmpty(array) {
	if (!Array.isArray(array)) {
		return false;
	}
	return array.filter((el) => {
		const type = getClass(el);
		const typeMap = new Map([
			['String', el],
			['Object', Object.keys(el).length],
			['Array', isEmpty(el)],
		]);
		return typeMap.get(type);
	}).length
}

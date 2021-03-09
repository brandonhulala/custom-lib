/*
 * @Author: huxudong
 * @Date: 2020-11-13 18:09:27
 * @LastEditTime: 2021-03-09 08:45:44
 * @Description: 通用的网络请求方法，不处理任何业务逻辑
 */
import axios from 'axios';
import qs from 'qs';
import JWECryptUtil from '../utils/JWECryptUtil';
import { CommonErrorCode, CommonErrorDesc } from './CommonError';

// 创建一个请求实例
const axiosInstance: any = axios.create();

// 请求拦截器
axiosInstance.interceptors.request.use(config => {
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
axiosInstance.interceptors.response.use(response => {
    return Promise.resolve(response.data || {});
}, error => {
    return Promise.reject(error);
});

class Net {
    // 请求实例
    reqInstance: any = null

    // 处理请求
    doRequest(method: string, url: string, params: any, headers: any, options: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            // 请求业务接口
            const reqBisConfig = this.getReqBisConfig(method, url, params, headers, options);
            if (options.apiType == 0) {
                this.reqInstance = axiosInstance(reqBisConfig)
                    .then((data: any) => {
                        if (typeof data.result == 'undefined') {
                            const obj: any = {};
                            // keycloak
                            if (typeof data.data == 'undefined') {
                                obj.resultCode = 0;
                                obj.resultMessage = '';
                                obj.result = data;
                            }
                            // 大数据平台
                            else {
                                obj.resultCode = data.code;
                                obj.resultMessage = data.rdesc;
                                obj.result = data.data || {};
                            }
                            resolve(obj);
                        }
                        // 一般业务
                        else {
                            resolve(data);
                        }
                    });
            }
            // 请求代理接口
            else {
                const reqProxyConfig = await this.getReqProxyConfig(reqBisConfig, options);
                this.reqInstance = axiosInstance(reqProxyConfig)
                    .then(async (data: any) => {
                        if (options.isCrypt) data = JSON.parse(await JWECryptUtil.decrypt(data, reqProxyConfig.cek));

                        let { body, result } = data;
                        body = body || result;
                        data = body ? JSON.parse(body) : {};

                        const obj: any = {};
                        // 大数据平台
                        if (typeof data.result == 'undefined') {
                            obj.resultCode = data.code;
                            obj.resultMessage = data.rdesc;
                            obj.result = data.data || {};
                        }
                        // 一般业务
                        else {
                            obj.resultCode = typeof data.resultCode != 'undefined' ? data.resultCode : this.tranferCode(data.code);
                            obj.resultMessage = data.resultMessage || data.message;
                            obj.result = data.result || {};
                        }
                        resolve(obj);
                    });
            }

            // 处理响应异常
            this.reqInstance.catch(error => {
                const response = error.response;
                const code = response ? response.status : -1;
                error.code = this.tranferCode(code);
                error.message = CommonErrorDesc[error.code];
                reject(error);
            });
        });
    }

    // 获取请求业务接口的配置
    getReqBisConfig(method: string, url: string, params: any, headers: any, options: any): any {
        let { pathPrefix, baseURL, token, timeout } = options;

        // 获取请求的完整路径
        url = /^(http:|https:)/.test(url) ? url : pathPrefix + baseURL + url;
        // 添加请求头中的信息
        headers['Content-Type'] = headers['Content-Type'] || this.getContentType(method, params);
        if (token) headers['Authorization'] = token;
        // 获取请求的参数
        params = this.formatParams(method, params, headers['Content-Type']);
        // 获取请求的超时时间
        timeout = timeout || 1000 * 60;

        return {
            method,
            url,
            headers,
            ...params,
            timeout
        };
    }

    // 获取请求代理接口的配置
    async getReqProxyConfig(reqBisConfig: any, options: any): Promise<any> {
        const { timeout } = reqBisConfig;
        reqBisConfig = this.formatReqBisConfig(reqBisConfig, options);
        const { pathPrefix, isCrypt } = options;
        const cryptConfig: any = !isCrypt ? {} : await JWECryptUtil.encrypt(JSON.stringify(reqBisConfig));

        return {
            method: 'POST',
            url: pathPrefix + '/proxy/bsl/request',
            headers: {
                'x-bplus-encryption': isCrypt,
                'Content-Type': 'application/json'
            },
            data: !isCrypt ? reqBisConfig : cryptConfig.data,
            cek: cryptConfig.cek,
            timeout
        }
    }

    // 格式化请求业务接口的配置
    formatReqBisConfig(config: any, options: any): any {
        const { method, url, headers, params, data } = config;

        return {
            version: '1.1',
            method,
            path: url.replace(options.pathPrefix, ''),
            headers: this.formatHeaders(headers),
            param: params ? qs.stringify(params) : '',
            body: data ? JSON.stringify(data) : '{}',
            reqid: this.getUUID(),
            timestamp: Math.round(new Date().getTime() / 1000)
        };
    }

    // 格式化请求头
    formatHeaders(headers: any) {
        const arr: string[] = [];
        for (const attr in headers) {
            arr.push(`${attr}: ${headers[attr]}`);
        }
        return arr;
    }

    // 格式化请求参数
    formatParams(method: string, params: any, contentType: string): any {
        if (method == 'GET') {
            return {
                params
            }
        } else {
            let data: any;

            if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
                data = typeof params == 'string' ? params : qs.stringify(params);
            } else {
                data = params;
            }

            return {
                data
            }
        }
    }

    // 获取内容类型
    getContentType(method: string, params: any): string {
        if (method == 'GET') {
            return 'application/x-www-form-urlencoded';
        } else {
            if (typeof params == 'string') {
                return 'application/x-www-form-urlencoded';
            } else {
                return 'application/json';
            }
        }
    }

    // 获取UUID
    getUUID() {
        let s: any[] = [], hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        let uuid = s.join("");
        return uuid;
    }

    // 转换状态码
    tranferCode(code: number): number {
        switch (code) {
            case 200:
                return CommonErrorCode.SUCCESS;
            case 400:
                return CommonErrorCode.PARAM_ERROR;
            case 401:
                return CommonErrorCode.UN_AUTHORIZED_TOEKN;
            case 403:
                return CommonErrorCode.NO_PERMISSION_API;
            case 404:
                return CommonErrorCode.URL_ERROR;
            case 490:
            case 500:
                return CommonErrorCode.SERVICE_ERROR;
            case 504:
                return CommonErrorCode.NETWORK_TIMEOUT;
            default:
                return CommonErrorCode.UNKNOWN_ERROR;
        }
    }
}

export default new Net();
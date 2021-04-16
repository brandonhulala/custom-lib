/*
 * @Author: huxudong
 * @Date: 2020-12-09 18:38:14
 * @LastEditTime: 2021-04-12 10:41:16
 * @Description: 基础请求类，部分参数的获取方法需要在子类中实现
 */
import Net from './Net';
import { CommonErrorCode, CommonErrorDesc } from './CommonError';
import BaseResponse from './BaseResponse';
import { showToast } from '../utils/commonUtil';

class BaseRequest {
    // 处理请求
    doRequest(method: string, url: string, params: any = {}, headers: any = {}, options: any = {}): Promise<BaseResponse> {
        return new Promise(async (resolve, reject) => {
            // 优先取传入的参数，如果没有，就取调用实例方法得到的结果
            headers['Content-Type'] = typeof headers['Content-Type'] != 'undefined' ? headers['Content-Type'] : this.getContentType();
            options.apiType = typeof options.apiType != 'undefined' ? options.apiType : this.getApiType();
            options.pathPrefix = typeof options.pathPrefix != 'undefined' ? options.pathPrefix : this.getPathPrefix();
            options.baseURL = typeof options.baseURL != 'undefined' ? options.baseURL : this.getBaseURL();
            options.token = typeof options.token != 'undefined' ? options.token : await this.getToken();
            options.isCrypt = typeof options.isCrypt != 'undefined' ? options.isCrypt : this.getIsCrypt();
            options.isToast = typeof options.isToast != 'undefined' ? options.isToast : this.getIsToast();

            // 调用通用的请求方法
            Net.doRequest(method, url, params, headers, options)
                .then(res => {
                    resolve(this.handleResponse(res, { url, params }));
                })
                .catch(error => {
                    if (options.isToast) showToast(error.message);
                    reject(error);
                });
        });
    }

    // 处理接口返回结果
    handleResponse(response: any, request: any): BaseResponse {
        // 添加错误码
        const resultCode = response.resultCode;
        const baseResponse = new BaseResponse(resultCode);

        // 添加错误信息
        if (resultCode != CommonErrorCode.SUCCESS) {
            baseResponse.resultMessage = CommonErrorDesc[resultCode] || this.getBisErrorDesc(resultCode) || response.resultMessage;
        }

        // 添加响应数据
        baseResponse.result = response.result;
        // 添加请求对象
        baseResponse.request = request;

        return baseResponse;
    }

    // 获取请求的内容类型
    getContentType(): string {
        return '';
    }

    // 获取请求的接口类型，0为业务接口，1为代理接口
    getApiType(): string {
        return '0';
    }

    // 获取具体的路径前缀
    getPathPrefix(): string {
        return '';
    }

    // 获取具体的基础路径
    getBaseURL(): string {
        return '';
    }

    // 获取具体的身份令牌
    getToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve('');
        });
    }

    // 获取是否进行加解密
    getIsCrypt(): boolean {
        return false;
    }

    // 获取是否显示提示框
    getIsToast(): boolean {
        return true;
    }

    // 获取具体的的业务错误码
    getBisErrorDesc(resultCode: number): string {
        return '';
    }

    // get请求
    doGet(url: string, params?: any, headers?: any, options?: any): Promise<BaseResponse> {
        return this.doRequest('GET', url, params, headers, options);
    }

    // post请求
    doPost(url: string, params?: any, headers?: any, options?: any): Promise<BaseResponse> {
        return this.doRequest('POST', url, params, headers, options);
    }

    // put请求
    doPut(url: string, params?: any, headers?: any, options?: any): Promise<BaseResponse> {
        return this.doRequest('PUT', url, params, headers, options);
    }

    // 将接口返回的对象数组，转换成实例化之后的数组
    toInstanceArray(list: any[], className: any): any[] {
        return list.map(e => new className(e));
    }
}

export default BaseRequest;
/*
 * @Author: huxudong
 * @Date: 2020-11-13 18:09:27
 * @LastEditTime: 2021-01-21 10:12:14
 * @Description: 基础响应类
 */
import { CommonErrorCode } from './CommonError';

class BaseResponse {
    constructor(
        public resultCode: number = CommonErrorCode.SUCCESS, // 业务错误码
        public resultMessage: string = '', // 业务错误描述
        public result: any = {}, // 业务返回数据对象
        public request: any = {} // 业务请求时的参数
    ) {
        this.resultCode = resultCode;
        this.resultMessage = resultMessage;
        this.result = result;
        this.request = request;
    }

    // 业务操作是否成功
    isSuccess(): boolean {
        return this.resultCode == CommonErrorCode.SUCCESS;
    }
    // 网络是否超时
    isTimeout(): boolean {
        return this.resultCode == CommonErrorCode.NETWORK_TIMEOUT;
    }
}

export default BaseResponse;
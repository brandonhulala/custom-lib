/*
 * @Author: huxudong
 * @Date: 2020-11-13 18:09:27
 * @LastEditTime: 2021-02-04 15:32:44
 * @Description: 通用的错误码和错误描述
 */
export enum CommonErrorCode {
    // 请求成功
    SUCCESS = 0,

    // 请求参数错误
    PARAM_ERROR = -4000,
    // 用户未授权
    UN_AUTHORIZED_TOEKN = -4001,
    // 没有接口访问权限
    NO_PERMISSION_API = -4003,
    // 路径错误
    URL_ERROR = -4004,
    // 服务器故障
    SERVICE_ERROR = -5000,
    // 请求超时
    NETWORK_TIMEOUT = -5004,
    // 未知错误
    UNKNOWN_ERROR = -9999
}

export const CommonErrorDesc = {
    [CommonErrorCode.SUCCESS]: '请求成功!',
    [CommonErrorCode.PARAM_ERROR]: '请求参数错误!',
    [CommonErrorCode.UN_AUTHORIZED_TOEKN]: '用户认证失败!',
    [CommonErrorCode.NO_PERMISSION_API]: '请求ID重复，或者时间戳已过期!',
    [CommonErrorCode.URL_ERROR]: '请求地址错误!',
    [CommonErrorCode.SERVICE_ERROR]: '服务故障，请稍后重试!',
    [CommonErrorCode.NETWORK_TIMEOUT]: '请求超时，请检查网络稍后重试!',
    [CommonErrorCode.UNKNOWN_ERROR]: '未知错误，请稍后重试!'
}
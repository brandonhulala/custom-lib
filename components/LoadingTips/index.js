/*
 * @Author: huxudong
 * @Date: 2021-01-19 16:12:18
 * @LastEditTime: 2021-01-20 13:47:37
 * @Description: 注册为vue插件
 */
import LoadingTips from './LoadingTips.vue';

LoadingTips.install = Vue => Vue.component(LoadingTips.name, LoadingTips);

export default LoadingTips;


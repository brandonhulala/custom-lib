/*
 * @Author: huxudong
 * @Date: 2021-01-19 16:12:18
 * @LastEditTime: 2021-01-20 14:52:48
 * @Description: 注册为vue插件
 */
import ChooseFile from './ChooseFile.vue';

ChooseFile.install = Vue => Vue.component(ChooseFile.name, ChooseFile);

export default ChooseFile;


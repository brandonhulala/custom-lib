/*
 * @Author: huxudong
 * @Date: 2021-01-19 16:12:18
 * @LastEditTime: 2021-03-02 18:12:46
 * @Description: 注册为vue插件
 */
import SelectListPopup from './SelectListPopup.vue';

SelectListPopup.install = Vue => Vue.component(SelectListPopup.name, SelectListPopup);

export default SelectListPopup;


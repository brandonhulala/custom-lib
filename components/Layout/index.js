/*
 * @Author: huxudong
 * @Date: 2021-01-19 16:12:18
 * @LastEditTime: 2021-02-23 16:26:20
 * @Description: 注册为vue插件
 */
import Layout from './Layout.vue';

Layout.install = Vue => Vue.component(Layout.name, Layout);

export default Layout;


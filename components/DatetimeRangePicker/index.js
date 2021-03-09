/*
 * @Author: huxudong
 * @Date: 2021-01-19 16:12:18
 * @LastEditTime: 2021-02-24 15:43:02
 * @Description: 注册为vue插件
 */
import DatetimeRangePicker from './DatetimeRangePicker.vue';

DatetimeRangePicker.install = Vue => Vue.component(DatetimeRangePicker.name, DatetimeRangePicker);

export default DatetimeRangePicker;


<!--
 * @Author: huxudong
 * @Date: 2021-03-01 09:05:49
 * @LastEditTime: 2021-03-03 11:23:38
 * @Description: DatetimeRangePicker组件说明文档
-->
## 功能
  + 选择一定范围的日期时间

## 属性
  + value：传入的初始值
    - 可以使用v-model进行双向绑定
    - 格式必须为数组，默认为[]
    - 如果开始时间或者结束时间为空，就令其为空的字符串，例如['',value]、[value,'']

## 事件
  + change：监听选择器的值的改变，参数是新的value

## 例子
    ```
    <template>
        <DatetimeRangePicker v-model="value" />
    </template>

    <script>
    import { DatetimeRangePicker } from "sinosun-operation-ui";
    export default {
        components: {
            DatetimeRangePicker
        },
        data(){
            return {
                value: []
            }
        }
    };
    </script>
    ```
    
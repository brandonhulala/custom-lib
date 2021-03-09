<!--
 * @Author: huxudong
 * @Date: 2021-02-23 09:37:58
 * @LastEditTime: 2021-03-08 14:18:42
 * @Description: 带范围区间的日期时间选择器
-->
<template>
    <el-date-picker :value="value"
        type="datetimerange" align="right" range-separator="至" 
        start-placeholder="开始日期" end-placeholder="结束日期"
        :picker-options="pickerOptions" 
        @input="onChange"
    />
</template>

<script>
import ElDatePicker from "element-ui/lib/date-picker";

export default {
    name: "DatetimeRangePicker",
    components: {
        "el-date-picker": ElDatePicker,
    },
    model: {
        prop: "value",
        event: "change",
    },
    props: {
        value: Array,
    },
    data() {
        return {
            pickerOptions: {
                // 快捷选项
                shortcuts: [
                    {
                        text: "今日",
                        onClick(picker) {
                            const start = new Date(),
                                end = new Date();
                            start.setHours(0, 0, 0);
                            end.setHours(23, 59, 59);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "昨日",
                        onClick(picker) {
                            const start = new Date(),
                                end = new Date();
                            start.setDate(start.getDate() - 1);
                            start.setHours(0, 0, 0);
                            end.setDate(end.getDate() - 1);
                            end.setHours(23, 59, 59);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "本周",
                        onClick(picker) {
                            const start = new Date(),
                                end = new Date();
                            const day = start.getDay();
                            start.setDate(
                                start.getDate() - (day == 0 ? 6 : day - 1)
                            );
                            start.setHours(0, 0, 0);
                            end.setDate(
                                end.getDate() + (day == 0 ? 0 : 7 - day)
                            );
                            end.setHours(23, 59, 59);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "上周",
                        onClick(picker) {
                            const start = new Date(),
                                end = new Date();
                            const day = start.getDay();
                            start.setDate(
                                start.getDate() - (day == 0 ? 6 : day - 1) - 7
                            );
                            start.setHours(0, 0, 0);
                            end.setDate(
                                end.getDate() + (day == 0 ? 0 : 7 - day) - 7
                            );
                            end.setHours(23, 59, 59);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "本月",
                        onClick(picker) {
                            const start = new Date(),
                                end = new Date();
                            const month = start.getMonth();
                            start.setMonth(month, 1);
                            start.setHours(0, 0, 0);
                            end.setMonth(month + 1, 0);
                            end.setHours(23, 59, 59);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "上月",
                        onClick(picker) {
                            const start = new Date(),
                                end = new Date();
                            const month = start.getMonth();
                            start.setMonth(month - 1, 1);
                            start.setHours(0, 0, 0);
                            end.setMonth(month, 0);
                            end.setHours(23, 59, 59);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "本年",
                        onClick(picker) {
                            const start = new Date(),
                                end = new Date();
                            const year = start.getFullYear();
                            start.setFullYear(year, 0, 1);
                            start.setHours(0, 0, 0);
                            end.setFullYear(year, 11, 31);
                            end.setHours(23, 59, 59);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "去年",
                        onClick(picker) {
                            const start = new Date(),
                                end = new Date();
                            const year = start.getFullYear();
                            start.setFullYear(year - 1, 0, 1);
                            start.setHours(0, 0, 0);
                            end.setFullYear(year - 1, 11, 31);
                            end.setHours(23, 59, 59);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "过去7天",
                        onClick(picker) {
                            const start = new Date(),
                                end = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "过去30天",
                        onClick(picker) {
                            const start = new Date(),
                                end = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit("pick", [start, end]);
                        },
                    },
                ],
            },
        };
    },
    methods: {
        // 监听输入框的改变
        onChange(value) {
            this.$emit("change", value || []);
        },
    },
};
</script>

<style src="./DatetimeRangePicker.less" lang="less"></style>
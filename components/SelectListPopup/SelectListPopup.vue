<!--
 * @Author: huxudong
 * @Date: 2021-02-26 16:44:37
 * @LastEditTime: 2021-03-08 14:18:33
 * @Description: 可选择的列表弹窗
-->
<template>
    <el-dialog custom-class="selectListPopup" ref="dialog" width="80%" top="0" center 
        :visible="isVisible" :title="title" :close-on-click-modal="false" @close="onCancel"
    >
        <div class="dialog-content">
            <div class="content-area">
                <!-- 搜索 -->
                <div class="dialog-search">
                    <el-input placeholder="搜索" :value="searchName" @input="onSearchIpt" @keyup.native.enter="onSearchEnter" />
                    <span class="icon"><i class="el-icon-zoom-in" @click="onSearchEnter"></i></span>
                </div>
                <!-- 列表 -->
                <el-table class="dialog-table" ref="dialogTable" height="300px" stripe :data="data" v-scroll-to-end="loadMore" @select="onSelectItem" @select-all="onSelectAll">
                    <el-table-column width="55" type="selection" />
                    <el-table-column v-for="(item,index) in columns" :key="index" :min-width="item.minWidth" :label="item.label" :prop="item.prop">
                        <template slot-scope="scope">{{!item.getValue ? scope.row[item.prop] : item.getValue(scope.row)}}</template>
                    </el-table-column>
                    <div class="dialog-empty" ref="dialogEmpty" slot="empty" v-show="!isLoadingInit">
                        <p class="noInitData">暂无数据</p>
                    </div>
                    <div class="dialog-more" ref="dialogMore" slot="append">
                        <p class="noMoreData" v-show="isNoMore">没有更多数据了...</p>
                    </div>
                </el-table>
            </div>
            <!-- 选择 -->
            <div class="selected-area">
                <p class="selected-title">已选择（{{selectedNum}}）</p>
                <ul class="selected-list">
                    <li class="selected-item" v-for="(item,index) in this.selectedResult" :key="index">
                        <span class="name">{{item[nameKey]}}</span>
                        <img class="del" :src="img_del" @click="onDelItem(item,index)" />
                    </li>
                </ul>
            </div>
        </div>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="onCancel">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </span>
    </el-dialog>  
</template>

<script>
import ElDialog from "element-ui/lib/dialog";
import ElButton from "element-ui/lib/button";
import ElInput from "element-ui/lib/input";
import ElTable from "element-ui/lib/table";
import ElTableColumn from "element-ui/lib/table-column";
import ElLoading from "element-ui/lib/loading";

export default {
    name: "SelectListPopup",
    components: {
        "el-dialog": ElDialog,
        "el-button": ElButton,
        "el-input": ElInput,
        "el-table": ElTable,
        "el-table-column": ElTableColumn,
    },
    props: {
        isVisible: Boolean, // 显隐
        title: String, // 标题
        data: Array, // 所有的数据
        total: Number, // 总长度
        selectedData: Array, // 外部传入的被选中数据
        columns: Array, // 列配置
        idKey: {
            // 每条数据的唯一标识对应的字段名
            type: String,
            default: "id",
        },
        nameKey: {
            // 每条数据的名称对应的字段名
            type: String,
            default: "name",
        },
    },
    data() {
        return {
            img_del: require("../../assets/img/del_sm.png"), // 删除图标
            isLoadingInit: false, // 是否正在加载初始数据
            isLoadingMore: false, // 是否正在加载更多数据
            isNoMore: false, // 是否没有更多数据
            searchName: "", // 搜索关键字
            isRefreshing: false, // 是否正在刷新数据
            selectedResult: [], // 最终选中的结果
        };
    },
    computed: {
        // 选择的数量
        selectedNum() {
            const { selectedResult, total } = this;
            if (!total) {
                return selectedResult.length;
            } else {
                return selectedResult.length + "/" + total;
            }
        },
    },
    watch: {
        // 监听弹窗的显隐
        isVisible(newVal) {
            if (newVal) this.loadInit();
        },
        // 监听传入的所有数据
        data(newVal, oldVal) {
            this.isLoadingInit = false;
            this.isLoadingMore = false;

            if (newVal && newVal.length) {
                if (!this.isRefreshing) {
                    this.isNoMore = newVal.length == oldVal.length;
                } else {
                    this.isNoMore = false;
                    this.isRefreshing = false;
                }

                // 回显外部传入的被选中数据
                this.$nextTick(() => {
                    const { selectedResult, idKey } = this;
                    newVal.forEach((e) => {
                        const isSelected = selectedResult.find(
                            (e2) => e2[idKey] == e[idKey]
                        )
                            ? true
                            : false;
                        this.$refs.dialogTable.toggleRowSelection(
                            e,
                            isSelected
                        );
                    });
                });
            } else {
                this.isNoMore = false;
            }
        },
        // 监听传入的被选中数据
        selectedData(newVal) {
            this.selectedResult = newVal;
        },
        // 监听正在加载初始数据
        isLoadingInit(newVal) {
            this.$nextTick(() => {
                if (newVal) {
                    this.loadingInitInstance = ElLoading.service({
                        target: this.$refs.dialogTable.$refs.bodyWrapper,
                    });
                } else {
                    this.loadingInitInstance &&
                        this.loadingInitInstance.close();
                }
            });
        },
        // 监听正在加载更多数据
        isLoadingMore(newVal) {
            this.$nextTick(() => {
                if (newVal) {
                    this.loadingMoreInstance = ElLoading.service({
                        target: this.$refs.dialogMore,
                    });
                } else {
                    this.loadingMoreInstance &&
                        this.loadingMoreInstance.close();
                }
            });
        },
    },
    directives: {
        // 滚动到列表底部
        scrollToEnd: {
            bind(el, binding, vnode) {
                let isOpen = true;
                const scrollEle = el.querySelector(".el-table__body-wrapper");
                const that = vnode.context;
                that.scrollEle = scrollEle;
                scrollEle.addEventListener("scroll", function () {
                    if (!isOpen) return;
                    if (!that.isVisible) return;
                    if (that.isLoadingInit || that.isLoadingMore) return;
                    if (that.isNoMore) return;
                    isOpen = false;
                    setTimeout(() => {
                        isOpen = true;
                        if (
                            this.scrollTop &&
                            this.scrollHeight -
                                this.scrollTop -
                                this.clientHeight <=
                                50
                        ) {
                            binding.value();
                        }
                    }, 700);
                });
            },
        },
    },
    methods: {
        // 加载初始数据
        loadInit() {
            this.isLoadingInit = true;
            this.$emit("loadInit");
        },
        // 加载更多数据
        loadMore() {
            this.isLoadingMore = true;
            this.$emit("loadMore");
        },
        // 监听搜索框的输入
        onSearchIpt(value) {
            this.searchName = value.trim();
        },
        // 按下搜索框的回车键
        onSearchEnter() {
            this.onRefresh();
            this.$emit("search", this.searchName);
        },
        // 监听选择某一项
        onSelectItem(selection, row) {
            const { selectedResult, idKey } = this;
            const idx = selectedResult.findIndex((e) => e[idKey] == row[idKey]);
            if (idx == -1) {
                selectedResult.push(row);
            } else {
                selectedResult.splice(idx, 1);
            }
        },
        // 监听选择全选
        onSelectAll(selection) {
            const { selectedResult, idKey, data } = this;
            if (selection.length) {
                data.forEach((e) => {
                    const idx = selectedResult.findIndex(
                        (e2) => e2[idKey] == e[idKey]
                    );
                    if (idx == -1) selectedResult.push(e);
                });
            } else {
                data.forEach((e) => {
                    const idx = selectedResult.findIndex(
                        (e2) => e2[idKey] == e[idKey]
                    );
                    if (idx > -1) selectedResult.splice(idx, 1);
                });
            }
        },
        // 点击删除某一项
        onDelItem(item, index) {
            const { selectedResult, idKey, data } = this;
            selectedResult.splice(index, 1);
            const selectItem = data.find((e) => e[idKey] == item[idKey]);
            if (selectItem)
                this.$refs.dialogTable.toggleRowSelection(selectItem, false);
        },
        // 点击取消
        onCancel() {
            if (!this.isVisible) return;
            this.onClear();
            setTimeout(() => {
                this.$emit("cancel");
            }, 500);
        },
        // 点击确定
        onConfirm() {
            this.$emit("confirm", this.selectedResult);
        },
        // 刷新数据
        onRefresh() {
            this.isRefreshing = true;
            this.scrollEle.scrollTop = 0;
            this.isLoadingInit = true;
        },
        // 清空数据
        onClear() {
            this.searchName = "";
            this.$emit("update:isVisible", false);
            this.selectedResult = [];
        },
    },
};
</script>

<style src="./SelectListPopup.less" lang="less"></style>

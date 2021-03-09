<!--
 * @Author: huxudong
 * @Date: 2021-01-19 13:44:29
 * @LastEditTime: 2021-01-20 14:38:36
 * @Description: 加载提示组件
-->
<template>
    <div class="loading-tips" :style="{height: height}">
        <div class="loading-container" :style="{minHeight: minHeight}" v-if="!isLoaded" v-loading="!isLoaded"></div>
        <slot v-else>
            <div class="noData" :style="{marginTop: tipsTop,minHeight: minHeight}">
                <slot name="img" v-if="isTipsImg">
                    <img class="noData-img" :src="img_noData" />
                </slot>
                <slot name="text" v-if="isTipsText">
                    <span class="noData-text" >{{tipsText}}</span>
                </slot>            
            </div>
        </slot>
    </div>
</template>

<script>
export default {
    name: "LoadingTips",
    props: {
        height: {
            // 容器的高度
            type: [Number, String],
            default: "100%",
        },
        minHeight: {
            // 容器的最小高度
            type: [Number, String],
            default: "100%",
        },
        isLoading: {
            //　是否正在加载
            type: Boolean,
            default: false,
        },
        isTipsImg: {
            //　在没有任何数据时，是否显示提示图片
            type: Boolean,
            default: true,
        },
        isTipsText: {
            //　在没有任何数据时，是否显示提示文本
            type: Boolean,
            default: true,
        },
        tipsText: {
            // 在没有任何数据时，提示文本的内容
            type: String,
            default: "暂无数据",
        },
        tipsTop: {
            // 在没有任何数据时，提示内容的向上外边距
            type: [Number, String],
            default: 0,
        },
    },
    data() {
        return {
            img_noData: require("../../assets/img/noData.png"), // 加载图片
            loadingInstance: null, // 加载实例
            isLoaded: false, // 是否加载完成
        };
    },
    watch: {
        // 监听是否正在加载，改变加载效果的显隐
        isLoading(newVal) {
            if (newVal) {
                this.isLoaded = false;
            } else {
                this.isLoaded = true;
            }
        },
    },
};
</script>

<style src="./LoadingTips.less" lang="less" scoped></style>

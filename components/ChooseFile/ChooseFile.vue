<!--
 * @Author: huxudong
 * @Date: 2021-01-19 13:44:29
 * @LastEditTime: 2021-02-26 10:03:24
 * @Description: 文件选择组件
-->
<template>
    <div class="choose-file">
        <input class="upload-btn" type="button" value="上传文件" />
        <i class="upload-icon el-icon-upload2" />
        <input ref="upload" class="file-uploader" style="cursor: pointer;font-size: 0" type="file" name="file" size="3" unselectable="on" placeholder="1111" @change="onChoose($event.currentTarget.files)" />
        <span class="upload-tips">{{fileObj ? fileObj.name : `支持${fileExts.join('、')}格式`}}</span>
    </div>
</template>

<script>
import { showToast } from "../../lib/utils/commonUtil";
import { getFileContent } from "../../lib/utils/fileUtil";

export default {
    name: "ChooseFile",
    props: {
        fileType: String, // 文件后缀名
        dataHandler: Function, // 数据处理函数
        errorHandler: Function, // 错误处理函数
    },
    data() {
        return {
            fileObj: null, // 选择的文件对象
        };
    },
    computed: {
        // 可供选择的文件后缀名
        fileExts() {
            const fileType = this.fileType;

            switch (fileType) {
                case "json":
                    return ["json"];
                case "excel":
                    return ["xls", "xlsx"];
                case "word":
                    return ["doc", "docx", "pdf"];
                default:
                    return [fileType];
            }
        },
    },
    methods: {
        //  点击选择文件
        async onChoose(files) {
            if (files.length) {
                const fileObj = files[0];
                const fileName = fileObj.name;
                const fileExt = fileName.substring(
                    fileName.lastIndexOf(".") + 1
                );

                if (!this.fileExts.includes(fileExt)) {
                    showToast("您选择的文件类型有误!");
                    this.resetIpt();
                    return;
                }
                this.fileObj = fileObj;

                const content = await this.resolveFile();
                this.$emit("change", content);
            } else {
                this.fileObj = null;
            }
        },
        // 解析文件
        resolveFile() {
            const { fileObj, fileType } = this;

            return getFileContent(fileObj).then((data) => {
                switch (fileType) {
                    case "json":
                        return {
                            fileObj,
                            dataList: data,
                        };
                    case "excel": {
                        // 内部处理：统一将值转换成字符串格式，并去掉首尾空格
                        data.forEach((e) => {
                            if (typeof e == "object") {
                                for (const attr in e) {
                                    e[attr] = !e[attr]
                                        ? ""
                                        : (e[attr] + "").trim();
                                }
                            }
                        });

                        // 外部处理：添加指定的键名
                        const dataList = this.dataHandler
                            ? this.dataHandler(data)
                            : data;

                        // 错误处理
                        let errorList = this.errorHandler
                            ? this.errorHandler(dataList)
                            : []; // 生成
                        errorList = [...new Set(errorList)]; // 去重

                        if (errorList.length) {
                            // 弹框
                            showToast(
                                "第 " + errorList.join(" , ") + " 条数据有误 !"
                            );

                            // 重置
                            this.resetIpt();
                        }

                        return {
                            fileObj,
                            dataList,
                            errorList,
                        };
                    }
                    default:
                        return {
                            fileObj,
                        };
                }
            });
        },
        // 重置输入框
        resetIpt() {
            this.fileObj = null;
            this.$refs.upload.value = "";
        },
    },
};
</script>

<style src="./ChooseFile.less" lang="less" scoped></style>

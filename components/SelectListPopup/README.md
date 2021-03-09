<!--
 * @Author: huxudong
 * @Date: 2021-03-01 09:05:49
 * @LastEditTime: 2021-03-03 12:21:10
 * @Description: SelectListPopup组件说明文档
-->
## 功能
  + 打开一个弹窗
  + 列表数据懒加载
  + 支持勾选和回显

## 属性
  + isVisible：弹窗的显隐状态，格式是Boolean，支持.sync修饰符
  + title：弹窗的标题，格式是String
  + data：列表的数据，格式是Array，每个数组元素是一个JSON对象
  + total：列表的总长度，格式是Number
  + selectedData：需要回显的被选中数据，格式同data
  + columns：列配置，格式是Array，每个数组元素是一个JSON对象，属性如下
    - minWidth：列宽度，格式是String
    - label：列标题，格式是String
    - prop：列字段，格式是String，默认基于prop生成当前列的展示值
    - getValue：一个Function，用于生成当前列的展示值
      - 如果提供此属性，就不会基于prop生成当前列的展示值，而是取函数的返回值
      - 函数的参数是当前行的数据，也就是data的某个元素
  + idKey：每条数据的唯一标识对应的字段名，格式是String，默认是id
  + nameKey：每条数据的名称对应的字段名，格式是String，默认是name

## 事件
  + loadInit：打开弹窗，加载初始数据
  + loadMore：向下滚动，加载更多数据
  + search：点击搜索按钮，参数的值是搜索的关键字
  + cancel：点击取消按钮
  + confirm：点击确认按钮，参数的值是选择的列表数据，格式同data

## 例子
    ```
    <template>
        <el-button type="primary" @click="onShow">{{title}}</el-button>
        <SelectListPopup :is-visible.sync="isVisible" :title="title"
            :data="userList" :total="total" :selected-data="selectedUserList" 
            :columns="columns" :id-key="idKey" :name-key="nameKey"
            @loadInit="onLoadInit" @loadMore="onLoadMore" @search="onSearch" @cancel="onCancel" @confirm="onConfirm"
        />
    </template>

    <script>
    import { SelectListPopup } from "sinosun-operation-ui";
    import MyApi from "service/MyApi";

    export default {
        components: {
            SelectListPopup
        },
        data() {
            return {
                isVisible: false,
                title: "选择人员",
                userList: [],
                total: 0,
                selectedUserList: [],
                columns: [
                    {
                        minWidth: "120",
                        label: "用户",
                        prop: "userName"
                    },
                    {
                        minWidth: "120",
                        label: "所属部门",
                        getValue(row) {
                            return row.deptInfo.deptName;
                        }
                    },
                    {
                        minWidth: "120",
                        label: "所属岗位",
                        getValue(row) {
                            return row.roleList.map((e) => e.roleName).join("，");
                        }
                    }
                ],
                idKey: "bizMateId",
                nameKey: "userName",
                searchName: "",
                pageIndex: 1,
                pageSize: 10
            };
        },
        methods: {
            onShow() {
                this.isVisible = true;
            },
            onLoadInit() {
                this.pageIndex = 1;
                this.getUserList().then((res) => {
                    if (res.isSuccess()) {
                        const { total, userList } = res.result;
                        this.total = total;
                        this.userList = userList;
                    }                  
                });
            },
            onLoadMore() {
                this.pageIndex++;
                this.getUserList().then((res) => {
                    if (res.isSuccess()) {
                        const { userList } = res.result;
                        this.userList = this.userList.concat(userList);
                    }             
                });
            },
            getUserList() {
                const { searchName, pageIndex, pageSize } = this;
                return MyApi.getUserList(
                    searchName,
                    pageIndex,
                    pageSize
                );
            },
            onSearch(value) {
                this.searchName = value;
                this.onLoadInit();
            },
            onCancel() {
                this.searchName = "";
                this.pageIndex = 1;
                this.userList = [];
            },
            onConfirm(userList) {
                this.selectedUserList = userList;
                this.isVisible = false;
                this.onCancel();
            }
        }
    };
    </script>
    ```
    
<!--
 * @Author: huxudong
 * @Date: 2021-02-10 10:33:00
 * @LastEditTime: 2021-03-05 09:32:24
 * @Description: 布局组件
-->
<template>
    <div class="layout">
        <!-- 顶部导航 -->
        <div class="top-nav">
            <span class="text">当前位置：</span>
            <div class="nav-item" v-for="(navItem,navIndex) in topNav" :key="navIndex">
                <span class="name" @click="changeTopNav(navItem,navIndex)">{{getRouteText(navItem)}}</span>
                <span class="sep" v-if="!isTopActive(navIndex)">/</span>
            </div>
        </div>
        <!-- 内容区域 -->
        <div class="content-wrapper" v-if="isContent">
            <router-view />      
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
    name: "Layout",
    data() {
        return {
            isContent: true, // 是否显示内容区域
        };
    },
    computed: {
        // 系统参数
        ...mapState(["systemParam"]),
        // 顶部导航
        topNav() {
            // 获取菜单路由
            const { menuList, currentMenuId } = this.systemParam;
            const menuRoutes = [];
            if (menuList && currentMenuId) {
                for (const menuItem of menuList) {
                    const { menuId, childrenMenuList } = menuItem;
                    if (menuId == currentMenuId) {
                        menuRoutes.push(menuItem);
                        break;
                    } else if (childrenMenuList && childrenMenuList.length) {
                        const subMenuItem = childrenMenuList.find(
                            (e) => e.menuId == currentMenuId
                        );
                        if (subMenuItem) {
                            menuRoutes.push(menuItem, subMenuItem);
                            break;
                        }
                    }
                }
            }

            // 获取页面路由
            const pageRoutes = this.$route.matched.filter(
                (e) => e.meta && e.meta.text
            );

            return [...menuRoutes, ...pageRoutes];
        },
    },
    watch: {
        // 监听路由的跳转
        $route(to, from) {
            // 将当前页面中的路由变化，同步到父级菜单中
            const { currentMenuURL } = this.systemParam;
            if (currentMenuURL) {
                const idx = currentMenuURL.indexOf("#");
                let newMenuURL = "";
                if (idx == -1) {
                    newMenuURL = currentMenuURL + "#" + to.fullPath;
                } else {
                    newMenuURL =
                        currentMenuURL.substring(0, idx + 1) + to.fullPath;
                }
                this.changeSystemParam({
                    currentMenuURL: newMenuURL,
                });
            }

            // 如果跳转前后的路由相同，需要刷新内容区域
            if (to.path == from.path) {
                this.isContent = false;
                setTimeout(() => {
                    this.isContent = true;
                }, 100);
            }
        },
    },
    methods: {
        // 修改系统参数
        ...mapMutations(["changeSystemParam"]),
        // 获取路由的跳转对象
        getRouteTarget(route) {
            const name = this.getRouteName(route);
            const path = route.path;
            const query = {
                // 添加一个时间戳，确保当名称相同的时候，也能发生跳转
                ts: +new Date(),
            };

            // 优先使用name跳转
            if (name) {
                return {
                    name,
                    query,
                };
            }
            // 否则使用path跳转
            else {
                return {
                    path,
                    query,
                };
            }
        },
        // 获取路由的名称
        getRouteName(route) {
            // 针对菜单路由
            if (route.menuId) {
                return route.name;
            }
            // 针对页面路由
            else {
                if (route.name) {
                    return route.name;
                } else {
                    return route.meta && route.meta.childName;
                }
            }
        },
        // 获取路由的文本
        getRouteText(route) {
            // 针对菜单路由
            if (route.menuId) {
                return route.name;
            }
            // 针对页面路由
            else {
                return route.meta && route.meta.text;
            }
        },
        // 点击顶部导航
        changeTopNav(route, index) {
            // 针对菜单路由
            if (route.menuId) {
                let currentMenuURL = route.url;
                if (route.childrenMenuList && route.childrenMenuList.length) {
                    currentMenuURL = this.topNav[index + 1].url;
                }
                const idx = currentMenuURL.indexOf("#");
                if (idx == -1) {
                    this.$router.push(
                        this.getRouteTarget({
                            path: "/",
                        })
                    );
                } else {
                    this.$router.push(
                        this.getRouteTarget({
                            path: currentMenuURL.substring(idx + 1),
                        })
                    );
                }
            }
            // 针对页面路由
            else if (!this.isTopActive(index)) {
                this.$router.push(this.getRouteTarget(route));
            }
        },
        // 顶部导航是否高亮
        isTopActive(index) {
            return index == this.topNav.length - 1;
        },
    },
};
</script>

<style lang="less">
</style>
<style src="./Layout.less" lang="less" scoped></style>


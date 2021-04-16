<!--
 * @Author: huxudong
 * @Date: 2021-02-10 10:33:00
 * @LastEditTime: 2021-04-09 14:10:19
 * @Description: 布局组件
-->
<template>
    <div class="layout">
        <!-- 顶部导航 -->
        <div class="top-nav">
            <div class="nav-item" v-for="(navItem,navIndex) in topNav" :key="navIndex">
                <span :class="['name',{clickable: isClickable(navItem,navIndex)}]" @click="changeTopNav(navItem,navIndex)">{{getRouteText(navItem)}}</span>
                <span class="sep" v-if="navIndex != topNav.length-1">></span>
            </div>
        </div>
        <!-- 内容区域 -->
        <div class="view-wrapper" v-if="isContent">
            <router-view />      
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "Layout",
    data() {
        return {
            isContent: true, // 是否显示内容区域
            topNav: [], // 顶部导航
        };
    },
    computed: mapState(["menuState"]), // 菜单状态
    watch: {
        // 监听路由的跳转
        $route(to, from) {
            this.generateTopNav();

            // 如果跳转前后的路由相同，需要刷新内容区域
            if (to.path == from.path) {
                this.isContent = false;
                setTimeout(() => {
                    this.isContent = true;
                }, 100);
            }
        },
    },
    created() {
        this.generateTopNav();
    },
    methods: {
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
        // 生成顶部导航
        generateTopNav() {
            const {
                menuList,
                currentMenuId,
                currentMenuURL,
            } = this.menuState.get();

            // 获取菜单路由
            const menuRoutes = [];
            if (top["CommonApi"] && menuList && currentMenuId) {
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
            const pageRoutes = this.$route.matched.filter((e) => {
                if (e.meta && e.meta.text) {
                    if (!menuRoutes.length) {
                        return true;
                    } else {
                        let newMenuURL;
                        const idx = currentMenuURL.indexOf("#");
                        if (idx == -1) {
                            newMenuURL = currentMenuURL + "#" + e.path;
                        } else {
                            newMenuURL =
                                currentMenuURL.substring(0, idx + 1) + e.path;
                        }
                        return !menuRoutes.find((e) => e.url == newMenuURL);
                    }
                } else {
                    return false;
                }
            });

            this.topNav = [...menuRoutes, ...pageRoutes];
        },
        // 点击顶部导航
        changeTopNav(route, index) {
            if (!this.isClickable(route, index)) return;

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
            else {
                this.$router.push(this.getRouteTarget(route));
            }
        },
        // 是否可以点击跳转
        isClickable(route, index) {
            // 首个导航
            if (index == 0) {
                if (route.childrenMenuList && route.childrenMenuList.length) {
                    return false;
                } else {
                    return true;
                }
            }
            // 末尾导航
            else if (index == this.topNav.length - 1) {
                return false;
            }
            // 其他导航
            else {
                return true;
            }
        },
    },
};
</script>

<style src="./Layout.less" lang="less"></style>


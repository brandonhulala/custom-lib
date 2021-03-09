<!--
 * @Author: huxudong
 * @Date: 2021-03-01 09:05:49
 * @LastEditTime: 2021-03-01 10:16:38
 * @Description: Layout组件说明文档
-->
## 功能
  + 针对运营平台的子页面，也就是点击每个侧边菜单打开的页面
  + 在页面的顶部显示面包屑导航，导航的下面显示对应的内容
  + 当页面的路由发生改变，导航也会跟着变
  + 点击导航，可以跳转到指定的路由

## 引入
  + 打开页面的根组件，例如/src/pages/mypage/mypage.vue
  + 引入Layout组件，然后替换template中的```<router-view />```
  + 例子
    ```
    <template>
        <Layout />
    </template>

    <script>
    import { Layout } from "sinosun-operation-ui";
    export default {
        components: {
            Layout
        }
    };
    </script>
    ```
    
## 配置
  + 打开页面的路由配置文件，例如/src/pages/myPage/router/index.js
  + 在配置页面的路由时，需要遵循一定的规范
    - 除了重定向路由以外，每个路由至少包含path、component、meta属性
    - meta中必须要有一个text属性，表示路由的中文名称，用于显示在页面的顶部导航名
    - 如果一个路由没有子路由，必须设置name属性，表示路由的英文名称，用于路由跳转
    - 如果一个路由包含子路由，不要设置name属性，而要在meta中设置一个childName属性，表示默认子路由的name
  + 例子
    ```
    import { Route1,Route2,Route3,Route3List,Route3Detail } from "routeConfig";

    const routes = [
        {
            path: '/',
            redirect: '/route1'
        },
        {
            path: '/route1',
            component: Route1,
            name: 'route1',
            meta: {
                text: '路由1'
            }
        },
        {
            path: '/route2',
            component: Route2,
            name: 'route2',
            meta: {
                text: '路由2'
            }
        },
        {
            path: '/route3',
            component: Route3,
            meta: {
                childName: 'route3-list',
                text: '路由3', // 如果将text改成“路由3-列表”，那么对应子路由的text就要为空
            },
            children: [
                {
                    path: '',
                    redirect: 'list'
                },
                {
                    path: 'list',
                    component: Route3List,
                    name: 'route3-list',
                    meta: {
                        text: '路由3-列表'
                    }
                },
                {
                    path: 'detail',
                    component: Route3Detail,
                    name: 'route3-detail',
                    meta: {
                        text: '路由3-详情'
                    }
                }
            ]
        }
    ]
    ```  

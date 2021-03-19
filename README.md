<!--
 * @Author: huxudong
 * @Date: 2020-12-09 18:38:06
 * @LastEditTime: 2021-03-19 17:12:49
 * @Description: 使用说明
-->
## 项目结构
``` 
 |--lib                       # 公共方法
    |--NetApi                   # 网络请求
    |--utils                    # 工具库  
 |--components                # 公共组件
 |--assets                    # 静态资源
 |--index.js                  # 入口文件
 |--packge.json               # 项目配置文件
 |--node_modules              # 第三方依赖
 |--.gitignore                # git忽略的文件列表
 |--postcss.config.js         # postcsss配置文件
```

## 本地调试
  + 修改全局npm配置
    - 方法一：输入命令
      ```
      npm config set registry http://10.0.5.26:8081/repository/sinosun-front-npm-group/
      ```
    - 方法二：修改配置文件，位置在C:\Users\用户名\\.npmrc
      ```
      registry=http://10.0.5.26:8081/repository/sinosun-front-npm-group/
      ```
  + 安装第三方依赖
    ```
    npm install
    ```
  + 将整个组件包注入到全局
    ```
    npm link
    ```
  + 在指定的前端项目中，引入全局的组件包
    ```
    npm link sinosun-operation-ui
    ```

## 发布
  + 修改全局npm配置，添加访问私仓的身份令牌，避免每次发布都要登录
    ```
    always-auth=true
    _auth="c2lub3N1bi1mcm9udC1ucG0tdXNlcjpzaW5vc3VuLWZyb250="
    ```
  + 如果不是首次发布，需要修改组件包的版本号
    - 方法一：直接修改package.json中的version字段
    - 方法二：输入命令，小版本号自动加一
      ```
      npm version patch
      ```
  + 将组件包发布到私仓
    ```
    npm publish
    ```
  + 查看私仓中的组件包
    - 地址：http://10.0.5.26:8081/#browse/browse:sinosun-front-npm-hosted
    - 用户名：sinosun-front-npm-user
    - 密码：sinosun-front
  + 在指定的前端项目中，引入私仓中的组件包
    ```
    npm install sinosun-operation-ui --save
    ```

## 注意事项
  + 使用npm link进行调试时，需要将babel.config.js文件中的@babel/preset-env的modules选项，改成umd
  + 使用npm link进行调试时，部分第三方组件库会出现问题，此时需要将这些组件的引入代码转移到调试项目中

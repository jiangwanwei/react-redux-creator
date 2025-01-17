

# react-redux-creator

集成了react-router, react-redux, redux, redux-actions, redux-saga, seamless-immutable, connected-react-router, 简化了redux/异步处理和路由集成的配置工作，开箱即用



> 使用redux常常需要创建大量的常量字面量，手动创建actions, 以及相应的reducers进行数据处理，并且redux跟路由配置对新手的的复杂难懂的初始化工作。
>
> <font color="#f30">react-redux-creator</font>简化redux的使用流程，降低集成的难度，对于redux的创建，只提供了一个API即buildRedux完成并集成了异步数据请求。提供了Provider组件直接集成react-router。




* buildRedux提供了创建reducer以及redux-saga的异步处理
* Provider集成了create store以及react-router
* connect方法简化了bindActionsCreator的使用
* 自动合并sagas与reducers
* fetch自定义




### 安装

```terminal
yarn install react-redux-creator
# or
# npm install react-redux-creator
```



### API

仅4个API
- <a href="#config">config</a>
- <a href="#provider">Provider</a>
- <a href="#connect">connect</a>
- <a href="#buildRedux">buildRedux</a>



---


**<a name="config"></a>config(options)** 
  初始化方法

| options     | type                                                         | description                                                  |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| fetchMethod | (config) => Promise<any><br />config: {<br />    url: string, <br />    method: string, // optional, default "GET"<br />    data: object,  // optional <br />    headers: object, // optional<br />} | 全局fetch方法, <br />通常应用的请求有公共的处理方式，<br />比如针对400等错误的处理，此处定义通用的网络请求fetch方法 |
| logger      | boolean                                                      | 默认"true", 是否开启redux-logger                             |
| history     | 'browser', 'hash', 'memory'                                  | 路由方式，详细见[history](https://github.com/ReactTraining/history) |
| autoActions | boolean                                                      | 默认"true", 自动执行success, reset方法                       |

  <i>example:</i>

```javascript
import { config } from 'react-redux-creator'
import fetch from './utils/fetch'

config({
  fetchMethod: fetch, // 全局配置fetch
  history: 'browser', // 默认
  logger: true, // 开启redux-logger
  autoActions: true, // 是否开启saga自动success和错误的reset
})
```



---



<a name="provider"></a>**Provider 组件**
  集成路由

| props     | type                                     | description    |
| --------- | ---------------------------------------- | ----------- |
| routes    | React.Component \| () => React.Component | 路由配置    |
| initState | object(optional)                         | 初始化state |

<i>

example:</i>

```javascript
function appRender() {
  const containerElement = document.getElementById('app')
  ReactDOM.render(
    <Provider routes={routes} />, {/* 配置路由 */}
    containerElement,
  )
}
```



---

**<a name="connect"></a>connect(mapStateToProps, mapActionsToProps)(component)**
  主要是简化了mapActionsToProps, 自动合并了bindActionCreators的处理

| argumens          | types             | description                  |
| ----------------- | ----------------- | ---------------------------- |
| mapStateToProps   | (state) => object | 同react-redux方法            |
| mapActionsToProps | object            | 自动合并了bindActionCreators |
| component         | React.Component   | 同react-redux方法            |



---



**<a name="buildRedux"></a>buildRedux(actionName, initState)(config)**
  创建redux, 合并reducer以及saga

| arguments  | child    | type                                                   | required | description                                                  |
| ---------- | -------- | ------------------------------------------------------ | -------- | ------------------------------------------------------------ |
| actionName | -        | string                                                 | Y        | redux的action字面量以及存储在state的数据key                  |
| initState  |          | object                                                 | N        | 初始化数据, 默认(挂载到state中)包括<br />{<br />    loading: false,<br />    error: false,<br />    success: false,<br />    params: null,<br />    data: null,<br />} |
| config     |          |                                                        |          | saga异步请求                                                 |
|            | url      | string \| function*(payload, callbackConfig) => string | N        | <font color=#f30>callbackConfig</font> 见下表                |
|            | method   | string                                                 | N        | POST, GET, PUT, DELETE...                                    |
|            | data     | object \| function*(payload, callbackConfig) => object | N        | GET自动转为url search,<br />其他方式则为放body的数据         |
|            | headers  |                                                        | N        |                                                              |
|            | onResult | function*(data, payload, callbackConfig) => object     | N        | 当fetch请求完(如果有url，<br />fetch后，否则直接到该方法)，<br />数据处理后返回给saga，<br /><b>自动调用redux success方法</b>，<br />回传到reducer 并最终合并到<br />state下。如果方法没有数据，<br />则默认使用原始的data。 <br /><font color=blue>callbackConfig</font> 见下表 |
|            | onAfter  | function*(data, payload, callbackConfig) => object     | N        | onResult完成以后执行，<br />在这里可以继续执行其他<br />的异步方法或者发起其他action,<br /><font color=blue>callbackConfig</font> 见下表 |
|            | onError  | function*(err, payload, callbackConfig) => any         | N        | 错误异常处理，<br /><b>自动调用redux的reset方法</b><br />也可以在这里手动执行error方法<br /><font color=blue>callbackConfig</font> 见下表 |

<font color=#f30>url</font>, <font color=#f30>data</font>, <font color=#f30>onResult</font>, <font color=#f30>onAfetr</font>, <font color=#f30>onError</font> 都可接受function或者generator function, 如果有异步处理，请使用function* 配合yield使用

* <font color=blue>callbackConfig</font>

  | param     | type                   | description                                            |
  | --------- | ---------------------- | ------------------------------------------------------ |
  | put       | function               | redux-saga的effect, 发起dispatch                       |
  | call      | function               | redux-saga的effect, 发起异步处理                       |
  | getAction | (actionName) => Action | 通过actionName获取action(start, success, error, reset) |
  | getState  | (actionName) => State  | 通过actionName获取state节点数据                        |

  



---



### 使用  [完整示例](https://github.com/joyerz/react-redux-creator/tree/examples) 

**index.jsx（entry）**

```javascript
import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, config } from 'react-redux-creator'
import fetch from './utils/fetch'
import routes from './routes'

// 初始化react-redux-creator
config({
  fetchMethod: fetch, // 全局定义fetch请求方法
  logger: true, // 是否开启redux-logger
  history: 'browser', // 路由的history
})

（function appRender() {
  const containerElement = document.getElementById('app')
  ReactDOM.render(
    <Provider routes={routes} />, {/* 配置路由 */}
    containerElement,
  )
})()


```



---

**routes（src/routes/index.jsx）**



```javascript
import * as React from 'react'

import { Route, Switch } from 'react-router' 
import Home from '../pages/home'

const routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>
  )
}
export default routes
```



---



**redux (src/pages/home/redux.js)**



```javascript
import { buildRedux } from 'react-redux-creator'
import { obj2params } from '../utils/objectHelper'

export const companyAddRedux = buildRedux('companyAdd')({
  onResult: (data, payload, config) => ({buildRedux})
})

export const companyListRedux = buildRedux('companyList' )({
  url: function*(payload, config){
    const { page, limit } = payload
    const { getState } = config
    let state = yield getState('companyList') // e.g. { name: 1, ... }
    params = obj2params(state.params)

    // 返回请求 '/api/company?page=1&page-size=10&name=1'
    return `/api/company?page=${page}&page-size=${limit}&${params}` 
  }
  onResult: function*(data, payload, config) {
   	return {
      ...data,
      extract: 'extractData'
    }
  	// 对网络请求后的数据进行添加额外extract属性
  },
  onAfter: function* (data, payload, config) {
    const { getActio } = config
		// 发起其他的action
    yield effects.put(getAction('companyAdd').start()) 
  },
  onError: (err) => console.log('Error', err)
})

// 备注：url, data, onResult, onAfetr, onError 都可接受function或者generator function, 如果有异步处理，请使用function* 配合yield使用

```



---



**container (/src/pages/home/index.jsx)**



```javascript
import React from 'react'
import { connect } from 'react-redux-creator'
import { companyAddRedux, companyListRedux } from './redux'

class Home extends React.Component {
  componentDidMount() {
    this.props.actionList()
  }

  render() {
    return <div>Hello</div>
  }
}


export default connect(
  state => {
    return {
      ...state,
    }
  },
  {
    actionList: (page, limit, params) => companyListRedux.start(),
    actionAdd: (params) => companyAddRedux.start(params),
  },
)(Home)
```




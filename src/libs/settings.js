// 初始化配置

export let options = {
  logger: true, // redux-logger
  fetchMethod: null, // fetch请求
  history: 'browser', // browser, hash, memory
  autoActions: true
}

export default function config(opts) {
  options = {
    ...options,
    ...opts
  }
}


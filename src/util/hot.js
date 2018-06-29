if (process.env.NODE_ENV === 'development' && process.env.WEBPACK_HOTRELOAD === 'hot') {
  if (module.hot) module.hot.accept()

  const HMRCallback = status => {
    if (status === 'check') console.log('%c%s', 'color: deepskyblue', '**** 热更新开始 ****')
    else if (status === 'apply') {
      console.log('%c%s', 'color: deepskyblue', '**** 热更新结束 ****\n**** 下面是更新后的输出 ****')
    } else if (status === 'fail') {
      console.log('%c%s', 'color: red', '**** 热更新失败 ****')
    }
  }

  module.hot.addStatusHandler(HMRCallback)
}

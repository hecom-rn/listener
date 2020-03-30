# listener

[![npm version](https://img.shields.io/npm/v/@hecom/listener.svg?style=flat)](https://www.npmjs.com/package/@hecom/listener)
[![Build Status](https://travis-ci.org/hecom-rn/listener.svg?branch=master)](https://travis-ci.org/hecom-rn/listener)

通用消息机制处理库，扩展了各个平台实现的消息机制，将常用的字符串类型`eventName`扩展为字符串数组，并且支持SubEvent。

**接口**

`init`: 设置平台相关的消息实现;

`register`: 注册消息;

`registerWithSubEvent`: 注册子事件消息，例如：当trigger一个Type为`['a','b','c']`的消息时，注册Type为`['a','b']`或者`['a']`的事件可以收到回调。

`unregister`: 取消注册消息，或者可通过Subscription.remove方法直接取消注册。



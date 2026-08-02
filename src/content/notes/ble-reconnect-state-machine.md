---
title: "BLE 断线重连：先把连接流程建模成状态机"
summary: "当扫描、连接和超时回调互相穿插时，用显式状态转换避免旧请求污染新连接。"
publishedAt: 2026-07-30
tags: ["BLE", "State Machine"]
listingTags: ["前端", "TypeScript"]
featured: true
priority: 20
draft: false
readingMinutes: 4
relatedProjects: []
---

## 问题

BLE 连接通常包含扫描、连接、服务发现和订阅通知。断线重连后，上一轮操作的超时回调可能晚于新连接返回，导致界面重新进入错误状态。

## 原因

如果代码使用 `isScanning`、`isConnecting`、`isReady` 等多个布尔值表达流程，就很容易产生互相矛盾的组合。问题不是缺少一次条件判断，而是连接生命周期没有唯一状态来源。

## 解法

把连接过程收敛为有限状态，并为每次连接生成递增的 `sessionId`。异步回调在修改状态前必须确认自己仍属于当前会话。

```ts
type ConnectionState =
  | { type: 'idle' }
  | { type: 'scanning'; sessionId: number }
  | { type: 'connecting'; sessionId: number; deviceId: string }
  | { type: 'ready'; sessionId: number; deviceId: string }
  | { type: 'failed'; sessionId: number; reason: string };
```

这样，旧会话的超时和断开回调会因为 `sessionId` 不匹配而被丢弃。

## 边界与取舍

状态机不能消除底层 BLE 栈的不稳定性，但它能让应用层行为变得可推理。需要同时处理系统蓝牙关闭、权限变化和设备主动断开等外部事件。

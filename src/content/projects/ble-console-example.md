---
title: "BLE 设备控制台"
summary: "一个用于发现、连接并调试低功耗蓝牙设备的桌面控制台。"
cover: "/images/projects/ble-console/cover.webp"
publishedAt: 2026-07-24
tags: ["BLE", "TypeScript", "State Machine"]
featured: true
priority: 30
draft: false
type: "personal"
status: "completed"
role: "独立设计与实现"
year: 2026
authors:
  - name: "JaneNSea"
    role: "独立作者"
    avatar: "/avatar.jpg"
---

## 背景与目标

将设备扫描、连接、服务发现和指令调试集中到一个界面，降低开发阶段反复切换工具的成本。

## 实现与架构

连接状态由显式状态机管理，界面通过领域事件更新，设备协议解析与 UI 保持分离。

## 难点与决策

BLE 回调存在异步竞态。项目不直接用多个布尔值描述连接状态，而是把合法状态转换收敛到统一模型。

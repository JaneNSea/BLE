---
title: "HLK-LD2410B 雷达使用指南与注意事项"
summary: "从 GPIO 快速接入到 UART 参数调优，说明 24GHz 人体存在雷达为什么能识别静止目标，以及接线、去抖与安装时最容易忽略的边界。"
publishedAt: 2025-12-01
publishedLabel: "2025 年 12 月"
tags: ["HLK-LD2410B", "STM32", "Embedded C", "IoT", "Sensor"]
listingTags: ["嵌入式", "C"]
cover: "/images/notes/note-detail-visuals.jpg"
coverPosition: "78% 24%"
featured: false
priority: 0
draft: false
readingMinutes: 7
relatedProjects: ["solar-floor-heating-control-system"]
---

## 先决定：只要“有人”，还是需要距离数据？

LD2410B 同时提供 OUT 和 UART 两种输出。OUT 只有高低电平，适合把“有人/无人”快速接入控制逻辑；UART 会给出目标状态、距离和能量等信息，适合调参、分区判断和异常分析。

这也是它与普通 PIR 的关键区别：毫米波雷达不仅能感知明显移动，也能利用细微运动判断静止人体是否仍在场。代价是它更容易受到风扇、摆动物体和安装环境反射的影响，因此不能把“灵敏度拉满”当成调试方法。

## 接线：按信号名，不要按观看方向数引脚

不同转接板、焊接方向会让“第一个脚”看起来相反。接线时以模块丝印和手册中的信号名为准。

| LD2410B 信号 | 建议连接 | 说明 |
|---|---|---|
| VCC | 5V 电源 | 输入能力建议大于 200mA，不要用信号 IO 供电 |
| GND | STM32 GND | 雷达与 MCU 必须共地 |
| OUT | 任意 3.3V GPIO，例如 PA0 | 有人时输出高电平，无人时输出低电平 |
| UART_TX | MCU UART_RX | 只有需要读取协议数据时连接 |
| UART_RX | MCU UART_TX | 只有需要写入配置时连接 |

模块使用 5V 供电，但 OUT 输出电平为 3.3V。UART 默认参数为 **256000、8N1**；这个波特率较高，STM32 时钟配置不准确时会表现为偶发乱码，而不是完全没有数据。

## GPIO 模式：最小接入也要有状态稳定层

不要让一次采样直接开关水泵或风扇。最小实现可以对电平变化做时间确认，并把控制逻辑与 GPIO 驱动分开：

```c
typedef struct {
    bool stable;
    bool candidate;
    uint32_t changed_at;
} PresenceFilter;

bool Presence_Update(PresenceFilter *filter, bool raw, uint32_t now_ms)
{
    if (raw != filter->candidate) {
        filter->candidate = raw;
        filter->changed_at = now_ms;
    }

    if (filter->candidate != filter->stable &&
        now_ms - filter->changed_at >= 100U) {
        filter->stable = filter->candidate;
    }
    return filter->stable;
}
```

100ms 确认用于过滤边缘抖动；“人员离开后继续保持多久”更适合使用雷达的无人延时参数。两边都设置很长延迟，会让系统看起来反应迟钝。

## UART 模式：什么时候值得使用？

如果只需要房间是否有人，OUT 已经足够。出现以下需求时再接 UART：

- 需要区分运动目标与静止目标。
- 需要观察各距离门的能量，定位误报来源。
- 需要修改最远检测距离、分距离门灵敏度和无人延时。
- 需要记录原始状态，分析“为什么这次没有关机”。

接收侧优先使用 DMA 或空闲中断组织连续数据流，不要假设一次串口中断刚好等于一个完整帧。解析器应先找帧头、校验长度，再提交完整状态。

## 安装和调参顺序

1. 先用默认参数验证 OUT 和 UART 都能稳定输出。
2. 固定最终安装位置，再进入工程模式观察各距离门能量。
3. 先限制无效的最远距离，再逐门调整灵敏度。
4. 分别测试人员进入、久坐不动、离开和房间内风扇运行。
5. 最后再把存在状态接入供热或执行器策略。

雷达前方应避免大面积金属遮挡；风扇、窗帘、振动物体和墙后运动都可能形成非预期回波。调参的目标不是“任何位置都报有人”，而是让目标区域稳定、非目标区域安静。

## 快速排错

- **OUT 永远为高**：先缩短检测距离，逐门降低灵敏度，并排查运动物体。
- **有人静坐时变为无人**：检查静止目标距离门能量，适当提高对应门灵敏度或无人延时。
- **UART 全是乱码**：确认 256000 8N1、共地、TX/RX 交叉和 MCU 实际时钟。
- **控制动作来回切换**：不要直接驱动执行器；加入状态确认、最短运行时间和安全仲裁。

## 参考资料

- [HLK-LD2410B User Manual V1.04](https://forum.iobroker.net/assets/uploads/files/1690281043649-hlk-ld2410b-human-presence-sensing-module-manual-v1.04.pdf)

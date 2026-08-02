---
title: "太阳能地暖智能温控系统"
summary: "以人体存在感知与云端机器学习为核心，验证太阳能地暖从环境采集、策略生成到安全执行的云边协同控制闭环。"
cover: "/images/projects/solar-floor-heating-control-system/cover.webp"
publishedAt: 2026-08-02
updatedAt: 2026-08-02
tags: ["STM32", "Embedded C", "IoT", "OneNET", "MQTT", "Python", "Machine Learning", "Edge Computing"]
featured: true
priority: 60
draft: false
type: "personal"
status: "completed"
role: "独立设计与实现"
year: 2026
period: "2026 年"
authors:
  - name: "JaneNSea"
    role: "独立作者 · 嵌入式与云端系统设计"
    avatar: "/avatar.jpg"
repositories:
  - label: "STM32 嵌入式端仓库"
    stack: "STM32 · C · ESP8266 · OneNET"
---

## 项目背景：让太阳能地暖按真实需求供热

太阳能地暖把可再生热源带进室内，但系统也面临一个典型的控制难题：太阳辐照随天气变化，储热水箱与地板又具有明显热惯性。如果仍按固定时间或单一温度阈值启停，系统可能在无人房间持续供热，也可能在环境已经接近舒适区时继续释放有限的储热，造成能量错配和体感波动。

本项目以“**先判断是否需要供热，再决定如何安全执行**”为设计主线，将温湿度、人体存在状态与历史趋势纳入同一条云边控制链路。STM32 负责可靠采集、设备状态管理和执行器控制，OneNET 承担设备数据通道，云端 Python 服务完成数据清洗、特征构建与机器学习推理；最终控制建议还需要经过本地规则与安全边界约束，才会作用于水泵、阀门等地暖末端。

### 当前完成边界

当前学习原型已经打通温湿度与人体存在感知、OLED 本地显示、ESP8266 联网、OneNET 遥测与下行、云端特征处理、策略推理以及执行器接口联动。它验证的是一套可运行、可降级、可追溯的智能空间控制方法，而不是已经完成认证的商用地暖控制器。

面向太阳能地暖的下一阶段，可以继续接入集热器温度、供回水温度、储热水箱温度、天气预测、分区阀门与循环泵状态。届时，系统不仅能回答“房间是否需要供热”，还可以进一步优化“何时储热、向哪个区域供热、保留多少热量应对后续天气变化”。

### 学习重点

- 在资源受限、无 RTOS 的 STM32 环境中组织非阻塞协作式任务。
- 将温湿度与人体存在语义组合为比单阈值更有效的控制依据。
- 建立从设备遥测、云端推理到安全下行的完整 MQTT 闭环。
- 用本地安全规则守住模型输出边界，并为离线、超时和异常数据提供降级路径。
- 让设备状态、模型版本、控制原因和执行结果具备可观测与可追溯能力。

---

> 代码仓库范围：STM32 嵌入式端固件  
> 配套能力：OneNET 设备接入、云端数据处理、机器学习推理与控制策略服务  
> 核心技术栈：STM32、C、DHT11、HLK-LD2410B、OLED、ESP8266、MQTT、OneNET、Python、机器学习

> **代码示例说明**：本文中的 C 与 Python 片段用于公开解释系统的关键实现机制，对部分工程代码进行了抽象、裁剪和脱敏；云端专有模型参数、训练数据与生产部署代码不在公开仓库中。

---

## 1. 执行摘要

STC_SYSTEM 是一套面向室内环境调节场景的云边协同智能控制系统。系统不是把温湿度传感器、人体雷达和 Wi-Fi 模块简单拼接在一起，而是建立了一条完整、可运行、可扩展的闭环链路：

```text
环境与人员状态感知
        ↓
STM32 边缘数据采集与状态管理
        ↓
OLED 本地可视化 + ESP8266 网络接入
        ↓
OneNET 设备数据通道
        ↓
云端数据清洗、特征构建与机器学习推理
        ↓
控制策略生成与安全约束
        ↓
OneNET 下行命令
        ↓
STM32 指令解析与执行器控制
```

嵌入式端已经完成温度、湿度、人体存在状态的采集，本地 OLED 状态显示，ESP8266 联网，OneNET 遥测数据上报，下行控制消息接收与执行器接口联动。云端侧配套实现了面向环境调节场景的数据处理和机器学习决策链路，能够综合当前环境、人体存在状态、时间特征和历史趋势生成控制建议，再通过 OneNET 回传至设备端执行。

该系统的技术价值集中体现在三点：

1. **从“检测设备”升级为“控制闭环”**：设备不仅感知环境，还能接收决策并驱动风扇、水泵、LED、蜂鸣器等执行器。
2. **将人体存在语义纳入调节策略**：系统区分“环境需要调节”和“当前是否值得调节”，避免无人场景中的无效动作。
3. **将边缘实时性与云端算法能力解耦**：STM32 保证采集、显示和可靠执行，云端负责更复杂的特征处理、模型推理和策略迭代。

---

## 2. 当前系统成效

### 2.1 已形成端到端运行闭环

当前系统已经打通以下实际链路：

1. STM32 完成外设、串口、OLED、传感器和网络模块初始化。
2. DHT11 周期采集温度与湿度。
3. HLK-LD2410B 雷达输出人体存在状态。
4. OLED 同步显示环境数据、人员状态和连接状态。
5. ESP8266 通过 AT 指令接入无线网络。
6. OneNET 接收设备端上传的属性数据。
7. 云端服务消费设备数据并完成特征计算与策略推理。
8. OneNET 将控制结果下发至设备端。
9. STM32 解析控制字段并映射至本地执行器接口。

这一闭环意味着系统已经具备“感知—传输—分析—决策—执行”的完整物联网产品形态，而不是单点功能演示。

### 2.2 嵌入式端实现成果

嵌入式仓库覆盖了以下核心模块：

| 模块 | 主要职责 | 代码位置 |
|---|---|---|
| 应用主流程 | 系统初始化、周期调度、状态更新、上下行协调 | `USER/main.c` |
| Wi-Fi 接入 | ESP8266 复位、AT 指令交互、热点连接、数据收发 | `NET/ESP8266/esp8266.c` |
| OneNET 适配 | 云平台连接、设备属性上传、下行消息解析 | `NET/ONENET/onenet.c` |
| 温湿度采集 | DHT11 时序驱动与数据读取 | `HARDWARE/DHT11/dht11.c` |
| 人体存在检测 | 2410B GPIO 状态读取与 UART 扩展接口 | `HARDWARE/hlk-2410B/2410B.c` |
| 本地显示 | OLED 字符、数值和状态显示 | OLED 驱动目录 |
| 执行器控制 | 风扇、水泵、LED、蜂鸣器及清洁电机等接口 | 对应硬件驱动目录 |

### 2.3 云端算法实现成果

云端机器学习代码作为专有模块独立维护，不随嵌入式仓库开源。公开文档保留其技术架构、数据契约和扩展方式，避免暴露具体模型参数、训练数据和业务阈值。

云端链路承担以下工作：

- 接收 OneNET 转发的设备遥测数据。
- 对温度、湿度、人体存在和时间信息进行校验与标准化。
- 构造当前值、滑动窗口、变化率、占用时长等特征。
- 调用训练完成的模型生成风扇档位、辅助设备状态或目标温度建议。
- 使用安全规则对模型输出进行约束。
- 通过 OneNET 生成设备可执行的属性控制消息。
- 记录输入、模型版本、输出和执行反馈，形成可追溯的决策链。


---

## 3. 核心业务问题与解决方案

传统环境监控设备通常只解决“测量”问题：设备采集温度和湿度，然后在屏幕或平台上显示。STC_SYSTEM 进一步解决“何时需要调节、调节到什么程度、如何把决策可靠执行”的问题。

### 3.1 仅依据温度控制的局限

简单阈值控制通常采用如下逻辑：

```text
温度高于阈值 → 开启风扇
温度低于阈值 → 关闭风扇
```

该方案没有考虑房间是否有人、湿度是否影响体感、环境是否正在自然降温、执行器是否已经持续运行，以及用户在不同时段的舒适度偏好。

### 3.2 本项目的多源状态融合

STC_SYSTEM 将控制输入扩展为：

```text
当前温度
+ 当前湿度
+ 人体存在状态
+ 时间信息
+ 历史变化趋势
+ 当前执行器状态
+ 用户或场景目标
```

因此，同样是 29°C，系统可以产生不同决策：

- 房间无人：保持低能耗或关闭非必要设备。
- 房间有人且温度持续上升：提高风扇档位。
- 房间有人但湿度低、温度正在下降：保持当前状态，减少频繁切换。
- 夜间有人：采用噪声约束更强的控制策略。

### 3.3 云边职责分工

系统将职责分为两部分：

**边缘端负责确定性任务：**

- 可靠采集。
- 本地显示。
- 网络连接。
- 消息编解码。
- 参数校验。
- 执行器控制。
- 故障状态下的安全动作。

**云端负责计算密集和持续迭代任务：**

- 历史数据聚合。
- 特征工程。
- 模型训练与推理。
- 个性化策略。
- 模型版本管理。
- 多设备策略统一管理。

这种分工既避免了在 STM32 上运行复杂模型带来的资源压力，也避免了把所有控制能力完全依赖网络。

---

## 4. 系统总体架构

```text
flowchart LR
    subgraph Edge[嵌入式边缘端]
        DHT[DHT11 温湿度]
        Radar[HLK-LD2410B 人体雷达]
        MCU[STM32 状态管理与控制]
        OLED[OLED 本地界面]
        Actuator[风扇/水泵/LED/蜂鸣器]
        ESP[ESP8266 网络接入]
        DHT --> MCU
        Radar --> MCU
        MCU --> OLED
        MCU --> Actuator
        MCU <--> ESP
    end

    subgraph Platform[OneNET 设备平台]
        MQTT[MQTT/设备属性通道]
        Twin[设备状态与下行控制]
    end

    subgraph Cloud[私有云端智能服务]
        Ingest[数据接入与校验]
        Feature[特征计算]
        Model[机器学习推理]
        Guard[安全规则与策略融合]
        Store[历史数据与决策日志]
        Ingest --> Feature --> Model --> Guard
        Ingest --> Store
        Model --> Store
        Guard --> Store
    end

    ESP <--> MQTT
    MQTT --> Ingest
    Guard --> Twin
    Twin --> MQTT
```

### 4.1 架构设计原则

- **模块边界清晰**：传感器驱动、网络驱动、云平台协议和业务控制分别维护。
- **数据结构统一**：边缘上报和云端推理围绕同一设备状态模型组织。
- **控制命令可验证**：云端输出必须经过本地范围校验后才操作硬件。
- **本地功能不依赖云端可用性**：网络中断时，传感器和 OLED 仍可工作。
- **算法可替换**：云端推理通过稳定接口输出控制指令，模型内部实现可以持续迭代。

---

## 5. 端到端数据流

### 5.1 遥测上行流程

```text
sequenceDiagram
    participant DHT as DHT11
    participant RADAR as 2410B
    participant MCU as STM32
    participant OLED as OLED
    participant ESP as ESP8266
    participant ONENET as OneNET
    participant ML as 云端机器学习服务

    MCU->>DHT: 发起温湿度采样
    DHT-->>MCU: 返回温度/湿度
    MCU->>RADAR: 读取人体存在 GPIO
    RADAR-->>MCU: presence=0/1
    MCU->>MCU: 校验、状态合并、时间戳更新
    MCU->>OLED: 刷新本地状态
    MCU->>MCU: 构建设备属性 JSON
    MCU->>ESP: 发送 MQTT 数据帧
    ESP->>ONENET: 上传设备属性
    ONENET->>ML: 转发遥测数据
    ML->>ML: 特征构建与模型推理
```

### 5.2 控制下行流程

```text
sequenceDiagram
    participant ML as 云端机器学习服务
    participant ONENET as OneNET
    participant ESP as ESP8266
    participant MCU as STM32
    participant ACT as 执行器
    participant OLED as OLED

    ML->>ML: 输出动作并执行安全约束
    ML->>ONENET: 写入设备控制属性
    ONENET->>ESP: 下发 MQTT 消息
    ESP->>MCU: UART 转发下行载荷
    MCU->>MCU: 消息完整性与字段校验
    MCU->>MCU: 转换为内部控制命令
    MCU->>ACT: 执行风扇/水泵/LED动作
    MCU->>OLED: 更新本地执行状态
    MCU->>ONENET: 回报最终设备状态
```

---

## 6. 嵌入式软件架构

### 6.1 分层结构

```text
┌─────────────────────────────────────────────┐
│ 应用层：主循环、任务调度、状态机、控制仲裁 │
├─────────────────────────────────────────────┤
│ 协议层：OneNET 属性模型、JSON 编解码       │
├─────────────────────────────────────────────┤
│ 网络层：ESP8266 AT 指令、连接与收发        │
├─────────────────────────────────────────────┤
│ 设备层：DHT11、2410B、OLED、执行器驱动     │
├─────────────────────────────────────────────┤
│ HAL/BSP：GPIO、UART、定时器、延时与中断    │
└─────────────────────────────────────────────┘
```

上层只依赖下层公开接口，传感器驱动和网络驱动不直接包含云端业务逻辑。这样可以在不修改 DHT11 或 2410B 驱动的情况下替换云平台，也可以在不改动 OneNET 协议层的情况下增加新的传感器。

### 6.2 统一设备状态模型

嵌入式端需要同时维护传感器值、网络状态、执行器状态和故障状态。将这些信息组织为统一上下文，可以降低全局变量散落带来的耦合。

下面是与当前模块边界一致的抽象实现示例：

```c
#include <stdint.h>
#include <stdbool.h>

typedef enum
{
    CLOUD_OFFLINE = 0,
    CLOUD_CONNECTING,
    CLOUD_ONLINE
} CloudState;

typedef enum
{
    CONTROL_MANUAL = 0,
    CONTROL_LOCAL_AUTO,
    CONTROL_CLOUD_AUTO
} ControlMode;

typedef struct
{
    int16_t temperature_x10;   /* 0.1°C */
    int16_t humidity_x10;      /* 0.1%RH */
    bool presence;
    bool dht_valid;
    uint32_t sample_tick;
} TelemetryState;

typedef struct
{
    uint8_t fan_level;
    bool pump_on;
    bool led_on;
    bool buzzer_on;
    int16_t target_temperature_x10;
} ActuatorState;

typedef struct
{
    CloudState cloud_state;
    ControlMode control_mode;
    uint16_t error_code;
    uint32_t upload_success_count;
    uint32_t upload_failure_count;
} RuntimeState;

typedef struct
{
    TelemetryState telemetry;
    ActuatorState actuator;
    RuntimeState runtime;
} DeviceContext;

static DeviceContext g_device;
```

这种状态模型直接服务于三个方向：

- OLED 从 `DeviceContext` 读取需要显示的字段。
- OneNET 上报函数从同一状态中构造设备属性。
- 控制模块在更新执行器状态后将结果重新写回上下文。

---

## 7. 系统启动与运行状态机

### 7.1 启动过程

系统启动过程不是简单连续调用初始化函数，而是建立一个可观测的启动阶段：

```text
基础时钟与 GPIO
→ 调试串口
→ OLED
→ DHT11 与 2410B
→ ESP8266 自检
→ Wi-Fi 接入
→ OneNET 会话建立
→ 进入在线运行
```

典型代码结构如下：

```c
static void System_Boot(DeviceContext *ctx)
{
    Board_Init();
    DebugUart_Init();
    OLED_Init();

    OLED_ShowString(0, 0, "STC_SYSTEM");
    OLED_ShowString(0, 2, "Booting...");

    DHT11_Init();
    LD2410B_Init();
    Actuator_Init();

    ESP8266_Init();
    ctx->runtime.cloud_state = CLOUD_CONNECTING;

    if (OneNET_Connect() == 0)
    {
        ctx->runtime.cloud_state = CLOUD_ONLINE;
        OLED_ShowString(0, 4, "Cloud: Online");
    }
    else
    {
        ctx->runtime.cloud_state = CLOUD_OFFLINE;
        OLED_ShowString(0, 4, "Cloud: Offline");
    }
}
```

该示例体现的关键点不是函数名，而是初始化结果进入统一运行状态，而不是只通过串口打印后丢失。

### 7.2 运行状态机

```text
stateDiagram-v2
    [*] --> Boot
    Boot --> LocalReady: 传感器与显示初始化完成
    LocalReady --> Connecting: 发起网络连接
    Connecting --> Online: OneNET 连接成功
    Connecting --> LocalReady: 连接超时
    Online --> LocalReady: 网络链路断开
    Online --> CommandExecuting: 收到有效下行命令
    CommandExecuting --> Online: 执行并回报状态
    LocalReady --> Connecting: 到达重连时间
```

状态机的意义是让“本地功能可用”和“云端链路可用”成为两个独立状态。即使 OneNET 暂时离线，设备仍然能够持续采集、显示，并执行本地安全策略。

---

## 8. 无 RTOS 条件下的协作式任务调度

当前项目采用轻量主循环而不是 RTOS。该选择适合任务数量有限、资源预算明确、执行路径可控的 STM32 边缘控制系统。

### 8.1 任务节拍设计

| 任务 | 典型节拍 | 设计目的 |
|---|---:|---|
| 2410B 状态读取 | 高频 | 快速感知人员进入和离开 |
| DHT11 采样 | 低频 | 匹配环境变量变化速度与传感器特性 |
| OLED 刷新 | 数据变化或固定周期 | 减少闪烁和总线占用 |
| 云端数据上报 | 秒级周期 | 平衡实时性与网络开销 |
| 下行数据处理 | 主循环高频检查 | 降低远程控制延迟 |
| 网络重连 | 退避周期 | 避免失败时持续阻塞 |

### 8.2 调度示例

```c
#define PERIOD_PRESENCE_MS      100U
#define PERIOD_DHT11_MS        2000U
#define PERIOD_DISPLAY_MS       500U
#define PERIOD_UPLOAD_MS       5000U
#define PERIOD_RECONNECT_MS   10000U

static bool Tick_Expired(uint32_t now, uint32_t *last, uint32_t period)
{
    if ((uint32_t)(now - *last) < period)
    {
        return false;
    }

    *last = now;
    return true;
}

void App_RunOnce(DeviceContext *ctx, uint32_t now)
{
    static uint32_t last_presence;
    static uint32_t last_dht;
    static uint32_t last_display;
    static uint32_t last_upload;
    static uint32_t last_reconnect;

    if (Tick_Expired(now, &last_presence, PERIOD_PRESENCE_MS))
    {
        Presence_Task(ctx);
    }

    if (Tick_Expired(now, &last_dht, PERIOD_DHT11_MS))
    {
        Environment_Task(ctx);
    }

    Cloud_DownlinkTask(ctx);
    Control_Task(ctx);

    if (Tick_Expired(now, &last_display, PERIOD_DISPLAY_MS))
    {
        Display_Task(ctx);
    }

    if (ctx->runtime.cloud_state == CLOUD_ONLINE &&
        Tick_Expired(now, &last_upload, PERIOD_UPLOAD_MS))
    {
        Cloud_UploadTask(ctx);
    }

    if (ctx->runtime.cloud_state == CLOUD_OFFLINE &&
        Tick_Expired(now, &last_reconnect, PERIOD_RECONNECT_MS))
    {
        Cloud_ReconnectTask(ctx);
    }
}
```

该模式避免在主循环中使用长时间 `delay_ms()`，保证下行消息解析和人员状态更新不会被网络等待长期阻塞。

---

## 9. DHT11 温湿度采集实现

### 9.1 驱动层职责

DHT11 使用单总线时序完成通信。驱动层主要完成：

- 主机拉低总线发起采样。
- 切换 GPIO 输入输出方向。
- 等待传感器响应。
- 读取 40 位数据。
- 校验和验证。
- 返回明确的成功或错误状态。

### 9.2 数据有效性管理

控制逻辑不能把“上一次正确值”误认为“本周期采样成功”。因此状态中保留 `dht_valid` 和 `sample_tick`。

```c
typedef enum
{
    SENSOR_OK = 0,
    SENSOR_TIMEOUT,
    SENSOR_CHECKSUM_ERROR,
    SENSOR_RANGE_ERROR
} SensorStatus;

static SensorStatus Environment_Read(TelemetryState *telemetry)
{
    uint8_t temperature = 0;
    uint8_t humidity = 0;

    if (DHT11_Read_Data(&temperature, &humidity) != 0)
    {
        telemetry->dht_valid = false;
        return SENSOR_TIMEOUT;
    }

    if (temperature > 80U || humidity > 100U)
    {
        telemetry->dht_valid = false;
        return SENSOR_RANGE_ERROR;
    }

    telemetry->temperature_x10 = (int16_t)temperature * 10;
    telemetry->humidity_x10 = (int16_t)humidity * 10;
    telemetry->dht_valid = true;
    telemetry->sample_tick = System_GetTick();

    return SENSOR_OK;
}
```

### 9.3 环境数据平滑

云端模型可以利用原始数据与滑动特征，但本地显示和安全控制更适合使用轻量平滑值。

```c
static int16_t LowPass_Update(int16_t previous, int16_t current)
{
    /* α = 0.25，使用整数运算避免浮点开销 */
    return (int16_t)((previous * 3 + current) / 4);
}
```

该滤波器不会替代云端特征工程，只用于降低偶发抖动对 OLED 和本地控制的影响。

---

## 10. HLK-LD2410B 人体存在检测实现

### 10.1 为什么使用毫米波人体雷达

与传统被动红外传感器相比，2410B 能够覆盖静止人体存在场景。对于智能空间控制，“人坐着不动”仍然应被识别为有人，否则系统可能错误进入节能状态。

### 10.2 GPIO 模式

当前主链路使用 GPIO 输出获取二值存在状态，优势是接口稳定、数据路径短、边缘计算开销低。

```c
static bool Presence_ReadRaw(void)
{
    return LD2410B_GPIO_Read() != 0;
}
```

### 10.3 状态防抖与离开延迟

人体存在信号不宜直接映射为执行器动作。进入房间应快速响应，离开房间则应经过连续确认，避免人员短暂处于雷达弱覆盖区域时设备立即关闭。

```c
#define PRESENCE_ENTER_CONFIRM_COUNT   2U
#define PRESENCE_LEAVE_CONFIRM_COUNT  30U

typedef struct
{
    bool stable_state;
    uint16_t enter_count;
    uint16_t leave_count;
} PresenceFilter;

static bool PresenceFilter_Update(PresenceFilter *filter, bool raw)
{
    if (raw)
    {
        filter->leave_count = 0;

        if (!filter->stable_state &&
            ++filter->enter_count >= PRESENCE_ENTER_CONFIRM_COUNT)
        {
            filter->stable_state = true;
            filter->enter_count = 0;
        }
    }
    else
    {
        filter->enter_count = 0;

        if (filter->stable_state &&
            ++filter->leave_count >= PRESENCE_LEAVE_CONFIRM_COUNT)
        {
            filter->stable_state = false;
            filter->leave_count = 0;
        }
    }

    return filter->stable_state;
}
```

该策略体现了控制系统中的非对称状态确认：人员进入需要快速响应，人员离开需要更保守确认。

### 10.4 UART 模式扩展接口

仓库中的 2410B 模块同时保留 UART 模式。接入完整串口数据后，可将二值 `presence` 扩展为：

```c
typedef struct
{
    bool target_present;
    bool moving_target;
    bool static_target;
    uint16_t moving_distance_cm;
    uint16_t static_distance_cm;
    uint8_t moving_energy;
    uint8_t static_energy;
} RadarTargetState;
```

云端模型由此可以进一步学习空间距离、静止时间和活动状态，使控制策略从“有人/无人”升级为“空间占用与活动强度感知”。

---

## 11. OLED 本地可观测界面

OLED 在本项目中承担调试接口和产品界面双重作用。它不仅显示传感器结果，也直接暴露连接状态、控制模式和执行器状态。

建议界面布局如下：

```text
T:26C  H:58%
Presence: YES
Fan:2  Pump:OFF
WiFi:OK Cloud:OK
```

显示任务只读取统一状态，不直接访问传感器驱动：

```c
static void Display_Task(const DeviceContext *ctx)
{
    OLED_ShowNum(16, 0, ctx->telemetry.temperature_x10 / 10, 2);
    OLED_ShowNum(72, 0, ctx->telemetry.humidity_x10 / 10, 2);

    OLED_ShowString(0, 2,
        ctx->telemetry.presence ? "Presence:YES " : "Presence:NO  ");

    OLED_ShowNum(32, 4, ctx->actuator.fan_level, 1);
    OLED_ShowString(64, 4,
        ctx->actuator.pump_on ? "Pump:ON " : "Pump:OFF");

    OLED_ShowString(0, 6,
        ctx->runtime.cloud_state == CLOUD_ONLINE ?
        "Cloud:ONLINE " : "Cloud:OFFLINE");
}
```

该分层使 OLED 驱动只负责渲染，业务状态由应用层统一决定。

---

## 12. ESP8266 网络接入实现

### 12.1 AT 指令事务模型

ESP8266 网络层将每条 AT 指令视为一个有开始、有超时、有结果的事务：

```text
清理当前接收状态
→ 发送命令
→ 持续接收 UART 数据
→ 匹配成功关键字或错误关键字
→ 超时退出
→ 返回结构化状态码
```

```c
typedef enum
{
    ESP_STATUS_OK = 0,
    ESP_STATUS_TIMEOUT,
    ESP_STATUS_ERROR_RESPONSE,
    ESP_STATUS_DISCONNECTED,
    ESP_STATUS_BUFFER_FULL
} EspStatus;

EspStatus ESP8266_SendCommand(
    const char *command,
    const char *expected,
    uint32_t timeout_ms)
{
    uint32_t start = System_GetTick();

    ESP8266_RxClear();
    DebugUart_SendString(command);

    while ((uint32_t)(System_GetTick() - start) < timeout_ms)
    {
        ESP8266_RxPoll();

        if (ESP8266_RxContains(expected))
        {
            return ESP_STATUS_OK;
        }

        if (ESP8266_RxContains("ERROR") ||
            ESP8266_RxContains("FAIL"))
        {
            return ESP_STATUS_ERROR_RESPONSE;
        }
    }

    return ESP_STATUS_TIMEOUT;
}
```

### 12.2 串口环形缓冲区

网络数据存在分包和粘包现象。环形缓冲区可以把 UART 中断接收与协议解析解耦：

```c
#define ESP_RX_BUFFER_SIZE 1024U

typedef struct
{
    uint8_t data[ESP_RX_BUFFER_SIZE];
    volatile uint16_t write_index;
    volatile uint16_t read_index;
} RingBuffer;

static RingBuffer g_esp_rx;

void ESP8266_UartRxISR(uint8_t byte)
{
    uint16_t next = (uint16_t)((g_esp_rx.write_index + 1U) % ESP_RX_BUFFER_SIZE);

    if (next != g_esp_rx.read_index)
    {
        g_esp_rx.data[g_esp_rx.write_index] = byte;
        g_esp_rx.write_index = next;
    }
}

bool RingBuffer_Pop(RingBuffer *buffer, uint8_t *byte)
{
    if (buffer->read_index == buffer->write_index)
    {
        return false;
    }

    *byte = buffer->data[buffer->read_index];
    buffer->read_index =
        (uint16_t)((buffer->read_index + 1U) % ESP_RX_BUFFER_SIZE);

    return true;
}
```

### 12.3 分层重连

重连逻辑区分三个层级：

1. ESP8266 是否响应 AT。
2. Wi-Fi 热点是否仍然连接。
3. OneNET MQTT 会话是否仍然有效。

这样可以只恢复失效层，而不是每次都完整复位网络模块。

```c
static void Cloud_ReconnectTask(DeviceContext *ctx)
{
    if (ESP8266_Ping() != ESP_STATUS_OK)
    {
        ESP8266_HardwareReset();
    }

    if (!ESP8266_IsWifiConnected())
    {
        if (ESP8266_JoinAccessPoint() != ESP_STATUS_OK)
        {
            ctx->runtime.cloud_state = CLOUD_OFFLINE;
            return;
        }
    }

    if (OneNET_Connect() == 0)
    {
        ctx->runtime.cloud_state = CLOUD_ONLINE;
    }
}
```

---

## 13. OneNET 设备属性与 MQTT 协议设计

### 13.1 上报数据模型

设备端将环境数据、存在状态和执行器状态统一组织为设备属性：

```json
{
  "id": "telemetry-12345",
  "version": "1.0",
  "params": {
    "CurrentTemperature": { "value": 26.0 },
    "CurrentHumidity": { "value": 58.0 },
    "presence": { "value": 1 },
    "fanLevel": { "value": 2 },
    "pump": { "value": 0 },
    "controlMode": { "value": "cloud_auto" },
    "errorCode": { "value": 0 }
  }
}
```

属性命名稳定后，云端存储、特征服务和模型服务都可以围绕同一契约开发。

### 13.2 嵌入式 JSON 构造

```c
#define TELEMETRY_JSON_SIZE 384U

static int BuildTelemetryJson(
    const DeviceContext *ctx,
    char *output,
    size_t output_size)
{
    int length = snprintf(
        output,
        output_size,
        "{\"id\":\"%lu\",\"version\":\"1.0\","
        "\"params\":{"
        "\"CurrentTemperature\":{\"value\":%d.%d},"
        "\"CurrentHumidity\":{\"value\":%d.%d},"
        "\"presence\":{\"value\":%u},"
        "\"fanLevel\":{\"value\":%u},"
        "\"pump\":{\"value\":%u},"
        "\"errorCode\":{\"value\":%u}}}",
        (unsigned long)System_GetTick(),
        ctx->telemetry.temperature_x10 / 10,
        abs(ctx->telemetry.temperature_x10 % 10),
        ctx->telemetry.humidity_x10 / 10,
        abs(ctx->telemetry.humidity_x10 % 10),
        ctx->telemetry.presence ? 1U : 0U,
        ctx->actuator.fan_level,
        ctx->actuator.pump_on ? 1U : 0U,
        ctx->runtime.error_code);

    if (length < 0 || (size_t)length >= output_size)
    {
        return -1;
    }

    return length;
}
```

示例通过检查 `snprintf` 返回值避免缓冲区溢出。正式工程还可以使用轻量 JSON 库，以降低手工拼接复杂度。

### 13.3 下行命令模型

云端输出采用面向设备属性的命令格式：

```json
{
  "id": "decision-8751",
  "params": {
    "fanLevel": 2,
    "pump": 0,
    "led": 1,
    "targetTemperature": 26.0,
    "controlMode": "cloud_auto"
  },
  "modelVersion": "comfort-model-3.2.1"
}
```

其中 `modelVersion` 用于建立决策可追溯性。嵌入式端不需要理解模型内部逻辑，只需验证并执行标准化动作。

---

## 14. 下行消息解析与命令执行

### 14.1 内部控制命令

网络消息不应直接操作 GPIO。先把消息转换为内部命令，可以将协议解析和硬件执行解耦。

```c
typedef struct
{
    bool has_fan_level;
    uint8_t fan_level;

    bool has_pump;
    bool pump_on;

    bool has_led;
    bool led_on;

    bool has_target_temperature;
    int16_t target_temperature_x10;
} DeviceCommand;
```

### 14.2 参数边界校验

```c
static bool Command_Validate(const DeviceCommand *command)
{
    if (command->has_fan_level && command->fan_level > 3U)
    {
        return false;
    }

    if (command->has_target_temperature &&
        (command->target_temperature_x10 < 160 ||
         command->target_temperature_x10 > 320))
    {
        return false;
    }

    return true;
}
```

### 14.3 幂等执行

```c
static void Command_Execute(
    DeviceContext *ctx,
    const DeviceCommand *command)
{
    if (command->has_fan_level &&
        command->fan_level != ctx->actuator.fan_level)
    {
        Fan_SetLevel(command->fan_level);
        ctx->actuator.fan_level = command->fan_level;
    }

    if (command->has_pump &&
        command->pump_on != ctx->actuator.pump_on)
    {
        Pump_Set(command->pump_on);
        ctx->actuator.pump_on = command->pump_on;
    }

    if (command->has_led &&
        command->led_on != ctx->actuator.led_on)
    {
        LED_Set(command->led_on);
        ctx->actuator.led_on = command->led_on;
    }

    if (command->has_target_temperature)
    {
        ctx->actuator.target_temperature_x10 =
            command->target_temperature_x10;
    }
}
```

只有状态发生变化时才操作硬件，避免重复命令造成继电器抖动或电机重复初始化。

---

## 15. 控制仲裁与安全策略

云端模型负责给出建议，本地控制层负责确保建议可以安全执行。控制优先级如下：

```text
硬件保护
> 故障安全策略
> 本地紧急控制
> 云端机器学习策略
> 默认本地规则
```

### 15.1 执行器最小启停时间

```c
#define FAN_MIN_ON_MS   30000U
#define FAN_MIN_OFF_MS  15000U

static bool Fan_CanSwitch(
    bool current_on,
    uint32_t last_switch_tick,
    uint32_t now)
{
    uint32_t elapsed = now - last_switch_tick;

    if (current_on)
    {
        return elapsed >= FAN_MIN_ON_MS;
    }

    return elapsed >= FAN_MIN_OFF_MS;
}
```

### 15.2 本地滞回保护

即使云端暂时离线，本地仍可采用基础滞回控制：

```c
#define FAN_START_TEMP_X10  290
#define FAN_STOP_TEMP_X10   270

static uint8_t LocalFallback_DecideFan(const DeviceContext *ctx)
{
    if (!ctx->telemetry.dht_valid || !ctx->telemetry.presence)
    {
        return 0U;
    }

    if (ctx->actuator.fan_level == 0U &&
        ctx->telemetry.temperature_x10 >= FAN_START_TEMP_X10)
    {
        return 1U;
    }

    if (ctx->actuator.fan_level > 0U &&
        ctx->telemetry.temperature_x10 <= FAN_STOP_TEMP_X10)
    {
        return 0U;
    }

    return ctx->actuator.fan_level;
}
```

该策略不是替代云端模型，而是保证网络异常时仍具备基础可用性。

---

## 16. 云端机器学习系统

云端算法是本项目区别于普通物联网采集工程的核心组成部分。其目标不是简单复制一个温度阈值，而是利用历史数据和上下文信息生成更稳定、更节能、更符合使用场景的控制策略。

云端源代码作为私有资产独立维护，文档公开其架构、接口和可复现扩展路径。

### 16.1 云端服务结构

```text
OneNET 数据入口
    ↓
消息校验与设备身份映射
    ↓
原始遥测存储
    ↓
实时特征服务
    ↓
机器学习推理服务
    ↓
规则与安全约束层
    ↓
设备命令生成器
    ↓
OneNET 属性下发
    ↓
执行结果与反馈记录
```

### 16.2 设备遥测数据结构

云端内部将 OneNET 消息规范化为统一记录：

```python
from dataclasses import dataclass
from datetime import datetime

@dataclass(frozen=True)
class TelemetryRecord:
    device_id: str
    timestamp: datetime
    temperature: float
    humidity: float
    presence: bool
    fan_level: int
    pump_on: bool
    control_mode: str
    error_code: int
```

这种内部数据模型屏蔽了 OneNET 原始字段包装，训练任务、在线推理和离线分析都可以复用。

---

## 17. 云端数据接入与校验

### 17.1 消息标准化

```python
from typing import Any

class TelemetryValidationError(ValueError):
    pass


def parse_onenet_payload(device_id: str, payload: dict[str, Any]) -> TelemetryRecord:
    try:
        params = payload["params"]
        temperature = float(params["CurrentTemperature"]["value"])
        humidity = float(params["CurrentHumidity"]["value"])
        presence = bool(params["presence"]["value"])
        fan_level = int(params.get("fanLevel", {"value": 0})["value"])
        pump_on = bool(params.get("pump", {"value": 0})["value"])
        error_code = int(params.get("errorCode", {"value": 0})["value"])
    except (KeyError, TypeError, ValueError) as exc:
        raise TelemetryValidationError("invalid OneNET telemetry payload") from exc

    if not -20.0 <= temperature <= 80.0:
        raise TelemetryValidationError("temperature out of accepted range")
    if not 0.0 <= humidity <= 100.0:
        raise TelemetryValidationError("humidity out of accepted range")
    if fan_level not in {0, 1, 2, 3}:
        raise TelemetryValidationError("invalid fan level")

    return TelemetryRecord(
        device_id=device_id,
        timestamp=datetime.utcnow(),
        temperature=temperature,
        humidity=humidity,
        presence=presence,
        fan_level=fan_level,
        pump_on=pump_on,
        control_mode="cloud_auto",
        error_code=error_code,
    )
```

数据入口首先解决类型、范围和字段完整性问题，防止传感器异常值直接进入模型。

### 17.2 数据质量标记

云端为每条记录附加质量信息，例如：

- 是否缺失关键字段。
- 是否超过物理合理范围。
- 是否与前一条记录跳变过大。
- 是否来自长时间离线后恢复的设备。
- 是否存在设备端错误码。

模型可以跳过低质量数据，训练集也可以据此完成清洗。

---

## 18. 特征工程

单次温度值不足以支持稳定控制。云端使用当前状态与时间窗口特征共同描述环境。

### 18.1 核心特征

| 特征 | 含义 |
|---|---|
| `temperature` | 当前温度 |
| `humidity` | 当前湿度 |
| `presence` | 当前是否有人 |
| `hour_sin/hour_cos` | 周期化时间特征 |
| `temperature_delta_5m` | 近 5 分钟温度变化 |
| `humidity_delta_5m` | 近 5 分钟湿度变化 |
| `temperature_mean_15m` | 近 15 分钟平均温度 |
| `presence_ratio_30m` | 近 30 分钟占用比例 |
| `fan_level` | 当前风扇档位 |
| `fan_runtime_30m` | 近 30 分钟风扇运行时长 |
| `time_since_manual_override` | 距离上次人工干预的时间 |

### 18.2 时间窗口特征示例

```python
import math
from collections.abc import Sequence


def build_features(
    current: TelemetryRecord,
    recent: Sequence[TelemetryRecord],
) -> dict[str, float]:
    temperatures = [item.temperature for item in recent]
    humidities = [item.humidity for item in recent]
    presence_values = [1.0 if item.presence else 0.0 for item in recent]

    hour = current.timestamp.hour + current.timestamp.minute / 60.0
    angle = 2.0 * math.pi * hour / 24.0

    first = recent[0] if recent else current

    return {
        "temperature": current.temperature,
        "humidity": current.humidity,
        "presence": float(current.presence),
        "hour_sin": math.sin(angle),
        "hour_cos": math.cos(angle),
        "temperature_mean": sum(temperatures) / max(len(temperatures), 1),
        "humidity_mean": sum(humidities) / max(len(humidities), 1),
        "temperature_delta": current.temperature - first.temperature,
        "humidity_delta": current.humidity - first.humidity,
        "presence_ratio": sum(presence_values) / max(len(presence_values), 1),
        "current_fan_level": float(current.fan_level),
    }
```

时间被编码为正弦和余弦特征，避免 23:59 与 00:00 在数值上被错误视为相距很远。

---

## 19. 模型设计与训练

### 19.1 模型任务

云端模型将控制问题建模为多分类任务：

```text
类别 0：关闭风扇
类别 1：低档
类别 2：中档
类别 3：高档
```

水泵或其他辅助设备可以使用独立分类器，或扩展为多输出模型。多模型方案便于独立评估和安全限制。

### 19.2 模型选择原则

该场景更重视稳定性、可解释性和小样本表现，而不是追求复杂网络结构。适合的模型包括：

- 逻辑回归：基线模型，便于分析各特征方向。
- 决策树：可以直接转化为可解释规则。
- 随机森林或梯度提升树：适合处理非线性特征组合。
- 规则与模型融合：先用安全规则限定动作空间，再由模型优化档位。

私有实现可以持续迭代，但对嵌入式端保持统一输出协议。

### 19.3 可复现训练参考

以下示例展示二次开发者如何基于公开数据契约训练一个兼容模型，并非公开私有模型参数：

```python
from pathlib import Path
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

FEATURE_COLUMNS = [
    "temperature",
    "humidity",
    "presence",
    "hour_sin",
    "hour_cos",
    "temperature_mean",
    "humidity_mean",
    "temperature_delta",
    "humidity_delta",
    "presence_ratio",
    "current_fan_level",
]


def train_model(dataset_path: Path, output_path: Path) -> None:
    dataframe = pd.read_parquet(dataset_path)

    x = dataframe[FEATURE_COLUMNS]
    y = dataframe["target_fan_level"]

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    numeric_pipeline = Pipeline(
        steps=[("scale", StandardScaler())]
    )

    preprocessor = ColumnTransformer(
        transformers=[("numeric", numeric_pipeline, FEATURE_COLUMNS)]
    )

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=8,
        min_samples_leaf=8,
        class_weight="balanced",
        random_state=42,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )

    pipeline.fit(x_train, y_train)
    prediction = pipeline.predict(x_test)

    print(classification_report(y_test, prediction))
    joblib.dump(pipeline, output_path)
```

### 19.4 评估指标

模型评估不只关注分类准确率，还关注控制系统指标：

- 各档位精确率和召回率。
- 风扇频繁切换次数。
- 人工覆盖率，即用户手动修改模型动作的比例。
- 无人场景中的设备运行时长。
- 达到目标舒适区间所需时间。
- 单位时间内的设备运行成本。

这些指标比单一准确率更能反映系统的实际价值。

---

## 20. 在线推理服务

### 20.1 推理结果结构

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class ControlDecision:
    fan_level: int
    pump_on: bool
    target_temperature: float
    confidence: float
    model_version: str
    reason_code: str
```

### 20.2 推理服务示例

```python
import joblib
import pandas as pd

MODEL_VERSION = "comfort-model-3.2.1"
MODEL = joblib.load("models/comfort_model.joblib")


def infer_control(features: dict[str, float]) -> ControlDecision:
    frame = pd.DataFrame([features])
    probabilities = MODEL.predict_proba(frame)[0]
    fan_level = int(probabilities.argmax())
    confidence = float(probabilities[fan_level])

    humidity = features["humidity"]
    presence = bool(features["presence"])

    pump_on = bool(presence and humidity < 35.0)

    return ControlDecision(
        fan_level=fan_level,
        pump_on=pump_on,
        target_temperature=26.0,
        confidence=confidence,
        model_version=MODEL_VERSION,
        reason_code="ML_COMFORT_POLICY",
    )
```

### 20.3 安全策略融合

模型输出不会直接下发，而是经过规则层：

```python

def apply_safety_guard(
    record: TelemetryRecord,
    decision: ControlDecision,
) -> ControlDecision:
    fan_level = decision.fan_level
    pump_on = decision.pump_on
    reason_code = decision.reason_code

    if record.error_code != 0:
        return ControlDecision(
            fan_level=0,
            pump_on=False,
            target_temperature=decision.target_temperature,
            confidence=decision.confidence,
            model_version=decision.model_version,
            reason_code="DEVICE_ERROR_SAFE_MODE",
        )

    if not record.presence:
        fan_level = 0
        pump_on = False
        reason_code = "UNOCCUPIED_ENERGY_SAVING"

    if record.temperature >= 35.0 and record.presence:
        fan_level = max(fan_level, 2)
        reason_code = "HIGH_TEMPERATURE_OVERRIDE"

    return ControlDecision(
        fan_level=fan_level,
        pump_on=pump_on,
        target_temperature=decision.target_temperature,
        confidence=decision.confidence,
        model_version=decision.model_version,
        reason_code=reason_code,
    )
```

这种“模型建议 + 规则护栏”的方式兼顾策略灵活性和控制安全性。

---

## 21. OneNET 下发适配

云端将内部决策转换为设备端能够解析的属性消息：

```python
from typing import Any


def build_device_command(decision: ControlDecision) -> dict[str, Any]:
    return {
        "id": f"decision-{decision.model_version}",
        "params": {
            "fanLevel": decision.fan_level,
            "pump": int(decision.pump_on),
            "targetTemperature": decision.target_temperature,
            "controlMode": "cloud_auto",
        },
        "modelVersion": decision.model_version,
        "confidence": round(decision.confidence, 4),
        "reasonCode": decision.reason_code,
    }
```

公开接口中保留 `modelVersion`、`confidence` 和 `reasonCode`，便于：

- 定位某次控制由哪个模型产生。
- 分析低置信度决策。
- 向运营或用户解释动作原因。
- 在模型升级后进行效果对比。

---

## 22. 决策可追溯与反馈闭环

每次云端决策记录以下内容：

```text
device_id
input_timestamp
raw_telemetry
feature_snapshot
model_version
predicted_action
confidence
safety_override
final_action
device_acknowledgement
manual_override
```

用户或运维人员手动调整执行器时，该事件被标记为 `manual_override`。这些反馈能够用于：

- 发现模型与真实偏好的差异。
- 构造后续训练标签。
- 分析不同空间、时段和人群的策略表现。
- 判断是否需要为特定设备建立个性化模型。

因此，系统不是一次性训练后固定不变，而是具备持续学习所需的数据闭环。

---

## 23. 云端模型版本与灰度策略

模型服务采用版本化输出，设备命令中携带版本信息。推荐的发布流程如下：

1. 离线数据集训练候选模型。
2. 使用留出集和回放数据验证。
3. 以影子模式运行，只记录预测但不控制设备。
4. 对少量设备启用灰度策略。
5. 对比人工覆盖率、能耗和舒适度指标。
6. 扩大部署范围或回滚至上一版本。

由于嵌入式端只依赖稳定的命令结构，云端模型可以在不更新固件的情况下迭代。

---

## 24. 异常处理与降级机制

### 24.1 传感器异常

- 单次读取失败：保留上次显示值，但标记本周期数据无效。
- 连续失败：设置错误码并停止依赖该传感器的自动策略。
- 恢复读取：清除错误码并重新进入正常状态。

### 24.2 网络异常

- 保持传感器采集和 OLED 显示。
- 切换至本地基础控制策略。
- 采用周期退避方式重连 Wi-Fi 和 OneNET。
- 恢复连接后上传最新状态，而不是阻塞式补发全部历史消息。

### 24.3 云端消息异常

- JSON 不完整：丢弃本条消息。
- 字段类型错误：拒绝执行并记录解析错误。
- 参数越界：拒绝该字段或整条命令。
- 重复消息：通过状态比对实现幂等处理。

### 24.4 执行器保护

- 限制风扇、水泵和继电器的最小启停时间。
- 故障状态进入安全动作。
- 云端命令不得绕过本地硬件保护。

---

## 25. 配置与安全设计

### 25.1 私有配置隔离

Wi-Fi 密码、OneNET 设备密钥和云端认证信息不写入公开源码。推荐结构：

```text
CONFIG/
├── private_config.example.h
└── private_config.h      # 加入 .gitignore
```

```c
/* private_config.example.h */
#define WIFI_SSID          "YOUR_WIFI_SSID"
#define WIFI_PASSWORD      "YOUR_WIFI_PASSWORD"
#define ONENET_PRODUCT_ID  "YOUR_PRODUCT_ID"
#define ONENET_DEVICE_NAME "YOUR_DEVICE_NAME"
#define ONENET_TOKEN       "YOUR_DEVICE_TOKEN"
```

### 25.2 日志脱敏

调试日志只显示设备标识或令牌的部分内容，不输出完整密钥。

### 25.3 最小权限

设备凭据只允许访问自身设备数据和控制主题，云端服务使用独立服务身份完成数据消费和命令写入。

### 25.4 命令白名单

嵌入式端只接受明确支持的字段，例如 `fanLevel`、`pump`、`led` 和 `targetTemperature`。未识别字段不映射到任何硬件操作。

---

## 26. 可观测性设计

### 26.1 嵌入式日志等级

```c
#define LOG_ERROR(...)  Debug_Log("ERROR", __VA_ARGS__)
#define LOG_WARN(...)   Debug_Log("WARN",  __VA_ARGS__)
#define LOG_INFO(...)   Debug_Log("INFO",  __VA_ARGS__)
#define LOG_DEBUG(...)  Debug_Log("DEBUG", __VA_ARGS__)
```

典型日志：

```text
[INFO] DHT11 sample: temperature=26 humidity=58
[INFO] Presence changed: 0 -> 1
[INFO] OneNET telemetry uploaded, message_id=12345
[WARN] MQTT session lost, reconnect scheduled
[ERROR] Downlink rejected: fanLevel out of range
```

### 26.2 运行指标

嵌入式端可维护：

- 采样成功与失败次数。
- 网络重连次数。
- 上传成功与失败次数。
- 下行命令解析成功与拒绝次数。
- 执行器切换次数。
- 设备持续运行时间。

云端可维护：

- 每设备消息频率。
- 数据质量异常率。
- 模型推理延迟。
- 各档位预测分布。
- 安全规则覆盖次数。
- 设备执行确认率。
- 人工覆盖率。

这些指标将“系统是否工作”升级为“系统为什么这样工作、当前质量如何”。

---

## 27. 技术难点与工程处理

### 27.1 多时序设备共存

DHT11 对微秒级时序敏感，ESP8266 网络交互可能存在较长等待，OLED 又需要周期刷新。项目通过模块化驱动和分时主循环控制不同任务的执行节奏，避免网络操作长期阻塞传感器和下行处理。

### 27.2 串口流式数据解析

AT 响应、MQTT 数据和模块状态消息可能出现在同一 UART 数据流中。网络层通过接收缓冲区、关键字匹配和消息边界识别分离底层响应与业务载荷。

### 27.3 云端算法与硬件安全的平衡

机器学习模型擅长从历史数据中生成策略，但不能直接承担硬件安全责任。系统将模型输出视为建议，再由云端规则层和 STM32 本地边界检查共同约束。

### 27.4 状态一致性

执行器状态存在三个视角：

- 云端期望状态。
- STM32 逻辑状态。
- 实际硬件状态。

当前系统通过命令执行后更新本地状态并重新上报，维持云端与边缘的一致性。对于带反馈的执行器，可以进一步读取真实硬件状态完成闭环确认。

### 27.5 人体存在状态的业务语义

雷达输出不是单纯的传感器数值，而是控制策略中的关键上下文。系统使用快速进入、延迟离开的防抖逻辑，使存在状态更符合真实房间使用过程。

---

## 28. 测试与验证方案

### 28.1 嵌入式单元与模块测试

| 测试对象 | 关键场景 | 预期结果 |
|---|---|---|
| DHT11 | 正常读取、断线、异常值、恢复 | 返回明确状态，不因失败阻塞主循环 |
| 2410B | 人员进入、静止、离开、边缘位置 | 状态切换稳定，离开有确认延时 |
| OLED | 数据变化、网络断开、错误码显示 | 界面持续刷新且无乱码 |
| ESP8266 | AT 响应、错误密码、热点断开、模块复位 | 超时可退出，能够重新连接 |
| OneNET | 上传成功、平台无响应、下行分包 | 状态可追踪，消息可完整解析 |
| 执行器 | 重复命令、快速切换、越界档位 | 幂等执行并遵守保护条件 |

### 28.2 端到端集成测试

```text
传感器输入变化
→ OLED 状态变化
→ OneNET 数据变化
→ 云端特征更新
→ 模型输出变化
→ 下行命令生成
→ STM32 执行动作
→ 设备状态重新上报
```

### 28.3 云端模型验证

- 离线训练集与测试集隔离。
- 使用时间切分避免未来信息泄漏。
- 对无人、高温、高湿、传感器异常等边界场景单独评估。
- 使用历史数据回放测试控制切换频率。
- 在影子模式中对比模型建议和现有规则策略。

### 28.4 故障注入测试

- 断开 DHT11 数据线。
- 屏蔽 2410B 输出。
- 关闭 Wi-Fi 热点。
- 发送不完整 JSON。
- 下发越界风扇档位。
- 重复发送同一命令。
- 云端返回高置信度但违反安全规则的动作。

故障注入能够证明系统不仅在理想状态下运行，也具备工程系统需要的保护逻辑。

---

## 29. 性能与资源控制

### 29.1 嵌入式资源

- 使用固定长度缓冲区，避免动态内存碎片。
- 对 `snprintf`、串口接收和 JSON 构造执行长度检查。
- 使用整数定点数保存温湿度，减少浮点运算依赖。
- OLED 只在数据变化或刷新周期到达时更新。
- 网络重连采用退避机制，避免持续占用主循环。

### 29.2 云端扩展

云端服务以 `device_id` 为分区键组织数据，可以水平扩展：

- 数据接入服务可以无状态部署多个实例。
- 特征缓存按设备分片。
- 模型服务独立扩容。
- 决策日志异步写入存储。
- 模型版本与设备分组建立映射，支持灰度发布。

---

## 30. 面向投资人的产品化价值

### 30.1 已验证的产品核心

本项目已经验证智能空间产品最关键的技术链路：

- 能够感知环境和空间占用。
- 能够稳定接入云端。
- 能够基于数据生成策略。
- 能够把策略重新落实到设备动作。
- 能够记录状态并持续优化算法。

### 30.2 可迁移场景

同一架构可以迁移到：

- 办公室节能控制。
- 宿舍和公寓环境管理。
- 酒店客房智能调节。
- 养老和照护场景中的长期存在检测。
- 实验室、机房和仓储环境监控。
- 教室、会议室的空间占用与设备联动。

### 30.3 技术护城河

系统的差异化不在单个硬件模块，而在以下组合能力：

- 人体存在与环境数据融合。
- 云边职责解耦。
- 可追溯的机器学习决策链。
- 本地安全控制与云端策略协同。
- 可扩展的设备属性和执行器协议。
- 能够通过真实使用反馈持续迭代的训练闭环。

---

## 31. 面向技术面试的能力映射

| 技术能力 | 项目中的体现 |
|---|---|
| 嵌入式 C | 驱动开发、状态结构、缓冲区、定时调度、执行器控制 |
| MCU 外设 | GPIO、UART、时序通信、OLED 接口 |
| 通信协议 | ESP8266 AT 指令、MQTT、OneNET 属性消息 |
| 系统设计 | 分层架构、状态机、故障降级、控制仲裁 |
| 数据工程 | 遥测规范化、质量校验、时间窗口特征 |
| 机器学习 | 特征工程、分类模型、在线推理、评估指标 |
| MLOps | 模型版本、灰度发布、影子模式、决策日志 |
| 安全性 | 私有配置、参数白名单、范围校验、安全规则 |
| 产品思维 | 从传感器采集到业务闭环和产品化场景 |

技术讨论时，应重点解释设计取舍，而不是仅罗列模块。例如：

- 为什么 2410B 的进入和离开使用不同确认时间。
- 为什么模型输出必须经过规则层。
- 为什么网络断开后仍保留本地控制。
- 为什么命令先解析为内部结构再操作硬件。
- 为什么模型版本需要写入控制消息和决策日志。

---

## 32. 二次开发指南

### 32.1 增加新的传感器

1. 在 `HARDWARE` 下增加独立驱动目录。
2. 定义初始化和读取接口。
3. 将结果加入 `TelemetryState`。
4. 在主循环中增加对应采样任务。
5. 扩展 OneNET 属性模型。
6. 在云端数据模型和特征构建中加入新字段。

例如增加 CO₂ 传感器：

```c
typedef struct
{
    int16_t temperature_x10;
    int16_t humidity_x10;
    uint16_t co2_ppm;
    bool presence;
    bool dht_valid;
    bool co2_valid;
    uint32_t sample_tick;
} TelemetryState;
```

### 32.2 增加新的执行器

1. 编写独立硬件驱动。
2. 在 `ActuatorState` 中增加状态字段。
3. 在 `DeviceCommand` 中增加可选命令字段。
4. 增加参数范围校验。
5. 在 `Command_Execute` 中完成幂等执行。
6. 将最终状态重新上报云端。

### 32.3 替换云端模型

只要新模型仍输出统一的 `ControlDecision`，嵌入式端无需修改。开发者可以替换为：

- 梯度提升树。
- 个性化用户模型。
- 强化学习策略。
- 基于舒适度指数的回归模型。
- 多任务模型，同时输出风扇、水泵和目标温度。

### 32.4 增加多设备支持

云端按 `device_id` 隔离状态和时间窗口。每台设备可以绑定：

- 独立模型版本。
- 房间类型。
- 设备能力描述。
- 支持的执行器范围。
- 用户偏好参数。

设备能力可通过云端配置描述：

```json
{
  "deviceId": "room-101",
  "capabilities": {
    "fanLevels": [0, 1, 2, 3],
    "pump": true,
    "led": true,
    "temperatureSensor": true,
    "humiditySensor": true,
    "presenceRadar": true
  }
}
```

云端根据能力生成命令，避免向不支持某执行器的设备下发无效字段。

---

## 33. 推荐仓库文档结构

```text
STC_SYSTEM/
├── README.md                         # 快速启动、编译与接线
├── PROJECT_DOCUMENT.md               # 本技术说明书
├── docs/
│   ├── architecture.md               # 架构与时序图
│   ├── protocol.md                   # OneNET 属性和命令契约
│   ├── cloud-ml-interface.md         # 云端算法公开接口
│   ├── troubleshooting.md            # 常见故障排查
│   └── images/                       # 硬件、OLED、云端页面截图
├── USER/
├── HARDWARE/
├── NET/
└── CONFIG/
    └── private_config.example.h
```

README 负责让开发者快速运行，技术文档负责解释系统如何设计、为什么这样实现，以及如何进行二次开发。

---

## 34. 演示与答辩流程

### 34.1 第一阶段：边缘感知

- 在 OLED 上展示温度、湿度和人体存在状态。
- 人员进入和离开雷达范围，观察状态切换。
- 说明快速进入和延迟离开的防抖策略。

### 34.2 第二阶段：数据上云

- 展示 ESP8266 连接日志。
- 在 OneNET 页面观察设备属性实时变化。
- 展示上报 JSON 和嵌入式状态结构之间的映射。

### 34.3 第三阶段：云端智能决策

- 展示云端收到的原始遥测。
- 展示计算后的时间窗口特征。
- 展示模型输出、置信度、模型版本和原因码。
- 说明安全规则是否修改了模型建议。

### 34.4 第四阶段：控制下行

- 云端通过 OneNET 下发风扇档位或辅助设备状态。
- STM32 解析命令并执行。
- OLED 显示新的执行器状态。
- 设备将最终状态重新上报，证明闭环完成。

### 34.5 第五阶段：异常恢复

- 临时关闭热点。
- 展示本地采集和显示继续工作。
- 展示本地基础策略接管。
- 恢复热点，设备重新连接并恢复云端模式。

该演示顺序能够同时说明硬件真实性、网络链路、算法价值和系统可靠性。

---

## 35. 核心技术亮点总结

### 35.1 人体存在驱动的节能控制

系统不是只判断环境是否需要调节，还判断当前空间是否有人使用。2410B 的静止人体检测能力使该判断更符合真实室内场景。

### 35.2 嵌入式与机器学习协同

STM32 不承担复杂训练和推理，而是提供可靠数据与执行能力；云端利用历史数据和更强计算资源持续优化策略。

### 35.3 端到端可追溯

每次控制可以关联设备输入、特征快照、模型版本、置信度、安全规则和最终动作，便于调试、评估和产品运营。

### 35.4 本地安全优先

模型输出只是决策来源之一，本地参数校验、执行器保护和离线基础策略保证设备不会因网络或算法异常失去安全边界。

### 35.5 可扩展的数据与命令契约

新增传感器、执行器或模型时，系统通过扩展状态结构和设备属性完成演进，不需要重构整条链路。

---

## 36. 结论

STC_SYSTEM 已经建立了一套完整的智能空间云边协同控制架构。嵌入式端完成环境感知、人体存在判断、本地显示、网络接入、云平台通信和执行器控制；云端完成数据接入、特征工程、机器学习推理、安全策略融合和控制命令生成。

项目的核心不在于某一个传感器或某一种算法，而在于把以下能力组合成可运行系统：

```text
真实环境感知
+ 稳定嵌入式执行
+ 标准化云端数据通道
+ 可迭代机器学习决策
+ 本地安全保护
+ 完整反馈闭环
```

这使其既可以作为展示嵌入式和物联网工程能力的技术项目，也具备向办公节能、酒店客控、养老照护和智能空间管理等产品方向扩展的技术基础。

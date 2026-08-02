---
title: "Keil5 工程指南：添加文件、Include Path 与编译排错"
summary: "解释把 C 模块真正加入 µVision 工程需要完成的两件事，并用编译与链接阶段的区别快速定位头文件、未定义符号和重复定义。"
publishedAt: 2025-09-01
publishedLabel: "2025 年 9 月"
tags: ["Keil µVision", "Embedded C", "STM32", "Build System"]
featured: false
priority: 0
draft: false
readingMinutes: 6
relatedProjects: ["solar-floor-heating-control-system"]
---

## 为什么“文件已经复制进目录”仍然不能编译？

Keil µVision 的磁盘目录和工程树不是一回事。把 `sensor.c`、`sensor.h` 复制到工程文件夹，只完成了文件管理；要让编译器和链接器真正认识这个模块，还需要：

1. 把 `.c` 文件加入当前 Target 的某个 Group，使它参与编译。
2. 把 `.h` 所在目录加入 Include Paths，使预处理器能找到声明。

头文件负责暴露声明，不会因为被 `#include` 就自动把对应 `.c` 编译进工程。这正是“头文件不报错，但链接仍提示 undefined symbol”的根本原因。

## 第一步：把源文件加入工程组

1. 在左侧 **Project** 窗口选择合适的 Group。
2. 右键选择 **Add Existing Files to Group...**。
3. 选择需要参与构建的 `.c` 或 `.s` 文件，点击 **Add**，再关闭窗口。
4. 检查文件属性中的 **Include in Target Build** 没有被关闭。

Group 主要用于组织文件，本身不改变 C 语言的可见性。真正决定是否生成目标文件的是当前 Target 的构建配置。

## 第二步：添加头文件搜索路径

打开 **Options for Target → C/C++ → Include Paths**，加入头文件所在的**目录**，而不是某个具体 `.h` 文件。

推荐使用相对工程目录的路径：

```text
..\Drivers\Sensor
..\Middlewares\Protocol
```

绝对路径只在你的电脑上成立，换目录或交给队友就会失效。`#include "sensor.h"` 通常先搜索当前源文件附近，再搜索配置的 Include Paths；`#include <sensor.h>` 更依赖工程配置的搜索目录。

## 第三步：用构建输出验证，而不是只看高亮

按 **F7** 执行 Build，在 Build Output 中确认出现：

```text
compiling sensor.c...
linking...
0 Error(s), 0 Warning(s)
```

编辑器能跳转到头文件，只能证明索引器找到了文件，不代表该 `.c` 已进入当前 Target。最终应以编译命令、链接结果和生成的 Map/对象文件为准。

## 三类报错对应三个阶段

| 报错表现 | 所在阶段 | 优先检查 |
|---|---|---|
| `xxx.h: No such file or directory` | 预处理 | Include Paths 是否指向头文件目录、路径层级和大小写 |
| `Undefined symbol xxx` | 链接 | 对应 `.c` 是否加入当前 Target、是否被 Exclude、函数名与条件编译 |
| `Symbol xxx multiply defined` | 链接 | 是否重复加入源文件、在头文件中定义全局变量、或直接 `#include "xxx.c"` |

不要通过 `#include "xxx.c"` 解决未定义符号。它会把实现文本复制进当前编译单元，多个文件这样做就会产生重复定义。正确方式是头文件放声明、一个 `.c` 放实现，并把这个 `.c` 加入工程。

## 建议的最小模块结构

```c
/* sensor.h */
#ifndef SENSOR_H
#define SENSOR_H

void Sensor_Init(void);

#endif
```

```c
/* sensor.c */
#include "sensor.h"

void Sensor_Init(void)
{
    /* hardware initialization */
}
```

头文件保护宏防止同一声明被重复展开；全局变量应在头文件中写 `extern` 声明，只在一个 `.c` 中定义。

## 仍然异常时的检查顺序

1. 确认当前激活的是正确 Target。
2. Clean 后 Rebuild，排除旧对象文件干扰。
3. 查看文件是否被设置为不参与 Target Build。
4. 检查宏定义是否把实现包在未生效的 `#if` 中。
5. 检查工程路径、文件编码和大小写；跨 Windows/Linux 协作时尤其重要。
6. 中文注释乱码时再调整 **Edit → Configuration → Editor → Encoding**，不要把编码问题和编译路径问题混在一起处理。

## 参考资料

- [Keil µVision：Add Source Files to Project](https://www.keil.com/support/man/docs/uv4/uv4_ca_sourcefiles.asp)
- [Keil µVision：Include Paths 的搜索规则](https://www.keil.com/support/man/docs/uv4cl/uv4cl_dg_ecpp.htm)
- [Keil µVision：Project Menu 与 Build 命令](https://www.keil.com/support/man/docs/uv4cl/uv4cl_ui_project.htm)

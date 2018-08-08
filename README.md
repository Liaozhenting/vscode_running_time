# vscode_running_time
Vscode 运行时间统计。功能参考steam的游戏时间统计。
![show](./show.PNG)
## 使用 

点击start.bat启动VSCode，并进行使用时间的统计。
你可以给start.bat创建一个快捷方式放在桌面，代替VSCode。

## 设置

在 start.bat找到
```
start /d "D:\Program Files\Microsoft VS Code" Code.exe
```

把`"D:\Program Files\Microsoft VS Code"`替换为本机vscode的安装路径；

## 初始化时间(默认是初始的，不用管这条)
./last-launch,./total-running-time文件的内容都写成0。

./last-launch
```
0
```

./total-running-time
```
0
```
## Q&A
1. windows cmd中node经常卡住不往下走，在cmd中随便按个按键才会继续走。

答：去掉cmd的控制台窗口 属性 -> 选项 -> 编辑选项里的快速编辑模式。

勾选了快速编辑模式时，造成node停住的原因是不小心鼠标点了一下cmd里面的某个位置，在快速编辑模式下，当鼠标点击cmd中的无论任何内容后，所有正在运行的进程都会卡住，直到你拍一下其他任何按键为止。
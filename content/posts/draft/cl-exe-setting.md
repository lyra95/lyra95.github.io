---
title: "VScode \'cl.exe\' is not recognized error"
date: 2021-05-02T17:39:41+09:00
categories: []
tags: []
draft: false
---

## Error 설명

vscode 19

windows 10 64bit

build 시 다음과 같은 에러메세지

```shell
Starting build...
cl.exe /Zi /EHsc /nologo /Fe: C:\dev\codejam\strikeBall.exe C:\dev\codejam\strikeBall.cpp
'cl.exe' is not recognized as an internal or external command,
operable program or batch file.

Build finished with error(s).
The terminal process failed to launch (exit code: -1).

Terminal will be reused by tasks, press any key to close it.
```

tasks.json
```json
{
	"version": "2.0.0",
	"tasks": [
		{
			"type": "cppbuild",
			"label": "C/C++: cl.exe build active file",
			"command": "cl.exe",
			"args": [
				"/Zi",
				"/EHsc",
				"/nologo",
				"/Fe:",
				"${fileDirname}\\${fileBasenameNoExtension}.exe",
				"${file}"
			],
			"options": {
				"cwd": "${workspaceFolder}"
			},
			"problemMatcher": [
				"$msCompile"
			],
			"group": {
				"kind": "build",
				"isDefault": true
			},
			"detail": "compiler: cl.exe"
		}
	]
}
```

Intellisense c++ configuration(UI)

![This is an image](/images/cl-exe-setting-fig-1.png)

## 해결법

compiler path가 맞는지 확인하자.

path가 맞는대도 cl.exe is not recognized가 뜨면, 환경변수에 cl.exe path를 추가해보자.

그래도 해결이 안 된다면(필자와 같은 경우)

https://github.com/microsoft/vscode-cpptools/issues/3654

    Dear People from the future looking to solve your issue: Here is what we have figured out so far:

    In case you get the error C1034: iostream: no include path set: If you haven't already, start VS code from the Developer Command Prompt that is installed with the MSVC compiler set. If you have everything resolved now, very good. If not, continue.

    In case you get the error fatal error LNK1112: module machine type 'x86' conflicts with target machine type 'x64', you need to start VS Code from the x64 Developer Command Prompt

Developer Command Prompt에서 project directory로 들어가서 `code .` command를 통해 vs code를 실행하자. 이후 build시 cl.exe is not recognized 에러가 해결됬다.

## 또 다른 ERROR

```shell
helloworld.cpp
c:\Users\nicta\dev\c++\helloworld\helloworld.cpp(1): fatal error C1034: iostream: no include path set
The terminal process terminated with exit code: 2
```
build 시 위와 같이 standard library header가 include 되지 않고 C1034 에러코드가 나는 경우,

intellisense c/c++ configuration에서 include path를 확인해보자.

필자의 경우 standard library header file들이 `C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Tools\MSVC\14.28.29910\include` 경로에 있었는데, configuration에 path가 추가가 안 되어 있어서 추가해줬다.



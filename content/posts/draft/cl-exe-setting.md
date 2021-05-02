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

![This is an image](/static/images/cl-exe-setting-fig-1.jpg)


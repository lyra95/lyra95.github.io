---
title: "Help 메시지 출력하게 하기"
date: 2021-06-01T01:09:46+09:00
#draft: true
categories: [powershell]
tags: [powershell, help]
weight: 3
---

`param([switch] $help )`를 이용해서 if-else로 처리한다.

```ps1
param([switch] $help )
if ($help)
{
    Write-Host "create new md file:"
    write-host "./post {category} {name}"
}
else {
    $folder=$args[0]
    $name=$args[1]
    $path='content/ko/docs/'
    hugo new $path$folder/$name.md
}
```

`-h` 나 `-help` flag를 주면된다.

```powershell
PS C:\dev\blog> ./post -h

create new md file:
./post {category} {name}
```

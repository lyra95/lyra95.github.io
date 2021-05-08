---
title: "ps1 파일로 powershell command 한 번에 실행하기"
date: 2021-05-07T22:27:05+09:00
#draft: true
categories: [Powershell]
tags: [powershell, ps1]
weight: 1
---

## 문제

hugo라는 프레임워크로 블로그를 관리하고 있는데, 변경된 내역을 업데이트하려면 여러 번의 커맨드를 실행해야한다.

```powershell
hugo -t "zdoc"
cd public
git add .
git commit -m '.'
git push
cd ..
git add .
git commit -m '.'
git push
```

매번 타자를 치는 것도 손이 아파서 뭔가 방법이 없나 했다.
>귀찮음이 프로그래머를 성장시킨다

## 방법

text파일을 하나 만들고 실행하고자 할 커맨드를 다 작성한다.

```txt
hugo -t "zdoc"
cd public
git add .
git commit -m '.'
git push
cd ..
git add .
git commit -m '.'
git push
```

다른 이름으로 저장 -> 모든 확장자 -> {이름}.ps1 으로 저장한다.

powershell을 실행해서 `./{이름}`을 입력하면 저 커맨드들이 한꺼번에 실행된다.

## 나는 왜 안되지 하는 분들께

powershell이 이런식으로 ps1파일을 읽어와서 실행하는 것을 default로 막아놨다.

그 설정을 변경하려면 powershell을 관리자로 실행한 뒤 `Set-ExecutionPolicy RemoteSigned`를 입력하면 된다.
>출력되는 **보안 이슈**에 관한 설명을 꼭 읽고나서 설정을 바꾸세요

```powershell
PS C:\Windows\system32> Set-ExecutionPolicy RemoteSigned

Execution Policy Change
The execution policy helps protect you from scripts that you do not trust. Changing the execution policy might expose
you to the security risks described in the about_Execution_Policies help topic at
https:/go.microsoft.com/fwlink/?LinkID=135170. Do you want to change the execution policy?
[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"): Y
```

누군가 원격으로 내 컴퓨터에 접속해서 미리 작성해둔 ps1 스크립트를 실행해버릴 수도 있다는 생각이 들지만 털어봐야 아무것도 없어서 저는 쿨하게 Y를 누릅니다.

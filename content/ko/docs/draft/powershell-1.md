---
title: "Powershell 기본 문법"
date: 2021-05-08T15:04:14+09:00
#draft: true
categories: [powershell]
tags: [powershell,ps1]
weight: 3
---

블로그 포스팅을 할 때 `hugo new {path}/{namd}.md` 같은 식으로 .md파일을 생성하는데, path가 점점 길어지다 보니 타이핑이 귀찮아져서 .ps1파일을 하나 생성했다.

기본적인 if, switch문을 활용했다.

[if MS docs](https://docs.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-if?view=powershell-7.1)

[switch MS docs](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_switch?view=powershell-7.1)

## 

```ps1
// post.ps1
$folder=$args[0]
$name=$args[1]
$path=""
switch ($folder)
{
	"go" { $path="content/ko/docs/go/" }
	"graphics" { $path="content/ko/docs/graphics/" }
	Default { "Nothing is happened" }
}
if ( $path -ne "" )
{
	hugo new $path$name.md
}
else
{
	"Nothing is happened"
}
```

 - variable은 기본적으로 `${name}`의 형식이다.
 - `$args`로 사용자가 입력한 argument를 가져올 수 있다.
 - `!=`이 아니라 `-ne`을 쓴다.

생각해보니 굳이 switch문을 쓸 필요는 없었다.

```ps1
// post.ps1
$folder=$args[0]
$name=$args[1]
$path='content/ko/docs/'
hugo new $path$folder/$name.md
```

이제 터미널에 `./post {dir} {name}`만 입력해도 된다. `./post go new` 이런 식으로.

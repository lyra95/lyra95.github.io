---
title: "Hugo Mathjax Setting"
date: 2021-05-08T17:57:04+09:00
#draft: true
categories: []
tags: []
weight: 1
---

Hugo에 수식을 쓰고 싶으면 mathjax 플러그인을 쓰면된다. 

## mathjax_support.html 생성

먼저 mathjax를 로딩해주는 html 파일을 작성한다.

```html
<!--mathjax_support.html-->
<script>
  MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$','$$'], ['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
    }
  };

  window.addEventListener('load', (event) => {
      document.querySelectorAll("mjx-container").forEach(function(x){
        x.parentElement.classList += 'has-jax'})
    });

</script>
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
```

특정 테마를 사용중이라면 `{프로젝트최상위}/themes/{theme이름}/layouts/partials` 폴더에 저런 html파일들이 들어가 있는데, 위에서 만든 `mathjax_support.html`을 이 밑의 아무곳에나 둔다.(경로를 **기억**할 것)

필자는 math라는 디렉토리를 `layouts/partials`밑에 생성해서, `{생략}/layouts/partials/math/mathjax_support.html` 라는 경로가 되었다. (파일이름을 포함한 경로만 기억하면 본인 마음대로 해도 된다. `mathjax_load.html`로 하든 말든)

## `footer.html`에 line추가하기

여기서 살짝 편법을 쓴다.

보통 모든 게시글에는 꼬릿말이 있기에, `footer.html`을 로딩하게 된다. 그래서 `footer.html` 로딩되는김에 겸사겸사 `mathjax_support.html`도 로딩하라고 코드를 한 줄 추가해준다.

`footer.html`은 `layouts/partials` 밑의 어딘가에 있을 것이다. 못 찾겠으면 반드시 로딩될 것 같은 다른 html에 해도 된다.

만일 필자처럼 `mathjax_support.html`경로를 설정했다면, 다음과 같은 코드를 추가하면 된다.

```html
<!--footer.html-->
<!--어쩌고저쩌고 코드들-->


<!--마지막 줄에 아래 코드를 추가-->
{{ if $.Param "mathjax" }}{{ partial "math/mathjax_support.html" . }}{{ end }}
```

## 사용법

글을 쓸 마크다운 파일에서 프론트매터에 `mathjax : true`라고 타입하면 된다. 문법은 latex이랑 거의 같고, inline은 $, display는 $$로 하면된다.
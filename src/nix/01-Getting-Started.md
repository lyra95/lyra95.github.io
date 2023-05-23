# Nix 시작해보기

관리해야 되는 컴퓨터가 3대나 되다보니(집 데스크탑, 맥북, 회사 데스크탑),
개발 환경에 필요한 Dependency를 관리하는 것도 피곤한 일이 되었다.

대충 관리해야되는 것들을 리스트업하자면

- NeoVim 및 이런저런 플러그인들
- zsh 및 이런저런 플러그인들
- docker, helm, kubectl 등등등...
- 회사 TypeScript, JavaScript 프로젝트들
- 간단한 데이터 분석이나 툴링에 사용하는 Python (게다가 여러 버전으로 씀)
- 회사 .Net 프로젝트들
- 개인 플젝에 쓰는 Rust

이 정도 인데, 이걸 3대의 컴퓨터에서 Syncing 할 방법을 찾다가 [Nix](https://nixos.org/)라는 걸 발견했다.

# Nix가 뭘까?

Dependency를 밑바닥까지 정확하게 pinning하는 걸 목표로하는, 여러가지 구성품이 있는 ecosystem이다.

구성품으로는 크게 Nix language, Nix OS, Nix package manager가 있다.

## Nix language

Dependency 및 build/install step을 기술하기 위해 만들어진 언어다.
>예를 들어 zsh 플러그인 관리하는 zplug는 이렇게 기술된다.
>https://github.com/NixOS/nixpkgs/blob/master/pkgs/shells/zsh/zplug/default.nix

Dynamically Typed, Lazy and Functional한 언어이다.
(이런 특성을 가지도록 디자인된 이유가 있는데 나중에 후술)

개인적으로 문법이 너무 헷갈리게 디자인됬다고 생각한다.
예를 들어, path가 아닌 string literal 에 대해서는 걱정거리가 없는데,
path의 경우 `"./bin"` , `./bin` 가 하늘과 땅이 뒤집히는 차이가 있다.

## Nix OS

Nix의 목적(밑바닥까지 정확한 dependency pinning)을 가장 충실히 따르고자 만든 OS이다.

Nix package manager 자체는 딱히 OS를 가리진 않지만,
모든 OS가 같은 목적을 가진 것은 아니니까 따로 만들 법하다.

[Nix OS를 WSL로 실행하는 법도 있다](https://github.com/nix-community/NixOS-WSL)

## Nix package manager

`homebrew`, `apt` 같은 패키지 매니저라고 보면 된다. (물론 Nix의 목적을 가지고 설계되었다는 차이가 있다)

주로 [nix packages registry](https://github.com/NixOS/nixpkgs)에 nix language로 기술된 대로 패키지를 받을 수 있다.

이 거대한 single project repo를 clone 받아서, 특정 패키지를 받기 위해 필요한 dependency를 계산하려면,
어쩔 수 없이 Dynamic Type, Lazy 할 수 밖에 없다.

# 공부해볼 자료들

- [nix pills](https://nixos.org/guides/nix-pills/)

다들 먼저 이것부터 읽고 시작하라해서 읽어보는 중. flake가 나오기 전 글이라는 걸 감안해야된다.

- [home-manager](https://github.com/nix-community/home-manager)

결국 내가 원하는 프로그램이 이거 인데 (User Env 관리),
최근 나온 flake랑 어떻게 섞어서 쓰라는 건지 별로 자료가 없어서 공부 중
([이 영상](https://www.youtube.com/watch?v=1dzgVkgQ5mE)을 한 번 정독하고 따라해봐야겠다)

- [nix flakes](https://www.tweag.io/blog/2020-05-25-flakes/)

사람이 버젼 hash를 다 외우고 다닐 순 없으니까 최근에 사용성을 개선한다고 나왔다.
flake.nix에 의존성 및 build/install step을 기술하고,
실제 pinning된 버전은 flake.lock파일에 기록된다.

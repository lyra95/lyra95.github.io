---
title: "ProudNet API(1)"
date: 2021-04-26T18:17:59+09:00
categories: [Game Server, ProudNet]
tags: [network, server, game, proudnet]
draft: false
---

## Reference

http://guide.nettention.com/cpp_ko

## ProudNet란?

게임 서버 개발에 편의성을 제공하는 개발엔진이다. 유료지만(연간 사용료 3000만원) 자기계발용 개인 사용자에게는 무료다.

---

## 시작하기 전에 챙겨둘 개념

### 1. Host ID

- ProudNet에서는 서버와 클라이언트 모두 통칭해서 Host라고 부른다.

- 각 호스트는 1개의 Host ID를 갖는다.(Proud.HostID 타입)

- 서버의 Host ID는 고정된 값(Proud.HostID_Server)이다.

- Proud.CNetClient.GetPeerInfo() 혹은 Proud.CNetServer.GetClientInfo()를 통해 호스트의 IP address를 얻을 수 있음(권장x)
    >클라이언트는 NAT 장치 뒤에 있는 경우 외부IP가 여러개일 수 있음

### 2. 지원 프로토콜 종류

- Reliable messaging
    > 호스트간 전송 시간 비교적 김. 송수신 순서, 도착의 확실성 보장
- Unreliable messaging
    > 호스트간 전송 시간 비죠적 짧음. 순서 꼬일 수 있음. 도착 보장 안됨.

TCP, UDP같은 소켓이라 보면 될듯.

### 3. RMI(Remote Method Invocation)

ProudNet를 이용하면 개발자가 메시지 구조체나 송수신 처리 함수를 작성할 필요x.

```c++
Knight_Move([in] int id,[in] float x,[in] float y,[in] float z);
Knight_Attack([in] int id,[in] int target,[in] int damage);
```
위와 같은 형식으로 코드를 작성하면, 자체 컴파일러(PIDL, ProudNet IDL)가 메시지 구조체, 송수신 처리함수 루틴대로 c++ 소스를 만들어줌.

ProudNet은 비동기 RMI만 지원함.
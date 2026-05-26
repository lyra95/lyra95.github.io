# CLAUDE.md

수학 블로그. **npm workspaces 모노레포** ("1 solution : n projects").

## 구조
- 루트 = solution (앱 코드 없음, `workspaces: ["apps/*", "packages/*"]` + 위임 스크립트만)
- `apps/blog/` — `@mathblog/blog`, Vite + MDX + KaTeX 사이트
- `packages/diagrams/` — `@mathblog/diagrams`, three.js 도표 컴포넌트

## 명령 (루트에서 실행, `-w @mathblog/blog`로 위임)
- `npm run dev` / `build` / `preview` / `lint`
- `npm run new` — 인터랙티브 새 글 생성 (폴더 드릴다운 → 파일명 입력 → 템플릿 복사 + date 자동 채움)

## 포스트
- 위치: `apps/blog/src/posts/**/*.mdx` (추가하면 `data/posts.js`의 `import.meta.glob`이 자동 인식)
- 폴더명 = topic(사이드바 그룹), 루트 글은 폴더 없음
- metadata 필드: `title`, `excerpt`, `date`, `tags`, `draft` (`featured`·`readTime` 없음)
- `date` 형식: `'June 12, 2026'` ; draft는 dev에선 보이고 prod 빌드에서 제외
- 글 정렬 기본값: 날짜 내림차순

## 사이드바 순서 — `index.md` (주의: `.md`, **`.mdx` 아님**)
- 폴더마다 `index.md`에 markdown 링크 bullet로 순서 기재 (링크 순서가 곧 표시 순서, 텍스트는 사람용)
- 폴더·글 섞어 적기 가능. 링크 경로가 `.mdx`로 끝나면 글, 아니면 폴더로 판별
- `apps/blog/src/posts/index.md` = 최상위(폴더+루트 글) 순서 / 각 폴더 `index.md` = 내부 글 순서
- 미기재 항목은 기본 순서로 뒤에 자동 추가
- **필수 설정**: `vite.config.js`의 `mdx({ mdExtensions: [] })` — `.md`를 MDX로 컴파일하지 않게 해야 `index.md`를 `?raw`로 읽을 수 있음 (안 그러면 흰 화면)

## 도표 (three.js)
- 모두 `packages/diagrams`에 위치, 배럴 `src/index.js`로 export
- 사용: `import { SphereTangentDiagram } from '@mathblog/diagrams'` (상대경로 금지)
- **소스 그대로 소비** (빌드 단계 없음) — Vite가 링크된 워크스페이스 패키지를 변환, HMR 동작. 별도 Vite 설정 불필요
- 패키지는 자급자족 (`three`, `react-katex`, `katex` 직접 의존; react는 peer). blog 컴포넌트에 의존하지 말 것

## 배포
- GitHub Pages (`.github/workflows/deploy.yml`), push to `main`
- 빌드 산출물은 **`apps/blog/dist`** (루트 `dist` 아님) — 워크플로 경로가 여기에 맞춰져 있음

## 작업 스타일
- 커뮤니티의 방식을 따르되, 단순함을 우선시한다.
- 과도한 추상화·불필요한 필드를 피한다.
- 기본적의로 의존성 추가를 회피한다. 요구사항을 해결하는데 커뮤니티 방식에 따라 접근하는거라면 추가할 수 있다. 


## TODO / 확장 시 고려 — 포스트가 많아질 때의 병목
- **현재 구조**: `data/posts.js`가 `import.meta.glob('../posts/**/*.mdx', { eager: true })`로 전 글을 단일 번들에 인라인 (코드 스플리팅 없음). 글이 적을 땐 단순해서 OK.
- **병목 순서**: ① 클라이언트 번들(모든 방문자가 모든 글 다운로드 → 초기 로드/TTI, 모바일에서 먼저 체감) → ② 홈/태그 페이지가 전 글 카드 렌더(페이지네이션 없음) → ③ 빌드 타임(MDX 컴파일 + rehype-katex, 글 수에 선형). `posts.js`의 정렬/인덱스 빌드는 병목 아님.
- **임계점**: 글이 수백 개에 다가가면 도입 검토 (그 전엔 eager 유지가 더 단순).
- **수정 방향**: "메타 인덱스 + lazy 본문"
  - 빌드 시 메타(slug/title/date/tags/topic)만 추출한 경량 인덱스로 목록·사이드바·정렬 처리
  - 본문은 라우트별 `React.lazy(() => import())`로 chunk 분리 → 방문한 글만 다운로드
  - 홈/태그 페이지 페이지네이션 추가
- **단점/주의**:
  - 본문 편집 HMR은 그대로(오히려 빠름). **함정은 메타 인덱스**: 지금 eager glob이 공짜로 해주는 글 추가/삭제/메타수정 자동 반영을, 커스텀 메타 인덱스(Vite virtual module 등)에선 직접 디렉터리 watch + `handleHotUpdate`로 무효화해야 함. 부실하면 dev에서 재시작 전까지 반영 안 됨.
  - 복잡도↑(단순함 방침과 상충). 메타가 MDX 안 `export const metadata`라 본문 컴파일 없이 못 읽음 → frontmatter 전환 또는 플러그인이 정규식/파싱으로 메타만 추출 필요.
  - 글 첫 진입 시 chunk fetch → `<Suspense>` 로딩 깜빡임(hover/`modulepreload` prefetch로 완화).
  - SEO/SSR은 이미 SPA라 차이 없음. KaTeX 빌드 렌더는 오히려 이득(수식 HTML이 본문 chunk로 빠짐).

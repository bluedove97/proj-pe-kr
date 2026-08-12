# 계획: 04dd6f45c25748538ef2e0a6e8902e50 폴더 HTML 다크테마 리디자인

## Context
`index.html`의 "도커, 쿠버네티스 기본" 섹션에서 연결된 `04dd6f45c25748538ef2e0a6e8902e50/` 폴더의 HTML 파일들은 Notion에서 내보낸 문서들이다. 이 파일들은 흰 배경의 Notion 기본 스타일을 가지고 있어 메인 홈페이지의 다크 테마와 완전히 다른 느낌이다. 메인 사이트(style.css)의 디자인 언어를 적용해 일관성 있는 사용자 경험을 만들고, 모바일 반응형도 개선한다.

## 현황 분석

### 대상 파일
`04dd6f45c25748538ef2e0a6e8902e50/` 내 **28개 HTML 파일** (Docker 설치, 컨테이너 기본 조작, Kubernetes 설치 등 튜토리얼 페이지)

### 현재 구조 (공통)
```html
<html lang="ko">
  <head>
    <meta charset="utf-8"/>
    <title>...</title>
    <style>
      /* ~677줄의 Notion 내보내기 CSS (흰 배경, 회색 텍스트) */
    </style>
  </head>
  <body>
    <article id="[UUID]" class="page sans">
      <header>
        <div class="page-header-icon"><span class="icon">...</span></div>
        <h1 class="page-title">...</h1>
      </header>
      <div class="page-body">
        <!-- 코드블록, 표, 콜아웃, 이미지, 목차 등 -->
      </div>
    </article>
  </body>
</html>
```

### 메인 사이트 디자인 토큰 (style.css)
- 배경: `#06060f`, 카드: `#090917` / `rgba(12,12,30,0.85)`
- 브랜드 시안: `#00e5ff`, 브랜드 퍼플: `#8b5cf6`
- 텍스트: `#e2e8f0` (기본), `#94a3b8` (서브), `#64748b` (뮤트)
- 테두리: `#1e1e3a`
- 폰트: Space Grotesk (제목), Inter (본문), JetBrains Mono (코드)

## 구현 계획

### Step 1: `theme.css` 생성
`04dd6f45c25748538ef2e0a6e8902e50/theme.css` 파일을 생성한다. 이 파일은 기존 Notion CSS를 `!important`로 오버라이드한다.

**포함 내용:**
- Google Fonts import (Space Grotesk, Inter, JetBrains Mono)
- `html`, `body` 다크 배경 (`#06060f`) 및 텍스트 색상
- `article.page.sans` 레이아웃 (max-width: 860px, 패딩 조정)
- 고정 상단 네비게이션 바 스타일 (`#bd-nav`) — `← proj.pe.kr` 뒤로가기 버튼
- `h1 .page-title` 그라디언트 제목 (시안 → 퍼플)
- `h2`, `h3` 섹션 헤딩 스타일 (시안 악센트 border-left)
- `a` 링크 → 시안 (`#00e5ff`)
- `pre`, `code` 코드블록 다크 스타일 (`#090917` 배경, 테두리, JetBrains Mono)
- 인라인 `code` → 시안 글자, 반투명 배경
- Prism.js 토큰 색상 오버라이드 (keyword: 퍼플, string: emerald, function: 시안)
- `table`, `th`, `td` 다크 테이블 스타일
- `.callout` 다크 카드 스타일
- `.bookmark` 다크 카드 스타일
- 모바일 반응형 (`@media (max-width: 768px)`) — 패딩, 폰트 크기, 코드 블록 가로 스크롤

### Step 2: 28개 HTML 파일 수정
각 파일에 두 가지 변경을 가한다:

**변경 1 — `</head>` 직전에 link 태그 추가:**
```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="./theme.css">
</head>
```

**변경 2 — `<body>` 직후에 네비게이션 바 HTML 삽입:**
```html
<body>
<div id="bd-nav">
  <a href="../index.html" id="bd-back">
    <svg>← 화살표</svg>
    proj.pe.kr
  </a>
  <span id="bd-sep">|</span>
  <span id="bd-label">도커, 쿠버네티스 기본</span>
</div>
```

각 파일은 `Edit` 도구로 정확한 문자열 치환을 적용한다.

## 수정 대상 파일 목록 (28개)
```
01733138ed25452c971c54aa2daab868.html  0a79dc238fef4e2d9fd1aeaca3f8c7a9.html
2c1d0552905041469e22466b80897313.html  2f04b079bac349c0a3897fbae80eb4e6.html
35086cc805e948958288e086bab178ab.html  4594e856d0cd4f2eaca57e2ecf30b162.html
4b12801eaa7c40b88a0678a133ad049e.html  4d071fbdc1884ecc9429f9d3a0c3ce64.html
50010d7ef42044aa9224db65fb36f45e.html  5fb046e0594541c189f103dd1ec46885.html
63f566ef04e1472bbe09014cd54c656d.html  759e8675d713446ca632875df5264e06.html
7f7345f0d9304b94aa1e7859e75b063f.html  82507d8d97e045ce9af131935ffec58b.html
86f994c76ba04aefb9c645ec61bc5b3d.html  919b0a639a1a48238fa8adfb904d59cf.html
9d81481f98934dd6984d7c25e6b304f1.html  9eef4d93da434b269809dfec1b1a64f6.html
a4a213d5fd0b4755bdd22dd89ecb02dc.html  add9860fe624405a90c33d6155998e03.html
c46a14f279314a0c844d7c49c55db80d.html  c8cf83c660ff44739143b9393f95ad28.html
d0d037cdf82f4d96b38377c5e83a5338.html  df8e27da79f347098ecbe5f52ca6ebbe.html
eb2f55ff861d4512b056c2ebe7c4e4a8.html  f17ee81057e24b6a88a1bcc45ee2bf17.html
f436859aee054fd59fe42ca9067bc6b7.html  f58f86947dd949f795ff86f32f2d275e.html
```

## 검증
1. 브라우저에서 수정된 HTML 파일 열기 → 다크 배경, 시안/퍼플 색상 확인
2. 코드 블록 구문 강조 색상 확인
3. 모바일 뷰 (375px) 확인 — 코드블록 가로 스크롤, 폰트 크기
4. 상단 네비게이션 `← proj.pe.kr` 클릭 → `index.html`로 이동 확인

# 홈페이지 디자인 스타일 변경 — DESIGN.md 기반 리스타일

## Context

현재 `proj-pr-kr` 사이트(개인 포트폴리오, 단일 `index.html` + `style.css`, 빌드 시스템 없음)는 다크 네온 "사이버펑크 터미널" 톤(`#06060f` 캔버스, 시안 `#00e5ff`/퍼플 `#8b5cf6` 그라데이션, 글로우 그림자, 글래스모피즘 블러, 스케일 호버)으로 되어 있다. 사용자는 이 룩을 `DESIGN.md`에 정리된 OpenCode 마케팅 사이트 디자인 시스템(따뜻한 크림 캔버스, 잉크 단색, 헤어라인 경계선, ASCII 브래킷 마커, 플랫 엘리베이션, 4px/0px 두 단계 radius)으로 전면 교체하길 원한다.

사용자 확정 사항:
1. **적용 범위**: `index.html`/`style.css` 뿐 아니라 `04dd6f45c25748538ef2e0a6e8902e50/` 하위 26개 Notion export 페이지(공용 `theme.css` 1개로 스타일링됨)까지 전부 포함.
2. **폰트**: 기존 폰트 스택(Space Grotesk / Inter / JetBrains Mono) 그대로 유지 — DESIGN.md가 요구하는 Berkeley Mono 전면 단일 모노 폰트로는 전환하지 않음. 색상/여백/elevation/shape/컴포넌트 어휘만 DESIGN.md를 따르고, 폰트 역할 분리(디스플레이/본문/모노)는 유지하는 의도적 변형.
3. **히어로 터미널 카드**: 기존 whoami/mission.txt/skills/status 콘텐츠는 유지하되, DESIGN.md의 `hero-tui-mockup` + `tui-prompt-row` 패턴(풀블리드 다크 서피스, ASCII 워드마크, 키바인딩 힌트 행)으로 재구성.

## 접근 방식

### 1. 토큰 정의 (`style.css` 최상단에 `:root` 추가)

DESIGN.md 색상표를 CSS 커스텀 프로퍼티로 이식한다 (값은 DESIGN.md 그대로, 이름만 CSS 변수화):

```
--color-canvas:#fdfcfc  --color-ink:#201d1d  --color-ink-deep:#0f0000
--color-surface-soft:#f8f7f7  --color-surface-card:#f1eeee
--color-surface-dark:#201d1d  --color-surface-dark-elevated:#302c2c
--color-hairline:rgba(15,0,0,0.12)  --color-hairline-strong:#646262
--color-charcoal:#302c2c  --color-body:#424245  --color-mute:#646262
--color-stone:#6e6e73  --color-ash:#9a9898  --color-on-dark:#fdfcfc
--color-accent:#007aff  --color-danger:#ff3b30  --color-warning:#ff9f0a  --color-success:#30d158
--radius-none:0px  --radius-sm:4px  --radius-full:9999px
--space-section:96px (→64px @850px, →48px @640px)
```

폰트는 새 토큰(`--font-display`/`--font-body`/`--font-mono`)으로 기존 3-폰트 스택을 그대로 매핑하고, 타이포 크기/굵기/line-height만 DESIGN.md 표(`display-xl` 38px/700, `heading-md` 16px/700, `body-md` 16px/400, `button-md` 16px/500/lh2.0, `caption-md` 14px/lh2.0)를 참고해 맞춘다. `theme.css`는 별도 파일이라 `:root`를 공유할 수 없으므로 — 빌드 시스템이 없다는 제약상 — 동일 리터럴 값을 theme.css 상단에도 주석과 함께 복제한다(수동 동기화).

### 2. `style.css` 재작업

**그대로 둘 것**: flex/grid/gap/width/margin/padding 등 레이아웃 유틸리티, `.font-display/.font-body/.font-mono` (family 값 불변), 사이즈 유틸리티 구조, `@media` 구조.

**값만 교체할 것**: `body` 배경/텍스트, `.text-slate-*` → 새 뉴트럴 래더(100→ink, 200→charcoal, 300→body, 400→mute, 500→stone, 600/700→ash), `.text-brand-cyan/.text-brand-purple`(TUI 목업 밖에서는 ink로 단색화, 안에서는 accent 계열로 유지), `.bg-[#...]` 계열, `.border-[#1e1e3a]` → `var(--color-hairline)`.

**삭제/은퇴**: `.backdrop-blur-md`, `.bg-gradient-to-b`/`.from-brand-cyan`/`.via-brand-purple`/`.to-transparent` 그라데이션 그룹 전체, `.bg-grid`(도트 그리드 배경), `.gradient-text`, 카드류의 `.rounded-xl/.rounded-2xl/.rounded-lg`(→ `.rounded-none`/신규 `.rounded-sm` 4px), 버튼/카드 호버의 `transform:scale()` + glow box-shadow 전부. `.animate-pulse`는 히어로 TUI 목업의 상태 점(status dot) 1곳에만 남기고 나머지 사용처(nav pulse 등)에서 제거.

**컴포넌트별 재작성** (기존 클래스명 유지, 내부만 교체):
- `.btn-primary` → `button-primary`: `background:var(--color-ink)`, 텍스트 `on-primary`, `radius-sm`, 눌림 상태는 `--color-ink-deep`, hover/focus는 스케일·글로우 대신 flat outline ring.
- `.btn-outline` → `button-secondary`: `canvas` 배경 + `hairline-strong` 테두리, 스케일 제거.
- `.nav-link`: 그라데이션 밑줄 스윕 제거 → mute→ink 색 전환 + 정적 헤어라인 밑줄.
- `.skill-card`/`.stat-card`/`.tl-card`: `radius:0`, `hairline` 테두리 1px, hover는 `translateY`+glow 대신 border-color만 미세 변화.
- `.tag-cyan`/`.tag-purple` → 단일 `.tag`(surface-card 배경, hairline 테두리, mono 폰트, 색 구분 없음).
- `.section-line`(그라데이션 바) → 각 섹션 헤딩 앞에 리터럴 `[+]` ASCII 마커 + 헤딩 아래 1px hairline rule로 대체(`badge-section-label` 패턴).
- `.social-link`: `.cyan`/`.purple` 변형 제거, 단일 mute→ink 언더라인.
- `.tl-dot` 및 타임라인 세로 연결선: 그라데이션 → flat `hairline` 1px.

**히어로 `.terminal` → `.hero-tui-mockup` 재구성**: `.terminal-header`의 traffic-light 점 3개 제거. 컨테이너는 `surface-dark`(#201d1d) 풀필, 테두리/그림자 없음. 상단에 mono 워드마크(`> bluedove` 스타일, 굵고 넓은 자간), 중단은 기존 whoami/mission.txt/skills/status 라인을 `.tui-prompt-row`(surface-dark-elevated 배경)로 감싸고 명령어 하이라이트를 `--color-accent`(Apple Blue)로, skills 태그는 accent/success/warning 순환 — DESIGN.md가 명시적으로 세만틱 램프를 TUI 내부에서만 허용하므로 유일한 예외. 하단에 키바인딩 힌트 행(`[tab] scroll  [ctrl+c] contact` 등, `--color-ash`) 추가. 상태 점 pulse는 `--color-success`로 유지.

레이아웃상 완전 풀블리드 대신 기존 `lg:grid-cols-2` 오른쪽 컬럼 안에서 풀블리드(2단 히어로 구조 보존) — DESIGN.md `/enterprise` 페이지도 2단 구성을 쓰므로 허용 가능한 스코프 내 변형.

### 3. `index.html` 섹션별 매핑

| 섹션 | 변경 |
|---|---|
| Nav | 반투명 블러 다크 → 불투명 `canvas` 배경, `hairline` 하단선, 워드마크·아이콘 ink 단색화 |
| Hero | 배지 칩 flat화(surface-card+hairline), 그라데이션 헤드라인 제거(ink 단색), 헤드라인 크기 축소(5xl~7xl → 4xl~5xl 선), 버튼 재스타일 |
| 도커/K8s 코스 그리드 | 섹션 배경 밴드(`rgba(8,8,26,.5)`) 제거 → canvas, 헤딩에 `[+]` 마커+hairline rule, 설명 필 flat화, 카드 3개 flat화, 이모지 불릿(🔧/✔️) → ASCII 마커(`[+]`/`-`) |
| About | `.section-line`→ASCII마커+hairline, 텍스트 색 리매핑, stat-card 4개 flat화, social-link 단색화 |
| Skills | 배경 밴드 제거, 아이콘 뱃지 원형 글로우 배경 제거/단순화, `.tag-cyan/.tag-purple`→`.tag` |
| Projects/Timeline | 토글 버튼 `button-secondary`화(쉐브론 → 텍스트 `[+]`/`[-]` 옵션), 세로선 flat화, `loadTimeline()` JS 템플릿 리터럴 내 `text-brand-cyan`/`text-brand-purple` 좌우 교차색 제거 → mute 단색 (JS 코드 수정 필요, CSS만으론 불가) |
| Contact / Footer | 텍스트·버튼 색 리매핑, 상단/하단 hairline, `<meta theme-color>` `#06060f`→`#fdfcfc`, `<body class="bg-grid">`에서 `bg-grid` 제거 |

### 4. `theme.css` 매핑 (Notion 고정 클래스명 — HTML 본문은 수정 불가, CSS만 교체)

`#bd-nav`(back-bar)는 index.html의 primary-nav와 동일한 flat/hairline 처리로 통일. `.page-title`/`h1`/`h2`/`h3`는 그라데이션·시안·퍼플 컬러 코딩 제거하고 ink 단색 + hairline/hairline-strong 좌측 보더(위계 구분용, 색 대신 두께로). `p`/`li`/`strong` 텍스트는 새 뉴트럴 래더로. inline `code`는 surface-card 필. **`pre`(코드블록)는 예외적으로 `surface-dark` 유지** — DESIGN.md가 세만틱 램프를 "in-TUI"로 한정하는데, 코드블록은 사실상 TUI의 연장선이라는 논리로 다크 유지가 정당화됨(문서화된 의도적 예외). Prism `.token.*` 색상은 실제 Apple HIG 램프(accent/success/warning/danger)로 재매핑. `table`/`callout`/`table_of_contents`/`bookmark`/`blockquote`/`img`/`.link-to-page`/`hr` 전부 flat/hairline/surface-card 어휘로 전환, glow·호버 상승 효과 제거. `.block-color-*`(Notion 인라인 텍스트 색상)는 뉴트럴+제한된 accent 램프로 축소 매핑(퍼플/핑크는 대응 토큰 없어 charcoal로 수렴 — 문서화된 판단).

### 5. 구현 순서

1. `style.css`에 `:root` 토큰 블록 추가
2. 색상 관련 유틸리티 클래스 값 교체 (사이트 전역 색이 1차로 바뀜)
3. 하단 커스텀 컴포넌트 클래스 순차 재작성 (버튼 → nav-link → skill-card/tag → section-line → timeline → stat-card → hero-tui-mockup)
4. `index.html` 마크업/클래스/JS 템플릿 리터럴 수정 (위 표 순서대로)
5. `theme.css` 토큰 블록 + 전체 규칙 재작성 (파일 1개로 26개 하위 페이지 일괄 반영)
6. 검증

## 검증 방법

테스트 스위트가 없으므로 스크린샷 기반 시각 검증 + grep 감사로 진행.

1. `node serve.mjs`로 로컬 서빙 → 수정 전 `node screenshot.mjs`로 index.html + 대표 하위 페이지 2개(코드블록·callout이 있는 페이지 1개, table·bookmark가 있는 페이지 1개 — 사전에 grep으로 확인 후 선정) 스크린샷 캡처
2. 수정 후 동일 페이지 재캡처, 전/후 비교
3. `grep -n "linear-gradient\|box-shadow\|backdrop-filter\|scale(" style.css 04dd6f45c25748538ef2e0a6e8902e50/theme.css` — 코드블록(`pre`)의 사전 승인된 예외를 빼면 매치 0건이어야 함
4. 확인 체크리스트: 캔버스가 크림톤인지, index.html에서 다크 서피스가 히어로 TUI 목업 1곳에만 존재하는지, ASCII 브래킷 마커가 이모지/그라데이션 바를 대체했는지, 카드/버튼 radius가 0px(컨테이너)/4px(인터랙티브)로 분리되는지, 하위 페이지의 nav/코드블록/콜아웃/테이블이 새 톤과 일치하는지
5. 실제 브라우저에서 `:hover` 상태 수동 확인 (스크린샷으로는 캡처 안 됨)

## 수정 대상 파일

- `d:\Work\claudeee\proj-pr-kr\style.css`
- `d:\Work\claudeee\proj-pr-kr\index.html`
- `d:\Work\claudeee\proj-pr-kr\04dd6f45c25748538ef2e0a6e8902e50\theme.css`
- 참조만: `DESIGN.md`, `serve.mjs`, `screenshot.mjs`

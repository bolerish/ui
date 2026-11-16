# Surface

설치된 컴포넌트의 공유 재질을 불투명 또는 유리로 선택합니다. `@bolerish/ui/global.css`를 먼저 불러오세요. Provider·래퍼·소비자 StyleX 컴파일러는 필요하지 않습니다.

```tsx
import { surface } from "@bolerish/ui/surface";

<html data-bolerish-theme="dark" {...surface.props({ mode: "glass" })} />;
```

## `surface.props(options)`

`options.mode`는 필수이며 `"solid" | "glass"`를 받습니다. 반환 타입은 `SurfaceProps`: `{ "data-bolerish-surface": "solid" | "glass" }`입니다. `SurfaceOptions`는 `@bolerish/ui`와 `@bolerish/ui/surface`에서 내보냅니다. 누락되거나 지원하지 않는 모드는 `TypeError`를 던집니다.

속성을 생략해도 기본 표면은 불투명합니다. 유리는 떠 있는 표면과 모달·알림에 94% `bgRaised`와 16px 배경 블러를 적용합니다. 명시적으로 반투명을 선택한 카드와 Menubar는 92% `bgSurface`와 같은 블러를 사용합니다. 일반 카드와 입력은 불투명 재질을 유지합니다. 배경을 굴절시키거나 왜곡하지 않으며 기존 그림자 토큰을 사용합니다.

투명도 줄이기·강제 색상·효과 미지원 환경에서는 불투명한 표면으로 대체합니다. 배경을 어둡게 하는 모달의 유리 표현에는 `:has()`도 필요하며, 미지원 시 불투명 패널과 일반 배경을 사용합니다. 테마 색상·선택·오류·초점·비활성 상태와 글자 불투명도는 기존 계약을 유지합니다. 사용자 테마의 실제 합성 배경에서 대비를 확인하세요. 도우미가 반투명하거나 대비가 낮은 사용자 색상을 교정하지는 않습니다.

## 합성

반환값에는 `className`, `style`, `ref`, 이벤트 핸들러가 없습니다. 일반 속성이나 `stylex.props()` 앞뒤에 펼쳐도 해당 스타일을 바꾸지 않습니다. 같은 데이터 속성을 두 번 지정하면 JavaScript 펼침 순서를 따릅니다. StyleX 합성 예제에는 앱의 기존 컴파일러가 필요하지만 도우미 자체에는 필요하지 않습니다.

## 범위와 포털

포털의 메뉴·대화상자·알림을 포함해 문서 전체에 적용하려면 `html`에 지정합니다. 국소적인 `surface.props({ mode: "solid" })`는 DOM 자손의 재질을 바꿉니다. 속성만으로 일반 `div`나 `section`을 칠하지 않으며 범위 밖에 마운트되는 포털에는 적용되지 않습니다.

`data-bolerish-surface="solid"`와 `"glass"` 직접 지정도 지원합니다. 설정 상태·저장·색 모드는 앱에서 관리합니다. [테마](/docs/theming/ko)를 참고하세요.

## 콘텐츠 배경

앱 소유 배경에 [Gradient](/docs/api/gradient/ko)를 사용하고 필요한 경우 유리 범위 안에 `Card variant="translucent"`를 배치합니다. 편집 영역은 불투명하게 유지하고 실제 배경에서 글자·경계·초점의 대비를 확인하세요.

## Liquid에서 이전하기

`Liquid`·`LiquidProps`, `@bolerish/ui/liquid` 진입점과 `liquid` 표면 모드를 제거했습니다. 공유 유리 표면은 `surface.props({ mode: "glass" })`로 선택합니다. 직접 관리하던 장식 배경은 Gradient를 적용한 앱 배경과 필요한 경우 `Card variant="translucent"`로 구성합니다. 반투명 표면은 유지하지만 굴절은 제공하지 않습니다. 별도 Glass 컴포넌트는 없습니다.

앱에 저장한 값과 직접 지정한 데이터 속성을 `liquid`에서 `glass`로 옮기세요. 문서 사이트는 자신의 옛 설정과 URL만 이관하며 npm 패키지는 앱의 저장 데이터를 이관하지 않습니다. 옛 `liquid` 데이터 속성에는 지원되는 선택자가 없으며 상위 유리 범위를 초기화하지 않습니다.

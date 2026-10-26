# Surface

설치한 컴포넌트의 Solid·Liquid 재질을 한 곳에서 선택합니다. Provider·래퍼·소비 앱의 StyleX 컴파일러는 필요하지 않습니다. `@bolerish/ui` 스타일시트를 먼저 불러옵니다.

```tsx
import { surface } from "@bolerish/ui/surface";
import { themeClassNames } from "@bolerish/ui/theme";

<html className={themeClassNames.dark} {...surface.props({ mode: "liquid" })} />;
```

## `surface.props(options)`

| 인자           | 타입                  | 필수 여부 / 기본값 | 의미                                  |
| -------------- | --------------------- | ------------------ | ------------------------------------- |
| `options.mode` | `"solid" \| "liquid"` | 필수; 기본값 없음  | 불투명 또는 반투명 재질을 선택합니다. |

반환 타입 `SurfaceProps`는 `{ "data-bolerish-surface": "solid" | "liquid" }`이며 옵션 타입은 `SurfaceOptions`로 내보냅니다. `@bolerish/ui`와 `@bolerish/ui/surface`에서 가져올 수 있습니다. 모드가 없거나 지원하지 않는 값이면 `TypeError`를 던집니다.

Solid는 불투명 표면을 사용합니다. Liquid는 표면 역할에 맞는 투명도·블러·얕은 그림자를 사용합니다. Chromium에서는 패키지의 SVG 필터로 기존 재질 표면 뒤의 실제 배경을 굴절시킵니다. Liquid 컴포넌트나 런타임 등록은 필요하지 않으며 Safari·Firefox는 블러 표현을 유지합니다. 테마 색상과 선택·오류·비활성 상태, 글자의 불투명도는 각자의 규칙을 유지합니다. 투명도 줄이기·강제 색상·효과 미지원 환경에서는 불투명한 대체 표현을 사용합니다.

## 합성

결과에 `className`·`style`·`ref`·이벤트 핸들러가 없습니다. 일반 DOM 속성이나 `stylex.props()`의 앞뒤에 펼쳐도 스타일을 덮어쓰지 않습니다.

```tsx
<html {...stylex.props(theme, styles.root)} {...surface.props({ mode: "liquid" })} />
```

선택적인 StyleX 예제에는 앱의 기존 컴파일러가 필요합니다. 헬퍼 자체는 미리 컴파일되어 별도 설정 없이 쓸 수 있습니다. 같은 데이터 속성을 두 번 지정하면 일반 JavaScript 펼침 순서를 따릅니다.

## 범위와 포털

문서 전체에 적용할 때는 `html`에 지정합니다. 포털로 렌더하는 메뉴·대화상자·알림도 같은 설정을 받습니다. 하위 영역에서 재질을 바꿀 수도 있습니다.

```tsx
<section {...surface.props({ mode: "solid" })}>
  <Card>Opaque reading surface</Card>
</section>
```

이 속성은 재질을 지원하는 컴포넌트의 표현을 선택하며 일반 `div`나 `section`을 자동으로 채우지는 않습니다. 특정 하위 영역의 속성은 그 DOM 밖에 마운트한 포털에 전달되지 않습니다. 문서 전체를 일관되게 바꾸려면 `html`에 적용합니다.

헬퍼는 속성만 반환하며 DOM 변경·설정 저장·색상 모드 동기화를 수행하지 않습니다. 상태와 저장은 앱이 관리합니다. 앱 설정은 [Theming](/docs/theming/ko)을 참고하세요.

## Gradient와 굴절

콘텐츠 색상 배경은 [Gradient](/docs/api/gradient/ko)를 사용합니다. 공유 SVG는 약한 고정 굴절 지도를 각 표면 크기에 맞춰 늘립니다. 개별 모서리 형태를 추적하거나 페이지를 촬영하지 않습니다. 패키지 CSS를 처리할 때 참조한 `liquid-refraction.svg` 파일도 함께 제공해야 합니다. 브라우저에 관계없이 지정한 장식 배경에 크기·모서리에 맞춘 굴절을 적용하려면 배경 레이어·SVG 필터·크기 관측을 관리하는 선택적 [Liquid 컴포넌트](/docs/components/liquid/ko)를 사용합니다.

기존 `data-bolerish-surface="solid"`·`"liquid"` 직접 지정도 계속 지원합니다. `surface.props()`는 같은 동작을 타입이 있는 API로 제공합니다.

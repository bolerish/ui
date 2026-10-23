## StyleX 합성

StyleX를 사용한다면 `stylex.props()`로 변환하기 전의 스타일을 전달합니다.

```tsx
<div {...gradient.props({ colors }, styles.layout, styles.width(640))} />
```

헬퍼 내부에서 `stylex.props(gradientStyles, ...styles)`를 한 번 호출합니다. 기본 그라디언트 뒤에 소비자 스타일을 배치하므로 동일 속성은 뒤쪽 스타일이 우선합니다. 조건부 스타일·배열·동적 CSS 변수도 StyleX가 처리합니다. 축약 속성과 세부 속성의 관계는 앱의 StyleX 설정을 따릅니다. 별도의 클래스 연결이나 인라인 스타일 병합 규칙을 추가하지 않습니다.

이미 변환한 `stylex.props()` 결과나 일반 React `className`·`style` 객체를 인자로 전달하지 않습니다. `{...stylex.props(...)} {...gradient.props(...)}`처럼 따로 펼치면 JavaScript의 뒤쪽 속성이 앞의 `className`과 `style`을 덮어씁니다. 합성한 결과만 한 번 펼치세요. 일반 CSS를 쓰는 앱은 헬퍼 결과를 그대로 적용하고 필요한 레이아웃을 CSS로 지정할 수 있습니다. 동일 속성의 외부 CSS 재정의는 일반 CSS 우선순위를 따릅니다.

## API 참조

### `gradient.props(options, ...styles)`

| 인자             | 타입                        | 필수 여부 / 기본값 | 설명                                                                           |
| ---------------- | --------------------------- | ------------------ | ------------------------------------------------------------------------------ |
| `options.colors` | `readonly [string, string]` | 필수; 기본값 없음  | 왼쪽 위 강조색 `colors[0]`·오른쪽 위 보조색 `colors[1]` 순서의 CSS 색상 두 개. |
| `...styles`      | `stylex.StyleXStyles[]`     | 선택; 기본값 없음  | 배경 스타일 뒤에 합성할 StyleX 원본 스타일.                                    |

반환 타입 `GradientProps`는 `ReturnType<typeof stylex.props>`이며, 기존 요소 하나에 펼칠 `className`과 동적 `style` 속성을 담습니다. 색상 옵션의 타입은 `GradientOptions`로 내보냅니다.

색상이 없거나 두 개가 아닌 경우, 문자열이 아니거나 빈 문자열인 경우 `TypeError`를 던집니다. CSS 색상 문법의 유효성은 브라우저가 판단합니다.

## 테마와 대체 표면

내부 배경은 의미 토큰 `bgCanvas`를 따라 라이트·다크에 대응합니다. 기본 배경은 적용한 요소의 전체 크기를 기준으로 그립니다. 긴 `body`에서는 페이드도 문서 높이를 기준으로 이어집니다. 요소의 크기·배치·스크롤 위치는 바꾸지 않습니다.

CSS 색상 혼합을 지원하지 않거나 투명도 줄이기·강제 색상 모드일 때는 그라디언트를 제거하고 불투명한 캔버스·시스템 배경을 사용합니다. 색상 추출이나 임의 색상의 텍스트 대비를 자동 계산하지는 않습니다. 소비 앱이 콘텐츠 색상을 선택하고 실제 배경에서 대비를 확인해야 합니다.

별도 Gradient 래퍼 컴포넌트는 제공하지 않습니다. 앨범 색상 추출과 곡 데이터는 소비 앱이 관리합니다. 의미 색상과 표면 기준은 [Color](/docs/foundations/color)를 참고하세요.

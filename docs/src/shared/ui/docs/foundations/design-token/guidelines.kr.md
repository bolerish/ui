# 디자인 토큰

같은 역할에 같은 토큰을 쓰면 화면마다 색상과 간격을 다시 정하지 않아도 됩니다. 값을 직접 복사하는 대신 역할을 이름으로 남겨, 화면을 수정할 때 무엇을 유지해야 하는지 알 수 있습니다.

## 선택 기준

### 사용할 때

색상·글꼴·간격·모서리·그림자·조작 크기·모션을 정할 때 사용합니다. 컴포넌트에 이미 `size`나 `variant`가 있다면 그 속성을 먼저 사용합니다.

| 역할                              | 토큰 그룹                               |
| --------------------------------- | --------------------------------------- |
| 표면·텍스트·경계·상태             | `colorVars`                             |
| 요소 사이 거리·내부 여백          | `spacingVars`                           |
| 컨트롤·아이콘·콘텐츠 폭·터치 영역 | `sizeVars`                              |
| 글꼴·글자 크기·굵기·줄 높이       | `typo`                                  |
| 모서리·그림자·겹침 순서           | `radiusVars`, `shadowVars`, `layerVars` |
| 시간·가감속·비활성 투명도         | `motionVars`, `opacityVars`             |

새 화면에는 역할을 이름으로 나타낸 의미 토큰을 사용합니다. 기존 토큰으로 표현할 수 없는 값은 해당 화면에서만 사용합니다. 여러 화면에서 같은 용도로 쓰이는지 확인한 뒤 공통 토큰으로 추가합니다.

## 적용 예시

### 컴포넌트부터 선택하기

저장 버튼의 크기를 바꿀 때는 `Button`의 `size`를 먼저 선택합니다. 새 패널의 내부 여백처럼 컴포넌트가 정하지 않은 부분에 토큰을 적용합니다. 이렇게 하면 버튼 내부의 글자·높이·간격 조합을 화면마다 다시 맞출 필요가 없습니다.

### 구현 예시

패널의 배경·본문 색상과 내부 여백을 각각의 역할에 맞는 토큰으로 지정합니다.

```tsx
import * as stylex from "@stylexjs/stylex";
import { colorVars, spacingVars } from "@/styles/tokens/semantic.stylex";

const styles = stylex.create({
  panel: {
    backgroundColor: colorVars.bgSurface,
    color: colorVars.fgPrimary,
    padding: spacingVars.space6,
  },
});
```

사용자 정의 StyleX 스타일은 `@bolerish/tokens`를 참조하고 앱의 StyleX 컴파일러를 설정합니다. 화면을 작성하기 전에 실제 토큰 파일에서 이름을 확인하고 존재하지 않는 토큰을 만들지 않습니다.

## 토큰 값과 예시

각 주제에서 사용 기준과 실제 값을 함께 확인합니다. [Color](/docs/foundations/color), [Typography](/docs/foundations/typography), [Spacing](/docs/foundations/spacing), [Layout](/docs/foundations/layout), [Radius](/docs/foundations/radius), [Elevation](/docs/foundations/elevation), [State](/docs/foundations/state), [Motion](/docs/foundations/motion).

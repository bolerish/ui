# 모션

변화의 시작과 끝을 연결하면 사용자는 무엇이 바뀌었는지 놓치지 않고 작업을 이어 갈 수 있습니다. 작은 입력 반응과 큰 표면 전환을 구분해 움직임의 시간과 가감속을 선택합니다.

## 선택 기준

| 사용 상황                          | 권장 선택                                                 | 적용 코드                                       |
| ---------------------------------- | --------------------------------------------------------- | ----------------------------------------------- |
| 호버·누름 같은 작은 변화           | `motionVars.durationFast`                                 | `transitionDuration: motionVars.durationFast`   |
| 표면과 일반 상태 전환              | `motionVars.durationNormal`                               | `transitionDuration: motionVars.durationNormal` |
| `Dialog`·`Drawer`처럼 큰 영역 변화 | `motionVars.durationSlow`                                 | `transitionDuration: motionVars.durationSlow`   |
| 반복 로딩                          | `durationLoading`, 모션 줄임에는 `durationLoadingReduced` | `animationDuration: motionVars.durationLoading` |

일반적인 상태 변화에는 `easingStandard`, 요소의 등장과 퇴장에는 각각 `easingEnter`와 `easingExit`를 사용합니다. 컴포넌트의 기존 모션 속성과 미디어 쿼리를 우선 유지합니다.

### 모션 줄임

사용자의 `prefers-reduced-motion` 설정에 맞춰 움직임을 줄입니다. 회전이나 이동을 줄여도 진행 중이라는 텍스트와 상태는 남깁니다. OS 설정을 덮어쓰는 동작은 최종 사용자의 명시적인 런타임 선택에만 적용합니다.

> 단순한 강조를 위해 반복 애니메이션을 붙이지 않습니다. 크기 변환 때문에 텍스트와 테두리가 흐려지면 이동·영역 크기·불투명도 등 더 적절한 표현을 검토합니다. 로딩이 끝난 뒤 장식 애니메이션을 기다리게 하지 않습니다.

## 적용 예시

### 패널을 열고 닫을 때

패널이 나타날 때는 `easingEnter`, 사라질 때는 `easingExit`를 검토합니다. 버튼의 짧은 색상 변화에는 `durationFast`를 사용합니다. 움직임을 줄인 환경에서도 열린 패널과 처리 중 상태는 분명하게 보여야 합니다.

## 앱 기본값과 실제 사용자 선택

`@bolerish/ui` 스타일시트를 로드하면 기본적으로 OS의 움직임 줄이기 설정을 따릅니다.
앱의 `html`에 `data-bolerish-motion`을 지정해 `system`, `on`, `off`를 선택합니다.
사용자가 명시적으로 선택한 `on`만 OS 설정을 덮어씁니다. 속성을 제거하면 OS 설정을
따릅니다. 앱은 설정 화면과 저장을 담당하며 개발자 기본값으로 `on`을 적용하지 않습니다.

```ts
import type { MotionPreference } from "@bolerish/ui";

function setMotionPreference(preference: MotionPreference) {
  document.documentElement.dataset.bolerishMotion = preference;
}
```

처리 중 문구와 열린 상태는 계속 표시하고 JavaScript 스크롤·View Transition에도
같은 결정을 사용합니다.

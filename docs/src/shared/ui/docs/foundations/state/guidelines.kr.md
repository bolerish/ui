# 상태

조작 가능 여부와 지속되는 선택을 구별하면 사용자는 지금 할 수 있는 행동과 이미 정한 값을 혼동하지 않습니다. 입력에 대한 순간적인 반응, 선택, 요청 결과를 나누어 표현합니다.

## 선택 기준

| 사용 상황                     | 권장 선택                                                          | 적용 코드                                               |
| ----------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| 포인터를 올림                 | `interactionHover`, 채워진 행동 버튼은 `interactionSolidHover`     | `backgroundColor: colorVars.interactionHover`           |
| 누르는 동안                   | `interactionPressed`, 채워진 행동 버튼은 `interactionSolidPressed` | `backgroundColor: colorVars.interactionPressed`         |
| 키보드로 조작할 위치를 표시함 | `strokeFocus`와 초점 테두리                                        | `outlineColor: colorVars.strokeFocus`                   |
| 선택한 항목을 계속 표시함     | `bgSelected`와 선택 표시                                           | `backgroundColor: colorVars.bgSelected`                 |
| 현재 조건에서 조작할 수 없음  | `fgDisabled`와 컨트롤의 `disabled`                                 | `color: colorVars.fgDisabled`                           |
| 요청 대기                     | 처리 중 문구와 `Spinner`                                           | `<Spinner />`                                           |
| 입력값을 고쳐야 함            | `FieldError`와 입력 가까운 설명                                    | `<FieldError>Enter a valid email address.</FieldError>` |

`interactionPressed`는 누르는 동안만 적용합니다. `bgSelected`는 평평한 선택 영역, `interactionSelected`는 묶음 안의 떠 있는 선택 면에 사용합니다. 하나로 합치면 선택 여부와 입력 반응이 혼동됩니다.

### 구현 기준

컴포넌트의 `disabled`, `checked`, `aria-invalid` 등 의미가 있는 속성을 먼저 사용합니다. 비활성 상태는 모양뿐 아니라 실제 조작에도 적용합니다. 로딩 중에는 중복 제출을 막되 어떤 작업이 진행 중인지 알려줍니다.

초점 테두리는 색상과 함께 `outlineStyle`, `outlineWidth`, `outlineOffset`도 지정합니다. 선택은 `checked`나 `aria-pressed`로, 처리 중인 영역은 `aria-busy`로 연결합니다. 입력 오류는 `aria-invalid`와 오류 설명의 ID를 `aria-describedby`로 연결합니다.

> 기본·호버·누름·초점·비활성 상태를 라이트·다크 모드에서 확인합니다. 선택된 요소에 초점이 놓인 상태도 확인합니다. 사용할 수 없는 이유를 알아야 다음 행동을 정할 수 있다면 해당 요소 가까이에 설명합니다.

### 상태와 결과 색상

`interaction*` 토큰은 호버·누름·선택·비활성 상태를 표현합니다. 반투명 색은 기존 배경 위에 겹쳐 사용하며, `interactionSolid*`는 채워진 행동 버튼의 배경에 사용합니다.

`bgFeedback*`, `fgFeedback*`, `strokeFeedback*`는 정보·성공·경고·오류의 배경·본문·경계를 각각 표현합니다. 누름 상태와 작업 결과는 서로 다른 의미이므로 같은 색상 역할로 합치지 않습니다.

## 적용 예시

### 선택한 항목에 다시 초점이 왔을 때

항목을 선택한 뒤 Tab으로 다시 이동해도 선택 표시는 남아 있어야 합니다. 초점 표시는 그 위에 현재 조작 위치를 더합니다. 누르는 동안의 색만 선택에 사용하면 손을 뗀 뒤 어떤 값이 남았는지 알기 어렵습니다.

### 상태 스타일 적용하기

일반 행동에는 `Button`, 유지되는 선택에는 `Toggle`을 먼저 사용합니다. 아래 코드는 새 컨트롤을 만드는 경우를 위해 스타일 속성과 상태의 연결을 보여 줍니다. **Pin project**에 포인터를 올리고 누른 뒤 놓아 보세요. 선택 배경·경계·체크 표시는 남고 누름 레이어만 사라집니다. Tab으로 이동하면 선택 상태 위에 초점 표시가 더해집니다.

> 호버·누름 색상은 반투명 레이어입니다. 아래 예제는 `bgSubtle` 위에 선택 배경과 호버·누름 레이어를 겹치며, 선택에 경계와 체크 표시도 더합니다. 채워진 주요 행동 배경에서는 `interactionSolidHover`·`interactionSolidPressed`를 사용합니다. 색상만으로 HTML 상태나 조작 동작이 생기지는 않습니다.

## 역할별 조합 계약

토큰은 색상 취향이 아니라 아래 역할로 고릅니다. 같은 색상 값을 쓰더라도 선택과
드롭 대상은 별도 역할입니다. `interactionSelected`는 묶음 안의 선택 면을 나타냅니다.

| 역할                      | 배경                  | 전경·경계                                            | 함께 제공할 표시                                   |
| ------------------------- | --------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| 일반 콘텐츠               | `bgSurface`           | `fgPrimary`, 필요할 때 `strokeDefault`               | 제목과 콘텐츠 구조                                 |
| 약한 묶음                 | `bgSubtle`            | `fgPrimary`·`fgSecondary`, 필요할 때 `strokeDefault` | 그룹 이름; 선택 의미 없음                          |
| 떠 있는 팝업              | `bgRaised`            | `fgPrimary`, `strokeDefault`                         | `shadowVars.floating`; 위치·포커스는 컴포넌트 책임 |
| 평평한 선택 영역          | `bgSelected`          | `fgPrimary`, 필요할 때 `strokeStrong`                | 체크 또는 선택 경계와 해당 컨트롤의 선택 상태      |
| 묶음 안의 떠 있는 선택 면 | `interactionSelected` | `fgPrimary`, `shadowVars.subtle`                     | `bgSubtle` 컨테이너 안에서 사용                    |
| 드롭을 받을 영역          | `bgDropTarget`        | `fgPrimary`, `strokeDropIndicator` 경계              | “이 폴더로 이동”처럼 결과를 설명                   |
| 정확한 삽입 위치          | 배경 없음             | `strokeDropIndicator`, `sizeVars.focusRing` 두께     | 선과 “항목 앞에 이동” 설명                         |

Tabs의 `segmented`와 Toggle Group의 `soft`는 같은 선택 면 색상을 사용합니다.
`segmented`는 그림자로 높이를 더하고, `soft`는 배경으로 선택을 표시합니다.
Tabs는 연결된 패널을 전환하고 Toggle Group은 값을 선택합니다. 스타일을 공유해도
역할과 키보드 동작을 서로 바꾸지 않습니다. 단독 Toggle의 `soft`는 `bgSelected`를
사용하며, `outline` Toggle만 선택 경계를 유지합니다.

### 상태가 겹칠 때

1. 선택 배경과 선택 표시는 호버·누름 이후에도 남깁니다.
2. 호버·누름은 배경을 교체하지 않고 반투명 레이어로 더합니다. 누름이 호버보다 우선합니다.
3. 포커스는 별도 외곽선으로 표시합니다. 입력 오류의 테두리나 선택 표시를 지우지 않습니다.
4. 비활성은 입력과 호버·누름 반응을 막지만 저장된 선택을 지우지 않습니다.
   글자는 `fgDisabled`를 쓰고 전체 불투명도를 다시 낮추지 않습니다.
5. 드롭 불가는 드롭 가능 표시와 삽입선을 제거합니다. 오류 문구와 금지 표시를 함께
   제공하고 앱도 실제 이동을 거부합니다. 색상만 바꿔서는 드롭을 막을 수 없습니다.

### 드래그 상태

원래 위치는 공간과 이름을 유지하고 점선 `strokeDefault`와 “이동 중” 문구로 표시합니다.
드롭 가능 영역은 면으로, 드롭 예정 위치는 선으로 구분합니다. 원래 위치를 포커스
색으로 칠하거나 모든 드롭 가능 영역에 삽입선을 표시하지 않습니다.

@bolerish/ui는 드래그 판정·정렬·저장을 처리하지 않습니다. 앱이 유효한 대상과 위치를 결정하고
위 역할을 적용합니다. 키보드와 터치 사용자가 드래그 없이 같은 이동을 할 수 있는
버튼이나 메뉴를 제공하고, 취소·완료 시 임시 표시를 제거합니다.

아래 예제는 실제 목록 이동과 동일한 “앞에 이동” 버튼을 제공합니다. 외부 파일과
목록 밖의 드래그는 받지 않으며, 원래 항목에 놓으면 순서가 바뀌지 않습니다.

주요 버튼은 모노크롬 호버에 `bgActionPrimaryHover`를 사용합니다. Segmented Tabs는 선택 면에 약한 `strokeDefault` 경계와 그림자를 사용하고, soft Toggle Group은 배경으로 선택을 표시합니다.

기본·soft Toggle과 Toggle Group은 선택 배경을 사용하고 클릭으로 테두리를 추가하지 않습니다. outline 변형은 선택 경계를 유지합니다. segmented Tabs의 선택 면은 약한 strokeDefault 경계와 subtle 그림자를 사용합니다. 키보드 초점은 선택 표시와 독립적으로 유지합니다.

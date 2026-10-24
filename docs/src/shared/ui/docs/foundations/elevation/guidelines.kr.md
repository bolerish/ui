# 깊이와 겹침 순서

떠 있는 메뉴와 배경의 관계를 드러내면 사용자가 현재 조작할 영역을 쉽게 찾을 수 있습니다. 그림자는 표면의 깊이를, 레이어는 앞뒤 순서를 담당하므로 두 역할을 나누어 선택합니다.

## 선택 기준

| 사용 상황                | 권장 선택                                    | 적용 코드                        |
| ------------------------ | -------------------------------------------- | -------------------------------- |
| 같은 면의 묶음           | 여백·경계선, 필요할 때 `shadowVars.subtle`   | `boxShadow: shadowVars.subtle`   |
| 작은 떠 있는 메뉴·팝오버 | `shadowVars.floating`                        | `boxShadow: shadowVars.floating` |
| 모달 표면                | `shadowVars.overlay`                         | `boxShadow: shadowVars.overlay`  |
| 모달 배경과 내용         | `layerVars.modalBackdrop`, `layerVars.modal` | `zIndex: layerVars.modal`        |
| 팝업·알림                | `layerVars.popup`, `layerVars.notification`  | `zIndex: layerVars.popup`        |

컴포넌트가 관리하는 포털과 레이어를 먼저 사용합니다. 메뉴가 가려진다고 임의로 `z-index: 9999`를 추가하지 말고 부모 요소의 쌓임 맥락(stacking context)과 포털 위치를 확인합니다.

## 적용 예시

### 메뉴와 확인 창 구분하기

행의 추가 행동은 Dropdown Menu로 짧게 펼칩니다. 삭제 전에 결과를 확인해야 한다면 Alert `Dialog`로 결정을 받습니다. 둘 다 위에 떠 있지만, 작업을 계속할 수 있는 범위와 초점 관리는 다릅니다.

> 그림자는 모달의 초점 관리나 배경 조작 차단을 대신하지 않습니다.

> 라이트·다크 모드의 경계와 그림자를 모두 확인합니다. Toast를 쌓을 때 글자와 테두리까지 축소해 흐려지게 만들지 않습니다. 새로운 레이어 역할이 필요하면 기존 순서와 상호작용을 먼저 문서화합니다.

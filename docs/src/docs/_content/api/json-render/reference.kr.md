# JSON Render

`@bolerish/json-render`는 json-render 0.23.1과 React 19.2.3 이상인 React 19를 위한 초기 카탈로그와 React 연결을 제공해요. 컴포넌트를 하나씩 매핑하지 않아도 돼요. bolerish v2를 향한 첫 검증 단계이며, 전체 컴포넌트를 지원하는 단계는 아니에요.

## 설치와 책임

`@bolerish/json-render`, `@bolerish/ui`, `@json-render/core@0.23.1`, `@json-render/react@0.23.1`, React와 React DOM을 설치하세요. 기존 UI 설치 안내에 따라 `@bolerish/ui/global.css`를 한 번 가져오세요. 소비자에게 StyleX 컴파일러를 요구하지 않아요.

서버에서도 사용할 수 있는 `@bolerish/json-render/catalog`에서 `bolerishCatalog`, `bolerishComponentDefinitions`, `parseBolerishSpec`를 가져오세요. 클라이언트에서는 패키지 루트의 `bolerishRegistry` 또는 `bolerishComponents`를 사용해요. json-render의 `JSONUIProvider`와 `Renderer`를 그대로 사용하세요. 앱 액션을 추가한 카탈로그에도 제공된 컴포넌트 매핑을 사용할 수 있어요.

## 지원 계약

첫 카탈로그는 Card, FieldGroup, Heading, Paragraph, Input, Switch, Button을 지원해요. Input과 Switch에는 레이블과 설명이 포함돼요. Input의 오류 메시지는 앱이 제공해요. Button은 `press`, Input은 `change`와 `blur`, Switch는 `change` 이벤트를 내보내요.

`parseBolerishSpec(value, state)`는 카탈로그에 따라 하나의 트리와 초기 상태로 계산한 속성을 검사하고 이벤트 연결을 보존해요. 일반 값, `$state` 읽기, Input.value와 Switch.checked의 `$bindState` 쓰기를 지원해요. 추가 속성, 알 수 없는 컴포넌트, 누락된 참조, 순환, 자식 공유, 루트 밖 요소를 거부해요. 초기 한도는 요소 200개와 깊이 30단계예요. 조건부·반복 요소, 이름 있는 슬롯, 임의 CSS·HTML·실행 코드는 지원하지 않아요.

앱은 상태 저장소를 소유하고, 계산된 속성이 카탈로그 타입을 유지하도록 관리해요. 렌더링 전에 앱 액션 이름도 확인하세요. 업무 검증·권한·요청·중복 실행 방지·재시도는 앱 핸들러가 담당해요. JSON 검증이 액션 실행 권한을 보장하지는 않아요. 비밀값을 UI 상태에 넣지 마세요. 명세를 받는 경계에서 검사하고, 교체할 때는 새 프로바이더 세션을 시작하세요.

## 편집하고 실행하기

준비된 JSON과 로컬 저장 시뮬레이션을 사용하는 예제예요. AI 호출이나 실제 데이터 저장은 하지 않아요. 레이블을 바꿔 적용한 뒤 이메일을 입력하고 저장해보세요. “Fail next save”로 실패 후 복구를 확인할 수 있어요. 잘못된 JSON은 이전 화면을 보존해요. 정상 JSON을 적용하면 미리보기 상태를 초기화해요.

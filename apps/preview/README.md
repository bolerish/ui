# 로컬 시안 미리보기

에이전트가 `drafts/*.json`을 작성·수정하고, 사용자는 브라우저에서 실제 디자인 시스템 컴포넌트를 확인해요.

저장소 루트에서 실행하세요.

```sh
pnpm dev:preview
```

`http://127.0.0.1:3010`에서 시안을 선택하세요. 파일 추가·수정·삭제는 자동 반영돼요. JSON이나 속성에 오류가 있으면 시안 대신 오류를 표시하고, 파일을 고치면 다시 렌더링해요. 선택한 파일이 바뀌면 입력 상태를 초기화하고, 너비·테마 변경과 다른 파일의 갱신은 현재 입력값을 유지해요.

너비는 실제 프레임의 뷰포트를 바꿔요. 작업 영역보다 넓은 프레임은 미리보기 영역 안에서 가로로 스크롤할 수 있어요. 테마는 연결한 디자인 시스템이 지원하는 항목만 표시해요.

## JSON 작성

```json
{
  "designSystem": "bolerish",
  "state": { "name": "Ada" },
  "spec": {
    "root": "name",
    "elements": {
      "name": {
        "type": "Input",
        "props": {
          "label": "이름",
          "value": { "$bindState": "/name" }
        }
      }
    }
  }
}
```

`designSystem`은 연결 이름, `state`는 시안용 예시 데이터, `spec`은 해당 시스템의 json-render 명세예요. 상태를 생략하면 빈 객체를 사용해요. 지원 컴포넌트·속성·명세 제한은 [bolerish 연결 패키지](../../packages/json-render/README.md)를 참고하세요.

`example: "profile-settings"`는 앱에 정의된 저장 시뮬레이션을 연결해요. `profile-settings.json`에서 입력 검증·저장 대기·실패·재시도를 확인할 수 있어요. 실제 서버에 데이터를 보내거나 저장하지 않아요. JSON에 함수나 요청 주소를 넣지 않아요.

## 다른 디자인 시스템 연결

`src/design-systems/index.ts`에 표시 이름·지원 테마·정적 `load()`를 추가하고, `PreviewAdapter` 계약에 맞는 모듈을 연결하세요. 각 연결은 자신의 카탈로그·레지스트리·명세 검사·예제 액션·테마를 소유해요. CSS는 연결 모듈에서 가져오세요. 디자인 시스템이 바뀌면 프레임을 새로 만들어 이전 스타일을 제거해요. JSON을 시스템 사이에서 자동 변환하지는 않아요.

앱은 신뢰하는 로컬 소스와 연결 모듈을 실행하는 개발 도구예요. JSON 검증이 임의 코드의 실행을 격리하거나 앱의 권한 검증을 대신하지는 않아요. 시안 데이터에 비밀값을 넣지 마세요.

## 검사

```sh
pnpm --filter @bolerish/preview typecheck
pnpm --filter @bolerish/preview test
pnpm --filter @bolerish/preview build
BROWSER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" pnpm test:preview:browser
```

브라우저 검사는 빌드한 UI·연결 패키지를 사용하는 개발 서버에서 실제 시안 파일 변경을 확인해요. Playwright 브라우저를 설치했다면 `BROWSER_EXECUTABLE_PATH`를 생략할 수 있어요. 테스트 모드에서만 별도 카탈로그·레지스트리를 주입해 다른 DS 연결도 검사해요.

앱 내 AI 채팅·MCP·파일 편집기·드래그 편집·클라우드 저장·협업·데스크톱 패키징은 포함하지 않아요.

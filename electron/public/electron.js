// public/electron.js

// Electron 모듈에서 app과 BrowserWindow 클래스를 비동기로 가져옵니다.
// app: Electron 애플리케이션의 생명주기를 관리합니다.
// BrowserWindow: 새 브라우저 창(애플리케이션 창)을 생성하는 클래스입니다.
const { app, BrowserWindow } = await import("electron");

// Node.js의 내장 모듈인 path를 가져옵니다.
// 파일 및 디렉터리 경로를 다루는 데 사용됩니다.
const path = await import("path");

// electron-is-dev 모듈을 가져와서 현재 애플리케이션이 개발 환경인지 아닌지를 확인합니다.
// isDev는 개발 환경일 경우 true, 그렇지 않으면 false 값을 가집니다.
const isDev = await import("electron-is-dev");

// 애플리케이션의 메인 창을 저장하기 위한 변수입니다.
let mainWindow;

// 새 창을 생성하는 함수입니다.
function createWindow() {
  // BrowserWindow 인스턴스를 생성하면서 창의 크기와 웹 환경 설정을 지정합니다.
  mainWindow = new BrowserWindow({
    width: 1020, // 창의 너비를 900픽셀로 설정합니다.
    height: 680, // 창의 높이를 680픽셀로 설정합니다.
    webPreferences: {
      // 렌더러 프로세스에서 Node.js API 사용을 허용합니다.
      nodeIntegration: true,
      // 원격 모듈 사용을 활성화합니다.
      enableRemoteModule: true,
      // 개발자 도구의 사용 여부를 설정합니다.
      // 개발 환경(isDev가 true)이면 개발자 도구를 활성화합니다.
      devTools: isDev,
    },
    frame: false,
  });

  // ***중요***
  // 개발 환경에서는 로컬 개발 서버(예: Create React App의 개발 서버)의 URL을 로드합니다.
  // 그렇지 않으면, 빌드된 정적 파일(index.html)을 로드합니다.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000" // 개발 서버 URL
      : `file://${path.join(__dirname, "../build/index.html")}` // 빌드 폴더 내 index.html 파일 경로
  );

  // 개발 환경인 경우, 개발자 도구를 별도의 창으로 엽니다.
  if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });

  // 창 크기 조절을 허용합니다.
  mainWindow.setResizable(true);

  // 창이 닫힐 때의 이벤트 처리
  mainWindow.on("closed", () => {
    // 창 객체를 null로 설정하여 메모리에서 해제합니다.
    mainWindow = null;
    // 모든 창이 닫히면 애플리케이션을 종료합니다.
    app.quit();
  });

  // 창에 포커스를 부여하여 활성화시킵니다.
  mainWindow.focus();
}

// Electron 애플리케이션이 준비(ready)되면 createWindow 함수를 호출하여 창을 생성합니다.
app.on("ready", createWindow);

// macOS 환경에서는 Dock 아이콘을 클릭했을 때 창이 없으면 새 창을 생성합니다.
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

// 모든 창이 닫혔을 때의 이벤트 처리
app.on("window-all-closed", () => {
  // macOS가 아닌 플랫폼에서는 모든 창이 닫히면 애플리케이션을 종료합니다.
  if (process.platform !== "darwin") app.quit();
});

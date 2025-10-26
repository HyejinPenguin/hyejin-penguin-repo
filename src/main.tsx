import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';

// ===== 1. TanStack Query 클라이언트 생성 =====
// 데이터 캐싱, 리페칭 등을 관리하는 클라이언트
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 실패 시 1번만 재시도
      refetchOnWindowFocus: false, // 창 포커스 시 자동 리페치 비활성화
    },
  },
});

// ===== 2. MSW 워커 시작 =====
// 개발 환경에서만 MSW(가짜 서버)를 실행
async function enableMocking() {
  // 개발 환경이 아니면 실행하지 않음
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // Service Worker 시작 (브라우저에서 API 요청 가로채기)
  return worker.start({
    onUnhandledRequest: 'bypass', // 등록되지 않은 요청은 그냥 통과
  });
}

// ===== 3. 앱 렌더링 =====
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      {/* QueryClientProvider로 앱 전체를 감싸서 TanStack Query 사용 가능하게 함 */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  );
});

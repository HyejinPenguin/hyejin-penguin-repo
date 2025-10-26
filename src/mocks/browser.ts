// ===== MSW 브라우저 워커 설정 =====
// 브라우저에서 API 요청을 가로채서 가짜 응답을 반환하는 Service Worker 설정
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// MSW 워커 생성 및 핸들러 등록
export const worker = setupWorker(...handlers);

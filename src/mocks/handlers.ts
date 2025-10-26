// ===== MSW 핸들러 통합 파일 =====
// 여러 API의 핸들러를 하나로 모아서 export
import { inventoryHandlers } from './inventoryHandlers';

// 모든 핸들러를 배열로 합쳐서 export
export const handlers = [...inventoryHandlers];

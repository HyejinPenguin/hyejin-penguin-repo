import { http, HttpResponse } from 'msw';
import type { InventoryItem } from '../types/inventory';

// ===== 가짜 데이터베이스 (메모리에 저장) =====
// 실제 서버가 없어도 테스트할 수 있도록 임시 데이터 생성
let mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: '우유',
    category: '음료',
    stock: 10,
    minStock: 2,
  },
  {
    id: '2',
    name: '컵 (90개입)',
    category: '소모품',
    stock: 5,
    minStock: 3,
  },
  {
    id: '3',
    name: '바닐라 시럽',
    category: '원부재료',
    stock: 8,
    minStock: 2,
  },
  {
    id: '4',
    name: '아메리카노 원두',
    category: '음료',
    stock: 15,
    minStock: 5,
  },
  {
    id: '5',
    name: '커피 원두',
    category: '음료',
    stock: 20,
    minStock: 10,
  },
];

// ID 자동 생성을 위한 카운터
let nextId = 5;

// ===== MSW 핸들러 정의 =====
export const inventoryHandlers = [
  // 1. GET /api/v1/inventory - 전체 재고 목록 조회
  http.get('/api/v1/inventory', () => {
    // 모든 재고 데이터를 반환
    return HttpResponse.json(mockInventory);
  }),

  // 2. GET /api/v1/inventory/:id - 단일 재고 상세 조회
  http.get('/api/v1/inventory/:id', ({ params }) => {
    const { id } = params;
    // ID로 재고 찾기
    const item = mockInventory.find((i) => i.id === id);

    if (!item) {
      // 재고를 찾지 못한 경우 404 에러 반환
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(item);
  }),

  // 3. POST /api/v1/inventory - 새 재고 추가
  http.post('/api/v1/inventory', async ({ request }) => {
    // 요청 본문(body)에서 데이터 가져오기
    const newItem = (await request.json()) as Omit<InventoryItem, 'id'>;

    // 새 재고 아이템 생성 (ID 자동 부여)
    const createdItem: InventoryItem = {
      ...newItem,
      id: String(nextId++), // ID를 자동으로 증가시켜 부여
    };

    // 가짜 데이터베이스에 추가
    mockInventory.push(createdItem);

    // 생성된 아이템을 201 상태코드와 함께 반환
    return HttpResponse.json(createdItem, { status: 201 });
  }),

  // 4. PUT /api/v1/inventory/:id - 재고 수정
  http.put('/api/v1/inventory/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Partial<InventoryItem>;

    // 수정할 재고의 인덱스 찾기
    const index = mockInventory.findIndex((i) => i.id === id);

    if (index === -1) {
      // 재고를 찾지 못한 경우 404 에러 반환
      return new HttpResponse(null, { status: 404 });
    }

    // 기존 데이터와 업데이트 데이터 병합
    mockInventory[index] = {
      ...mockInventory[index],
      ...updates,
    };

    // 수정된 아이템 반환
    return HttpResponse.json(mockInventory[index]);
  }),

  // 5. DELETE /api/v1/inventory/:id - 재고 삭제
  http.delete('/api/v1/inventory/:id', ({ params }) => {
    const { id } = params;

    // 삭제할 재고의 인덱스 찾기
    const index = mockInventory.findIndex((i) => i.id === id);

    if (index === -1) {
      // 재고를 찾지 못한 경우 404 에러 반환
      return new HttpResponse(null, { status: 404 });
    }

    // 배열에서 제거
    mockInventory.splice(index, 1);

    // 삭제 성공 시 204 상태코드 반환 (본문 없음)
    return new HttpResponse(null, { status: 204 });
  }),
];

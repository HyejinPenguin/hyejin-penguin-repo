// 카페 재고 아이템의 타입 정의
export interface InventoryItem {
  id: string; // 재고 고유 ID (서버에서 자동 생성)
  name: string; // 상품명 (예: "우유", "컵 90개입", "바닐라 시럽")
  category: string; // 카테고리 (예: "음료", "소모품", "원부재료")
  stock: number; // 현재 재고 수량
  minStock: number; // 최소 재고 기준 (이 수량 이하면 알림)
}

// 새로운 재고를 추가할 때 사용하는 타입 (id 없이)
export interface CreateInventoryItem {
  name: string;
  category: string;
  stock: number;
  minStock: number;
}

// 재고를 수정할 때 사용하는 타입 (모든 필드 선택적)
export interface UpdateInventoryItem {
  name?: string;
  category?: string;
  stock?: number;
  minStock?: number;
}

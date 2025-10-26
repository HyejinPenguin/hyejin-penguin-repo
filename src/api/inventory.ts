import apiClient from '../libs/apiClient';
import type {
  InventoryItem,
  CreateInventoryItem,
  UpdateInventoryItem,
} from '../types/inventory';

// ===== 1. 재고 전체 목록 불러오기 (READ - 전체) =====
// 사용 예: const items = await getInventoryItems();
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const response = await apiClient.get('/inventory');
  return response.data; // 서버에서 받은 재고 목록 배열 반환
};

// ===== 2. 상세 재고 불러오기 (READ - 단일) =====
// 사용 예: const item = await getInventoryItemById("1");
export const getInventoryItemById = async (
  id: string
): Promise<InventoryItem> => {
  const response = await apiClient.get(`/inventory/${id}`);
  return response.data; // 서버에서 받은 단일 재고 데이터 반환
};

// ===== 3. 재고 추가 (CREATE) =====
// 사용 예: await addInventoryItem({ name: "우유", category: "음료", stock: 10, minStock: 2 });
export const addInventoryItem = async (
  item: CreateInventoryItem
): Promise<InventoryItem> => {
  const response = await apiClient.post('/inventory', { data: item });
  return response.data; // 서버에서 생성된 재고 데이터 반환 (id 포함)
};

// ===== 4. 재고 수정 (UPDATE) =====
// 사용 예: await updateInventoryItem("1", { stock: 15 });
export const updateInventoryItem = async (
  id: string,
  item: UpdateInventoryItem
): Promise<InventoryItem> => {
  const response = await apiClient.put(`/inventory/${id}`, { data: item });
  return response.data; // 서버에서 수정된 재고 데이터 반환
};

// ===== 5. 재고 삭제 (DELETE) =====
// 사용 예: await deleteInventoryItem("1");
export const deleteInventoryItem = async (id: string): Promise<void> => {
  await apiClient.delete(`/inventory/${id}`);
  // 삭제는 반환값이 없음 (void)
};

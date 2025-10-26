// ===== TanStack Query Hooks =====
// API 호출을 쉽게 사용할 수 있도록 커스텀 훅 제공
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInventoryItems,
  getInventoryItemById,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../api/inventory';
import type { UpdateInventoryItem } from '../types/inventory';

// ===== 1. 전체 재고 목록 조회 훅 =====
// 사용법: const { data, isLoading, error } = useInventoryItems();
export const useInventoryItems = () => {
  return useQuery({
    queryKey: ['inventory'], // 캐시 키 (이 키로 데이터를 저장/조회)
    queryFn: getInventoryItems, // 실제 API 호출 함수
    staleTime: 1000 * 60 * 5, // 5분간 데이터를 신선하다고 간주 (재요청 안 함)
  });
};

// ===== 2. 단일 재고 상세 조회 훅 =====
// 사용법: const { data, isLoading } = useInventoryItem("1");
export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: ['inventory', id], // 캐시 키에 ID 포함 (각 아이템별로 캐시)
    queryFn: () => getInventoryItemById(id), // ID로 특정 아이템 조회
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
};

// ===== 3. 재고 추가 훅 =====
// 사용법:
// const addMutation = useAddInventoryItem();
// addMutation.mutate({ name: "우유", category: "음료", stock: 10, minStock: 2 });
export const useAddInventoryItem = () => {
  const queryClient = useQueryClient(); // 캐시 관리 클라이언트

  return useMutation({
    mutationFn: addInventoryItem, // 실제 추가 API 호출 함수
    onSuccess: () => {
      // 추가 성공 시 전체 목록 캐시를 무효화 → 자동으로 다시 불러옴
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

// ===== 4. 재고 수정 훅 =====
// 사용법:
// const updateMutation = useUpdateInventoryItem();
// updateMutation.mutate({ id: "1", updates: { stock: 15 } });
export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateInventoryItem;
    }) => updateInventoryItem(id, updates),
    onSuccess: (_data, variables) => {
      // 수정 성공 시 해당 아이템과 전체 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.id] });
    },
  });
};

// ===== 5. 재고 삭제 훅 =====
// 사용법:
// const deleteMutation = useDeleteInventoryItem();
// deleteMutation.mutate("1");
export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventoryItem, // 실제 삭제 API 호출 함수
    onSuccess: () => {
      // 삭제 성공 시 전체 목록 캐시 무효화 → 자동으로 다시 불러옴
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

// ===== 재고 목록 컴포넌트 =====
import { useState } from 'react';
import {
  useInventoryItems,
  useAddInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
} from '../hooks/useInventory';
import type { CreateInventoryItem } from '../types/inventory';

export default function InventoryList() {
  // ===== 1. 데이터 조회 =====
  const { data: items, isLoading, error } = useInventoryItems();

  // ===== 2. CRUD 뮤테이션 훅 =====
  const addMutation = useAddInventoryItem();
  const updateMutation = useUpdateInventoryItem();
  const deleteMutation = useDeleteInventoryItem();

  // ===== 3. 폼 상태 관리 =====
  const [newItem, setNewItem] = useState<CreateInventoryItem>({
    name: '',
    category: '',
    stock: 0,
    minStock: 0,
  });

  // ===== 4. 추가 버튼 핸들러 =====
  const handleAdd = () => {
    // 입력값 검증
    if (!newItem.name || !newItem.category) {
      alert('상품명과 카테고리를 입력해주세요!');
      return;
    }

    // 뮤테이션 실행 (API 호출)
    addMutation.mutate(newItem, {
      onSuccess: () => {
        // 성공 시 폼 초기화
        setNewItem({ name: '', category: '', stock: 0, minStock: 0 });
        alert('재고가 추가되었습니다!');
      },
    });
  };

  // ===== 5. 재고 수량 증가 핸들러 =====
  const handleIncreaseStock = (id: string, currentStock: number) => {
    updateMutation.mutate({
      id,
      updates: { stock: currentStock + 1 }, // 현재 수량 + 1
    });
  };

  // ===== 6. 재고 수량 감소 핸들러 =====
  const handleDecreaseStock = (id: string, currentStock: number) => {
    if (currentStock <= 0) return; // 0 이하로는 내려가지 않음

    updateMutation.mutate({
      id,
      updates: { stock: currentStock - 1 }, // 현재 수량 - 1
    });
  };

  // ===== 7. 삭제 핸들러 =====
  const handleDelete = (id: string, name: string) => {
    // 삭제 확인
    if (!confirm(`"${name}"을(를) 삭제하시겠습니까?`)) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        alert('재고가 삭제되었습니다!');
      },
    });
  };

  // ===== 8. 로딩 상태 =====
  if (isLoading) {
    return <div className="loading">재고 목록을 불러오는 중...</div>;
  }

  // ===== 9. 에러 상태 =====
  if (error) {
    return <div className="error">에러 발생: {error.message}</div>;
  }

  // ===== 10. UI 렌더링 =====
  return (
    <div className="inventory-container">
      <h1>☕ 카페 재고 관리</h1>

      {/* 재고 추가 폼 */}
      <div className="add-form">
        <h2>새 재고 추가</h2>
        <div className="form-row">
          <input
            type="text"
            placeholder="상품명 (예: 우유)"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="카테고리 (예: 음료)"
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="재고 수량"
            value={newItem.stock}
            onChange={(e) =>
              setNewItem({ ...newItem, stock: Number(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="최소 재고"
            value={newItem.minStock}
            onChange={(e) =>
              setNewItem({ ...newItem, minStock: Number(e.target.value) })
            }
          />
          <button onClick={handleAdd} disabled={addMutation.isPending}>
            {addMutation.isPending ? '추가 중...' : '추가'}
          </button>
        </div>
      </div>

      {/* 재고 목록 테이블 */}
      <div className="inventory-list">
        <h2>재고 목록</h2>
        <table>
          <thead>
            <tr>
              <th>상품명</th>
              <th>카테고리</th>
              <th>재고 수량</th>
              <th>최소 재고</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>
                  <div className="stock-controls">
                    <button
                      className="flex-center"
                      onClick={() => handleDecreaseStock(item.id, item.stock)}
                      disabled={updateMutation.isPending}
                    >
                      -
                    </button>
                    <span className="stock-value">{item.stock}</span>
                    <button
                      className="flex-center"
                      onClick={() => handleIncreaseStock(item.id, item.stock)}
                      disabled={updateMutation.isPending}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{item.minStock}</td>
                <td>
                  {item.stock <= item.minStock ? (
                    <span className="status-low">⚠️ 부족</span>
                  ) : (
                    <span className="status-good">✅ 충분</span>
                  )}
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id, item.name)}
                    disabled={deleteMutation.isPending}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

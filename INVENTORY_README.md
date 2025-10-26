# ☕ 카페 재고 관리 시스템 (CRUD 예제)

초보자를 위한 간단한 카페 재고 관리 예제입니다.
**axios**, **MSW**, **TanStack Query**를 사용하여 CRUD 기능을 구현했습니다.

## 📚 사용 기술

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **axios** - HTTP 클라이언트
- **TanStack Query** - 서버 상태 관리
- **MSW (Mock Service Worker)** - API 모킹 (가짜 서버)

## 🗂️ 프로젝트 구조

```
src/
├── types/
│   └── inventory.ts           # 타입 정의
├── api/
│   └── inventory.ts           # API 호출 함수 (axios)
├── hooks/
│   └── useInventory.ts        # TanStack Query 커스텀 훅
├── mocks/
│   ├── browser.ts             # MSW 브라우저 워커
│   ├── handlers.ts            # MSW 핸들러 통합
│   └── inventoryHandlers.ts   # 재고 API 가짜 응답
├── components/
│   ├── InventoryList.tsx      # 재고 목록 UI
│   └── InventoryList.css      # 스타일
└── main.tsx                   # MSW & TanStack Query 설정
```

## 🚀 실행 방법

```bash
# 1. 의존성 설치 (이미 설치됨)
npm install

# 2. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 📖 코드 설명

### 1️⃣ 타입 정의 (`src/types/inventory.ts`)

재고 데이터의 타입을 정의합니다.

```typescript
export interface InventoryItem {
  id: string; // 재고 고유 ID
  name: string; // 상품명
  category: string; // 카테고리
  stock: number; // 현재 재고 수량
  minStock: number; // 최소 재고 기준
}
```

### 2️⃣ API 함수 (`src/api/inventory.ts`)

axios를 사용해 API 호출 함수를 작성합니다.

```typescript
// 전체 목록 조회
export const getInventoryItems = async () => {
  const response = await apiClient.get('/inventory');
  return response.data;
};

// 재고 추가
export const addInventoryItem = async (item: CreateInventoryItem) => {
  const response = await apiClient.post('/inventory', { data: item });
  return response.data;
};
```

### 3️⃣ MSW 핸들러 (`src/mocks/inventoryHandlers.ts`)

실제 서버 없이 가짜 응답을 만듭니다.

```typescript
export const inventoryHandlers = [
  // GET 요청 처리
  http.get('/api/v1/inventory', () => {
    return HttpResponse.json(mockInventory);
  }),

  // POST 요청 처리
  http.post('/api/v1/inventory', async ({ request }) => {
    const newItem = await request.json();
    // ... 데이터 추가 로직
    return HttpResponse.json(createdItem, { status: 201 });
  }),
];
```

### 4️⃣ TanStack Query 훅 (`src/hooks/useInventory.ts`)

데이터 조회와 수정을 쉽게 사용할 수 있는 커스텀 훅입니다.

```typescript
// 조회 훅 (useQuery)
export const useInventoryItems = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: getInventoryItems,
  });
};

// 추가 훅 (useMutation)
export const useAddInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addInventoryItem,
    onSuccess: () => {
      // 성공 시 캐시 무효화 → 자동 리페치
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};
```

### 5️⃣ 컴포넌트 사용 (`src/components/InventoryList.tsx`)

훅을 사용해서 UI를 만듭니다.

```typescript
function InventoryList() {
  // 데이터 조회
  const { data: items, isLoading } = useInventoryItems();

  // 추가 뮤테이션
  const addMutation = useAddInventoryItem();

  // 추가 버튼 클릭
  const handleAdd = () => {
    addMutation.mutate(newItem, {
      onSuccess: () => {
        alert('추가 완료!');
      }
    });
  };

  return (
    <div>
      {items?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## 🎯 주요 기능

### ✅ CRUD 기능

1. **CREATE** - 새 재고 추가
2. **READ** - 재고 목록 조회
3. **UPDATE** - 재고 수량 증가/감소
4. **DELETE** - 재고 삭제

### 💡 주요 개념

#### TanStack Query의 장점

1. **자동 캐싱** - 한 번 조회한 데이터를 저장
2. **자동 리페치** - 데이터가 변경되면 자동으로 다시 불러옴
3. **로딩/에러 상태** - isLoading, error 자동 제공
4. **낙관적 업데이트** - 서버 응답 전에 UI 먼저 업데이트

#### MSW의 장점

1. **백엔드 없이 개발** - 가짜 서버로 프론트엔드 개발 가능
2. **실제 네트워크 요청** - axios 코드를 그대로 사용
3. **쉬운 테스트** - 다양한 시나리오 테스트 가능

## 🔧 커스터마이징

### 재고 속성 추가하기

1. `src/types/inventory.ts`에 새 필드 추가
2. `src/mocks/inventoryHandlers.ts`의 mockInventory 데이터 업데이트
3. `src/components/InventoryList.tsx`의 UI 수정

### 실제 API 연결하기

1. `src/main.tsx`에서 MSW 비활성화
2. `src/libs/apiClient.ts`의 baseURL을 실제 서버 주소로 변경

```typescript
const defaultOptions = {
  baseURL: 'https://your-api.com/api/v1/', // 실제 API 주소
  // ...
};
```

## 📝 학습 포인트

### 초보자가 배울 수 있는 것들

1. **TypeScript 타입 정의** - interface 사용법
2. **비동기 처리** - async/await 패턴
3. **React Hooks** - useState, custom hooks
4. **API 통신** - axios 사용법
5. **상태 관리** - TanStack Query로 서버 상태 관리
6. **모킹** - MSW로 가짜 서버 만들기

## 🐛 문제 해결

### MSW가 작동하지 않을 때

1. 브라우저 콘솔에서 `[MSW] Mocking enabled` 확인
2. `public/mockServiceWorker.js` 파일 존재 확인
3. 브라우저 캐시 삭제 후 새로고침

### 데이터가 업데이트되지 않을 때

1. `queryClient.invalidateQueries()` 호출 확인
2. mutation의 `onSuccess` 콜백 확인
3. React DevTools에서 리렌더링 확인

## 📚 참고 문서

- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [MSW 공식 문서](https://mswjs.io/)
- [axios 공식 문서](https://axios-http.com/)

---

**만든 이유**: 초보 개발자가 실제 프로젝트에서 자주 사용하는 CRUD 패턴을 쉽게 배울 수 있도록!

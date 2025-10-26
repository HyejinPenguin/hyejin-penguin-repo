import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import InventoryList from './components/InventoryList';

function App() {
  return (
    <>
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠: 재고 관리 */}
      <main>
        <InventoryList />
      </main>

      {/* 푸터 */}
      <Footer />
    </>
  );
}

export default App;

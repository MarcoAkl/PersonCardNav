import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { OfflineBanner } from './components/OfflineBanner/OfflineBanner';
import { Directory } from './routes/Directory';
import { PersonDetail } from './routes/PersonDetail';
import { Favorites } from './routes/Favorites';
import { NotFound } from './routes/NotFound';
import { useOfflineCacheSync } from './offline/prefetch';
import styles from './App.module.css';

export default function App() {
  useOfflineCacheSync();

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <OfflineBanner />
      <main id="main-content" className={styles.main}>
        <Routes>
          <Route path="/" element={<Directory />} />
          <Route path="/person/:id" element={<PersonDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

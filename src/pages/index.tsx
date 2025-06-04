import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import Navbar from '../components/Navbar'; // Try absolute import if baseUrl is "src"
import styles from '../styles/HomePage.module.css'; // Import CSS Modules

interface Category {
  id: string;
  name: string;
}

interface HomePageProps {
  categories: Category[];
}

const HomePage: NextPage<HomePageProps> = ({ categories }) => {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <Head>
        <title>Viet Roadmaps - Lộ trình Phong tục Việt</title>
        <meta name="description" content="Khám phá các lộ trình phong tục, lễ nghi truyền thống của Việt Nam theo từng vùng miền." />
        </Head>

        <header className={styles.header}>
          <h1>Roadmaps cho người Việt</h1>
          <h2>Viet Roadmaps - Lộ trình Phong tục Việt</h2>
        </header>

        <main className={styles.mainContent}>
          <h2>Chọn một danh mục để bắt đầu:</h2>
          <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li key={category.id} className={styles.categoryItem}>
                <Link href={`/roadmaps/${category.id}`} className={styles.categoryLink}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </main>

        <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} Viet Roadmaps. Phát triển bởi bạn.</p>
        </footer>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const categoryIds = fs.readdirSync(dataDir).filter(item => 
    fs.statSync(path.join(dataDir, item)).isDirectory()
  );
  const categories = categoryIds.map(id => ({
    id,
    name: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Ví dụ: 'cuoi-hoi' -> 'Cuoi Hoi'
  }));
  return { props: { categories } };
};

export default HomePage;
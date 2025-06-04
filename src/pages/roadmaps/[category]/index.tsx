import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import Navbar from '../../../components/Navbar'; // Import Navbar
import styles from '../../../styles/CategoryPage.module.css'; // Import CSS Modules

interface Region {
  id: string;
  name: string;
}

interface CategoryPageProps {
  category: { id: string; name: string };
  regions: Region[];
}

const CategoryPage: NextPage<CategoryPageProps> = ({ category, regions }) => {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <Head>
          <title>Lộ trình {category.name} - Chọn vùng miền</title>
          <meta name="description" content={`Khám phá các lộ trình phong tục cho ${category.name} theo từng vùng miền.`} />
        </Head>
        <h1 className={styles.pageTitle}>Lộ trình cho {category.name}</h1>
        <p className={styles.pageSubtitle}>Vui lòng chọn vùng miền bạn quan tâm:</p>

        {regions.length > 0 ? (
          <ul className={styles.regionList}>
            {regions.map((region) => (
              <li key={region.id} className={styles.regionItem}>
                <Link href={`/roadmaps/${category.id}/${region.id}`} className={styles.regionLink}>
                  {region.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noRegionsText}>Không có dữ liệu vùng miền cho danh mục này.</p>
        )}
        <div className={styles.backLinkContainer}>
          <Link href="/" className={styles.backLink}>
            &larr; Quay lại trang chủ
          </Link>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const categoryIds = fs.readdirSync(dataDir).filter(item =>
    fs.statSync(path.join(dataDir, item)).isDirectory()
  );
  const paths = categoryIds.map(id => ({ params: { category: id } }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async (context) => {
  const categoryId = context.params?.category as string;
  const categoryPath = path.join(process.cwd(), 'src', 'data', categoryId);
  
  let regionFiles: string[] = [];
  if (fs.existsSync(categoryPath) && fs.statSync(categoryPath).isDirectory()) {
    regionFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.json'));
  }

  const regions = regionFiles.map(file => {
    const regionId = file.replace('.json', '');
    return {
      id: regionId,
      name: regionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // 'mien-bac' -> 'Mien Bac'
    };
  });
  const categoryName = categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return { props: { category: { id: categoryId, name: categoryName }, regions } };
};

export default CategoryPage;
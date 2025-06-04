import dynamic from 'next/dynamic';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import styles from '../../../styles/RoadmapPage.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';

// Dynamically import the Tree component with SSR turned off
const Tree = dynamic(() => import('react-d3-tree'), {
  ssr: false,
  loading: () => <p className={styles.loadingText}>Đang tải lộ trình...</p>, // Optional: display a loading message
});

interface RoadmapNode {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: RoadmapNode[];
  description?: string;
  resources?: Array<{ title: string; url: string }>;
}

interface RoadmapPageProps {
  roadmapData: RoadmapNode;
  category: string;
  region: string;
  pageTitle: string;
}

interface CustomNodeElementProps {
  nodeDatum: RoadmapNode;
  toggleNode: () => void;
}

const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const RoadmapPage: NextPage<RoadmapPageProps> = ({ roadmapData, category, region, pageTitle }) => {
  const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null); // State to hold the selected node
  const treeWrapperRef = useRef<HTMLDivElement>(null);

  const calculateTranslate = useCallback(() => {
    if (treeWrapperRef.current) {
      const { clientWidth, clientHeight } = treeWrapperRef.current;
      setTranslate({
        x: clientWidth / 2,
        y: clientHeight / 2,
      });
    }
  }, []);

  useEffect(() => {
    calculateTranslate();
    window.addEventListener('resize', calculateTranslate);
    return () => window.removeEventListener('resize', calculateTranslate);
  }, [calculateTranslate]);

  // Improved check for roadmapData: ensure it's not null/undefined and has a root name.
  // react-d3-tree requires a root node with at least a 'name' property.
  if (!roadmapData || typeof roadmapData.name !== 'string' || roadmapData.name.trim() === '') {
    return (
      <div className={styles.errorContainerDark}>
        <Navbar />
        <div className={styles.mainContent}>
          <p className={styles.errorMessageDark}>Dữ liệu lộ trình cho {category} - {region} không hợp lệ hoặc bị trống. Vui lòng kiểm tra lại file JSON.</p>
        </div>
      </div>
    );
  }

  // Function to handle node click and set the selected node state
  const handleNodeClick = (node: RoadmapNode) => {
    setSelectedNode(node);
  };

  const renderCustomNodeElement = ({ nodeDatum, toggleNode }: CustomNodeElementProps) => {
    const rectWidth = 220;
    const hasDescription = !!nodeDatum.description;
    const rectHeight = hasDescription ? 70 : 45;
    const textYOffset = hasDescription ? -12 : 0;

    return ( // Add both toggleNode and handleNodeClick to the click handler
      // Use a group element to make the whole node area clickable
      <g onClick={toggleNode} style={{ cursor: 'pointer' }}>
        <rect
          width={rectWidth}
          height={rectHeight}
          x={-rectWidth / 2}
          y={-rectHeight / 2}
          fill="#1f2937"
          stroke={selectedNode?.name === nodeDatum.name ? "#60a5fa" : "#4b5563"} // Highlight selected node
          strokeWidth={selectedNode?.name === nodeDatum.name ? 2.5 : 1.5} // Thicker stroke for selected
          rx={8}
          ry={8}
        />
        <text
          fill="#e5e7eb"
          strokeWidth="0"
          x="0"
          y={textYOffset}
          dy=".35em"
          textAnchor="middle"
          className={styles.nodeName}
        >
          {truncateText(nodeDatum.name, 25)}
        </text>
        {hasDescription && (
          <text
            fill="#9ca3af"
            strokeWidth="0"
            x="0"
            y={textYOffset + 22}
            textAnchor="middle"
            className={styles.nodeDescription}
          >
            {truncateText(nodeDatum.description, 30)}
          </text>
        )}
        {/* Invisible rect for easier clicking */}
        <rect width={rectWidth} height={rectHeight} x={-rectWidth / 2} y={-rectHeight / 2} fill="transparent" />
        {/* Add a separate click handler for selecting the node */}
        <rect width={rectWidth} height={rectHeight} x={-rectWidth / 2} y={-rectHeight / 2} fill="transparent" onClick={() => handleNodeClick(nodeDatum)} style={{ cursor: 'pointer' }} />
      </g>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={`Lộ trình chi tiết cho ${category.replace(/-/g, ' ')} tại vùng ${region.replace(/-/g, ' ')}.`} />
        </Head>

        <section className={styles.heroSection}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>{pageTitle}</h1>
            <p className={styles.heroSubtitle}>
              Khám phá lộ trình chi tiết cho <strong>{category.replace(/-/g, ' ')}</strong> tại vùng <strong>{region.replace(/-/g, ' ')}</strong>.
              Lộ trình này được thiết kế để giúp bạn định hướng và phát triển kỹ năng.
            </p>
          </div>
        </section>

        <div className={styles.treeWrapper} ref={treeWrapperRef}>
          <Tree
            data={roadmapData}
            orientation="vertical"
            pathFunc="elbow"
            collapsible={true}
            initialDepth={1}
            separation={{ siblings: 1.5, nonSiblings: 2 }}
            nodeSize={{ x: 280, y: 180 }}
            translate={translate}
            renderCustomNodeElement={renderCustomNodeElement}
            zoomable={false}
            draggable={false}
          />
        </div>

        {/* Node Details Panel - Displayed when a node is selected */}
        {selectedNode && (
          <div className={styles.nodeDetailsPanel}>
            <h3 className={styles.detailsTitle}>{selectedNode.name}</h3>
            {selectedNode.description && (
              <p className={styles.detailsDescription}>{selectedNode.description}</p>
            )}
            {selectedNode.resources && selectedNode.resources.length > 0 && (
              <div className={styles.resourcesSection}>
                <h4 className={styles.resourcesTitle}>Tài nguyên:</h4>
                <ul className={styles.resourcesList}>
                  {selectedNode.resources.map((resource, index) => (
                    <li key={index} className={styles.resourceItem}>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button className={styles.closeDetailsButton} onClick={() => setSelectedNode(null)}>Đóng</button>
          </div>
        )}

        <div className={styles.backLinksContainerDark}>
          <Link href={`/roadmaps/${category}`} className={styles.backLinkDark}>
            &larr; Quay lại chọn vùng miền ({category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())})
          </Link>
          <Link href="/" className={styles.backLinkDark}>
            &larr; Quay lại trang chủ
          </Link>
        </div>
      </main>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const categories = fs.readdirSync(dataDir).filter(item =>
    fs.statSync(path.join(dataDir, item)).isDirectory()
  );

  const paths = [];

  for (const category of categories) {
    const categoryPath = path.join(dataDir, category);
    const regionFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.json'));
    for (const regionFile of regionFiles) {
      const region = regionFile.replace('.json', '');
      paths.push({ params: { category, region } });
    }
  }

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<RoadmapPageProps> = async (context) => {
  if (!context.params || typeof context.params.category !== 'string' || typeof context.params.region !== 'string') {
    return { notFound: true };
  }

  const { category, region } = context.params;
  const filePath = path.join(process.cwd(), 'src', 'data', category, `${region}.json`);

  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const roadmapData = JSON.parse(jsonData) as RoadmapNode;
    const pageTitle = `Lộ trình ${category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${region.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;

    return { props: { roadmapData, category, region, pageTitle } };
  } catch (error) {
    console.error(`Error processing roadmap data for ${category}/${region}:`, error);
    return { notFound: true };
  }
};

export default RoadmapPage;

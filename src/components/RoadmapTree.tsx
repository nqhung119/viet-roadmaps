import React from 'react';
import Tree from 'react-d3-tree';
import styles from './RoadmapTree.module.css'; // import CSS module

interface TreeNode {
  name: string;
  attributes?: Record<string, string>;
  children?: TreeNode[];
}

interface RoadmapTreeProps {
  data: TreeNode;
}

const containerStyles = {
  width: '100%',
  height: '700px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
};

const RoadmapTree: React.FC<RoadmapTreeProps> = ({ data }) => {
  return (
    <div style={containerStyles} className={styles.treeContainer}>
      <Tree
        data={data}
        orientation="vertical"
        pathFunc="step"
        zoomable
        collapsible
        initialDepth={2}
        translate={{ x: 400, y: 50 }}
      />
    </div>
  );
};

export default RoadmapTree;

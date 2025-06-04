import React, { useState } from 'react';
import styles from './MienBacRoadmap.module.css'; // Chúng ta sẽ tạo file CSS này sau

const RoadmapNode = ({ nodeData, level }) => {
    const [areChildrenVisible, setAreChildrenVisible] = useState(level === 0); // Mở rộng cấp đầu tiên
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    const hasChildren = nodeData.children && nodeData.children.length > 0;
    const hasDetails = nodeData.attributes && nodeData.attributes.details;

    const handleNameClick = () => {
        if (hasChildren) {
            setAreChildrenVisible(!areChildrenVisible);
        }
        if (hasDetails) {
            // Nếu chỉ muốn toggle details khi không có children, hoặc ngược lại,
            // bạn có thể thêm logic điều kiện ở đây.
            // Hiện tại, click name sẽ toggle cả children (nếu có) và details (nếu có).
            setIsDetailsVisible(!isDetailsVisible);
        }
    };

    let nameClasses = styles.nodeName;
    if (hasChildren) {
        nameClasses += ` ${styles.hasChildren}`;
        if (areChildrenVisible) {
            nameClasses += ` ${styles.expanded}`;
        }
    }
    if (hasDetails && !hasChildren) { // Thêm cursor pointer nếu chỉ có details
        nameClasses += ` ${styles.clickable}`;
    }


    return (
        <div className={`${styles.roadmapNode} ${styles[`level-${level}`]}`}>
            <div
                className={nameClasses}
                onClick={handleNameClick}
            >
                {nodeData.name}
            </div>

            {nodeData.attributes && nodeData.attributes.description && (
                <div
                    className={styles.nodeDescription}
                    dangerouslySetInnerHTML={{ __html: nodeData.attributes.description.replace(/\n/g, '<br>') }}
                />
            )}

            {hasDetails && isDetailsVisible && (
                <div
                    className={styles.nodeDetails}
                    dangerouslySetInnerHTML={{ __html: nodeData.attributes.details.replace(/\n/g, '<br>') }}
                />
            )}

            {hasChildren && areChildrenVisible && (
                <div className={styles.nodeChildren}>
                    {nodeData.children.map((childNode, index) => (
                        <RoadmapNode key={index} nodeData={childNode} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const MienBacRoadmap = ({ roadmapData }) => {
    if (!roadmapData) {
        return <p>Không có dữ liệu roadmap.</p>;
    }

    return (
        <div className={styles.roadmapContainer}>
            <h1 className={styles.roadmapTitle}>{roadmapData.name}</h1>
            {roadmapData.children && roadmapData.children.length > 0 ? (
                roadmapData.children.map((mainNode, index) => (
                    <RoadmapNode key={index} nodeData={mainNode} level={0} />
                ))
            ) : (
                <p>Roadmap này chưa có nội dung.</p>
            )}
        </div>
    );
};

export default MienBacRoadmap;
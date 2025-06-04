export type TreeNode = {
  name: string
  children?: TreeNode[]
}

interface RoadmapNode {
  name: string
  children?: RoadmapNode[]
  steps?: string[]
}

export function convertToTreeNode(node: RoadmapNode): TreeNode {
  const childrenNodes: TreeNode[] = []

  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => {
      childrenNodes.push(convertToTreeNode(child))
    })
  }

  if (node.steps && Array.isArray(node.steps)) {
    node.steps.forEach((step) => {
      childrenNodes.push({ name: step })
    })
  }

  return {
    name: node.name,
    children: childrenNodes.length > 0 ? childrenNodes : undefined,
  }
}

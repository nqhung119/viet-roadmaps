import React, { useState } from 'react'

type RoadmapNodeType = {
  name: string
  steps?: string[]
  children?: RoadmapNodeType[]
}

type Props = {
  node: RoadmapNodeType
}

export default function RoadmapNode({ node }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div className="ml-4 my-2">
      <div
        className="flex items-center cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        {node.children && (
          <span className="mr-2 text-lg">{open ? '▼' : '▶'}</span>
        )}
        <span className="font-semibold">{node.name}</span>
      </div>

      {open && (
        <>
          {node.steps && (
            <ul className="list-disc list-inside ml-6 mt-1 text-gray-700">
              {node.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          )}
          {node.children && (
            <div className="ml-4 border-l border-gray-300 pl-3 mt-2">
              {node.children.map((child, i) => (
                <RoadmapNode key={i} node={child} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

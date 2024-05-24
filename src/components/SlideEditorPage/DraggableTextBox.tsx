// import type React from 'react'
// import { useDraggable } from '@dnd-kit/core'
// import TextBox from './TextBox'
// import type { SlideElement } from '../../types/Slide'

// type DraggableTextBoxProps = {
//   element: SlideElement
//   onClick: () => void
//   onUpdate: (x: number, y: number) => void
//   editor: any
//   isActive: boolean
// }

// const DraggableTextBox: React.FC<DraggableTextBoxProps> = ({
//   element,
//   onClick,
//   editor,
//   isActive,
// }) => {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({
//     id: element.id,
//   })
//   const style: React.CSSProperties = {
//     transform: transform
//       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//       : '',
//     position: 'absolute',
//     left: `${element.x}px`,
//     top: `${element.y}px`,
//     width: `${element.width}px`,
//     height: `${element.height}px`,
//     boxSizing: 'border-box',
//     cursor: 'move',
//   }

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       onClick={onClick}
//       {...attributes}
//     >
//       {isActive && editor ? (
//         <TextBox
//           editor={editor}
//           width={element.width}
//           height={element.height}
//         />
//       ) : (
//         <div
//           style={{
//             border: '1px solid #000',
//             backgroundColor: 'rgba(255,255,255,0.5)',
//             padding: '8px',
//           }}
//         >
//           {element.content}
//         </div>
//       )}
//     </div>
//   )
// }

// export default DraggableTextBox
import type React from 'react'
import { useState } from 'react'
import TextBox from './TextBox'
import type { SlideElement } from '../../types/Slide'

type DraggableTextBoxProps = {
  element: SlideElement
  onClick: () => void
  onUpdate: (x: number, y: number) => void
  editor: any
  isActive: boolean
}

const DraggableTextBox: React.FC<DraggableTextBoxProps> = ({
  element,
  onClick,
  onUpdate,
  editor,
  isActive,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [position, setPosition] = useState({ x: element.x, y: element.y })

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    position: 'absolute',
    width: `${element.width}px`,
    height: `${element.height}px`,
    boxSizing: 'border-box',
    cursor: 'move',
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragStart) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      if (dragStart) {
        onUpdate(position.x, position.y)
      }
    }
    onClick()
  }

  return (
    <div
      style={style}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {isActive && editor ? (
        <TextBox
          editor={editor}
          width={element.width}
          height={element.height}
        />
      ) : (
        <div
          style={{
            border: '1px solid #000',
            backgroundColor: 'rgba(255,255,255,0.5)',
            padding: '8px',
          }}
        >
          {element.content}
        </div>
      )}
    </div>
  )
}

export default DraggableTextBox

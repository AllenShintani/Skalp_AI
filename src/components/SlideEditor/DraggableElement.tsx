import type React from 'react'
import { useState, useRef } from 'react'
import { useDraggable } from '@dnd-kit/core'
import type { SlideElement } from '../../types/Slide'
import styles from '../../styles/DraggableElement.module.css'

type DraggableElementProps = {
  element: SlideElement
  onElementChange: (
    id: string,
    content: string,
    newWidth?: number,
    newHeight?: number,
  ) => void
  onClick: () => void
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  onElementChange,
  onClick,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
  })

  const [width, setWidth] = useState(element.width)
  const [height, setHeight] = useState(element.height)
  const [isResizing, setIsResizing] = useState(false)
  const editorRef = useRef<HTMLDivElement | null>(null)

  const handleResize = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setIsResizing(true)
    const startX = event.clientX
    const startY = event.clientY
    const startWidth = width
    const startHeight = height

    const doDrag = (dragEvent: MouseEvent) => {
      const newWidth = startWidth + dragEvent.clientX - startX
      const newHeight = startHeight + dragEvent.clientY - startY
      setWidth(newWidth)
      setHeight(newHeight)
    }

    const stopDrag = () => {
      setIsResizing(false)
      document.documentElement.removeEventListener('mousemove', doDrag)
      document.documentElement.removeEventListener('mouseup', stopDrag)
      onElementChange(element.id, element.content, width, height)
    }

    document.documentElement.addEventListener('mousemove', doDrag)
    document.documentElement.addEventListener('mouseup', stopDrag)
  }

  const handleEditorUpdate = (content: string) => {
    onElementChange(element.id, content, width, height)
  }

  const handleEditorClick = () => {
    if (editorRef.current) {
      onClick()
    }
  }

  const style = {
    transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
    width: `${width}px`,
    height: `${height}px`,
  }

  return <></>
}

export default DraggableElement

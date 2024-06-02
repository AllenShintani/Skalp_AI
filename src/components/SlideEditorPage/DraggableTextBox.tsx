import type React from 'react'
import { useState } from 'react'

import TextBox from './TextBox'
import styles from '../../styles/DraggableTextBox.module.css'
import type { TextBoxInSlide } from '@/types/Slide'

type DraggableTextBoxProps = {
  textBox: TextBoxInSlide
  onClick: (event: React.MouseEvent) => void
  onUpdate: (x: number, y: number) => void
  isActive: boolean
}

const DraggableTextBox: React.FC<DraggableTextBoxProps> = ({
  textBox,
  onClick,
  onUpdate,
  isActive,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [position, setPosition] = useState({ x: textBox.x, y: textBox.y })
  const [size, setSize] = useState({
    width: textBox.width,
    height: textBox.height,
  })

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    position: 'absolute',
    width: `${size.width}px`,
    height: `${size.height}px`,
    boxSizing: 'border-box',
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isActive) return
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
    setIsDragging(false)
    if (!dragStart) return
    onUpdate(position.x, position.y)
  }

  const handleResize = (width: number, height: number) => {
    setSize({ width, height })
  }

  return (
    <div
      className={`${styles.draggableTextBox} ${isActive ? styles.active : styles.inactive}`}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseMove={!isActive ? handleMouseMove : undefined}
      onMouseUp={handleMouseUp}
      onClick={(event) => onClick(event)}
    >
      <TextBox
        editor={textBox.editor}
        width={size.width}
        height={size.height}
        onResize={handleResize}
        isActive={isActive}
      />
    </div>
  )
}

export default DraggableTextBox

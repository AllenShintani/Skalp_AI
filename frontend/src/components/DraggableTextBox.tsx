import type React from 'react'
import { EditorContent } from '@tiptap/react'
import styles from './DraggableTextBox.module.css'
import { useEffect, useCallback } from 'react'
import { useDrag } from '@/hooks/useDrag'
import { useResize } from '@/hooks/useResize'
import type { TextBox } from '@/types/Slide'
import type { ResizeDivs } from '@/types/DraggableTextBox'

type Props = {
  textbox: TextBox
}

const handleResizeDivs: ResizeDivs[] = [
  { direction: 'north', className: styles.resizeHandleNorth },
  { direction: 'northEast', className: styles.resizeHandleNorthEast },
  { direction: 'east', className: styles.resizeHandleEast },
  { direction: 'southEast', className: styles.resizeHandleSouthEast },
  { direction: 'south', className: styles.resizeHandleSouth },
  { direction: 'southWest', className: styles.resizeHandleSouthWest },
  { direction: 'west', className: styles.resizeHandleWest },
  { direction: 'northWest', className: styles.resizeHandleNorthWest },
]

const DraggableTextBox: React.FC<Props> = ({ textbox }) => {
  const {
    position: dragPosition,
    handleDragMouseDown,
    handleDragMouseMove,
    handleDragMouseUp,
  } = useDrag({ x: textbox.x, y: textbox.y }, { width: textbox.width, height: textbox.height })

  const {
    isResizing,
    size,
    position: resizePosition,
    handleResizeMouseDown,
    handleResizeMouseMove,
    handleResizeMouseUp,
  } = useResize({ width: textbox.width, height: textbox.height }, dragPosition)

  const style: React.CSSProperties = {
    transform: `translate3d(${resizePosition.x}px, ${resizePosition.y}px, 0)`,
    position: 'absolute',
    width: `${size.width}px`,
    height: `${size.height}px`,
    boxSizing: 'border-box',
    outline: textbox.isSelected ? 'solid 1px blue' : 'none',
    userSelect: 'none',
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleDragMouseMove(e)
      handleResizeMouseMove(e)
    },
    [handleDragMouseMove, handleResizeMouseMove],
  )

  const handleMouseUp = useCallback(() => {
    handleDragMouseUp()
    handleResizeMouseUp()
  }, [handleDragMouseUp, handleResizeMouseUp])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div
      style={style}
      onMouseDown={handleDragMouseDown}
      onDoubleClick={() => textbox.editor.commands.focus()}
      className={styles.textBox}
    >
      <div onMouseDown={(e) => e.stopPropagation()} className={styles.editorContent}>
        <EditorContent editor={textbox.editor}/>
      </div>
      <div
        className={styles.resizeHandles}
        style={{ display: isResizing ? 'block' : '' }}
      >
        {handleResizeDivs.map((div) => (
          <div
            key={div.direction}
            className={div.className}
            onMouseDown={(e) => handleResizeMouseDown(e, div.direction)}
          />
        ))}
      </div>
    </div>
  )
}

export default DraggableTextBox
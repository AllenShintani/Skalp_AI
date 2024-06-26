import type React from 'react'
import { useEffect, useCallback } from 'react'
import { EditorContent } from '@tiptap/react'
import styles from './DraggableTextBox.module.css'
import resizeStyles from './ResizeHandles.module.css'
import { useDrag } from '@/hooks/useDrag'
import { useResize } from '@/hooks/useResize'
import type { TextBox } from '@/types/Slide'
import type { ResizeDivs } from '@/types/DraggableTextBox'

type Props = {
  textbox: TextBox
  scale: number
}

const handleResizeDivs: ResizeDivs[] = [
  { direction: 'north', className: resizeStyles.resizeHandleNorth },
  { direction: 'northEast', className: resizeStyles.resizeHandleNorthEast },
  { direction: 'east', className: resizeStyles.resizeHandleEast },
  { direction: 'southEast', className: resizeStyles.resizeHandleSouthEast },
  { direction: 'south', className: resizeStyles.resizeHandleSouth },
  { direction: 'southWest', className: resizeStyles.resizeHandleSouthWest },
  { direction: 'west', className: resizeStyles.resizeHandleWest },
  { direction: 'northWest', className: resizeStyles.resizeHandleNorthWest },
]

const DraggableTextBox: React.FC<Props> = ({ textbox, scale }) => {
  const {
    handleResizeMouseDown,
    handleResizeMouseMove,
    handleResizeMouseUp,
  } = useResize(
    { width: textbox.width, height: textbox.height },
    { x: textbox.x, y: textbox.y },
    textbox.id,
    scale,
  )

  const {
    isDragging,
    isVerticalCenter,
    isHorizontalCenter,
    handleDragMouseDown,
    handleDragMouseUp,
    handleDragMouseMove,
  } = useDrag(
    { x: textbox.x, y: textbox.y },
    textbox.id,
    {
      width: textbox.width,
      height: textbox.height,
    },
    scale,
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleDragMouseMove(e)
      handleResizeMouseMove(e)
      // console.log(scale)
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

  const style: React.CSSProperties = {
    transform: `translate3d(${textbox.x}px, ${textbox.y}px, 0)`,
    position: 'absolute',
    width: `${textbox.width}px`,
    height: `${textbox.height}px`,
    boxSizing: 'border-box',
    outline: textbox.isSelected ? 'solid 1px blue' : 'none',
    userSelect: 'none', // Prevent text selection(入力の無効化はtiptapにメソッドが存在する為、注意が必要)
    ...((textbox.editor.getText() === 'Example Text' ||
      textbox.editor.getText() === '') && {
      border: '1px solid #d1d1d1',
    }),
  }

  return (
    <div
      style={style}
      onMouseDown={handleDragMouseDown}
      onDoubleClick={() => textbox.editor.commands.focus()}
    >
      {isVerticalCenter && isDragging && (
        <div className={styles.verticalLine} />
      )}
      {isHorizontalCenter && isDragging && (
        <div className={styles.horizontalLine} />
      )}

      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={styles.editorContent}
      >
        <EditorContent editor={textbox.editor} />
      </div>
      <div
        className={styles.resizeHandles}
        style={{ display: textbox.isSelected ? 'block' : 'none' }}
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

import type React from 'react'
import { EditorContent } from '@tiptap/react'
import styles from './DraggableTextBox.module.css'
import type { TextBox } from '@/types/Slide'
import { useDrag } from '../hooks/useDrag'
import { useResize } from '../hooks/useResize'

type Props = {
  textbox: TextBox
}

import type { ResizeDivs } from '@/types/DraggableTextBox'

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
  const { handleResizeMouseDown, isResizing, size, position } = useResize({
    textbox,
  })
  const { handleDragMouseDown } = useDrag({ textbox })

  // const [position, setPosition] = useState({ x: textbox.x, y: textbox.y })
  // const [size, setSize] = useState({
  //   width: textbox.width,
  //   height: textbox.height,
  // })
  // const [isResizing, setIsResizing] = useState(false)
  // const [resizeDirection, setResizeDirection] = useState<Direction>('default')
  // const [resizeStart, setResizeStart] = useState<{ x: number; y: number }>({
  //   x: size.width,
  //   y: size.height,
  // })

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    position: 'absolute',
    width: `${size.width}px`,
    height: `${size.height}px`,
    boxSizing: 'border-box',
    outline: textbox.isSelected ? 'solid 1px blue' : 'none',
    userSelect: 'none', // Prevent text selection(入力の無効化はtiptapにメソッドが存在する為、注意が必要)
  }

  // const handleResizeMouseDown = useCallback(
  //   (e: React.MouseEvent, direction: Direction) => {
  //     e.stopPropagation()
  //     setResizeDirection(direction)
  //     setIsResizing(true)
  //     setResizeStart({ x: e.clientX, y: e.clientY })
  //     textbox.isSelected = true
  //   },
  //   [textbox],
  // )
  // const handleResizeMouseMove = useCallback(
  //   (e: MouseEvent) => {
  //     if (!isResizing) return
  //     const newOptions = handleResize(
  //       e,
  //       resizeStart,
  //       size,
  //       position,
  //       resizeDirection,
  //     )
  //     if (newOptions.width < -10 || newOptions.height < -10) return

  //     setPosition({ x: newOptions.x, y: newOptions.y })
  //     setSize({
  //       width: newOptions.width,
  //       height: newOptions.height,
  //     })
  //     setResizeStart({ x: e.clientX, y: e.clientY })
  //   },
  //   [isResizing, resizeStart, size, position, resizeDirection],
  // )
  // const handleResizeMouseUp = useCallback(() => {
  //   if (!isResizing) return
  //   setIsResizing(false)
  //   setResizeDirection('default')
  //   textbox.isSelected = false
  // }, [isResizing, textbox])

  return (
    <div
      style={style}
      onMouseDown={handleDragMouseDown}
      className={styles.textBox}
    >
      <div onMouseDown={(e) => e.stopPropagation()}>
        <EditorContent editor={textbox.editor} />
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

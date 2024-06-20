import type React from 'react'
import styles from './DraggableSlideImage.module.css'
import { useCallback, useEffect } from 'react'
import type { SlideImage } from '@/types/Slide'
import resizeStyles from './ResizeHandles.module.css'
import { useDrag } from '@/hooks/useDrag'
import { useResize } from '@/hooks/useResize'
import type { ResizeDivs } from '@/types/DraggableTextBox'

type Props = {
  image: SlideImage
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

const DraggableSlideImage: React.FC<Props> = ({ image, scale }) => {
  const {
    isDragging,
    isVerticalCenter,
    isHorizontalCenter,
    handleDragMouseDown,
    handleDragMouseUp,
    handleDragMouseMove,
  } = useDrag(
    { x: image.x, y: image.y },
    image.id,
    {
      width: image.width,
      height: image.height,
    },
    scale,
  )

  const {
    isResizing,
    handleResizeMouseDown,
    handleResizeMouseMove,
    handleResizeMouseUp,
  } = useResize(
    { width: image.width, height: image.height },
    { x: image.x, y: image.y },
    image.id,
    scale,
  )

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

  const style: React.CSSProperties = {
    transform: `translate3d(${image.x}px, ${image.y}px, 0)`,
    position: 'absolute',
    width: `${image.width}px`,
    height: `${image.height}px`,
    boxSizing: 'border-box',
    outline: image.isSelected ? 'solid 1px blue' : 'none',
    userSelect: 'none', // Prevent text selection
  }

  return (
    <div
      style={style}
      onMouseDown={handleDragMouseDown}
      className={styles.SlideImage}
    >
      {isVerticalCenter && isDragging && (
        <div className={styles.verticalLine} />
      )}
      {isHorizontalCenter && isDragging && (
        <div className={styles.horizontalLine} />
      )}
      <img
        src={image.src}
        alt="image"
        onMouseDown={handleDragMouseDown}
        onDragStart={(e) => e.preventDefault()}
        width={image.width}
        height={image.height}
      />
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

export default DraggableSlideImage

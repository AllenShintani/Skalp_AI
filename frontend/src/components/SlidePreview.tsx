import type React from 'react'
import styles from './SlidePreview.module.css'
import type { Slide, SlideImage, TextBox } from '@/types/Slide'
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

type SlideImagePreviewProps = {
  image: SlideImage
}
type TextBoxPreviewProps = {
  textbox: TextBox
}

const PREVIEW_SCALE = 0.2

const SlideImagePreview: React.FC<SlideImagePreviewProps> = ({ image }) => {
  const style: React.CSSProperties = {
    transform: `translate(${image.x * PREVIEW_SCALE}px, ${image.y * PREVIEW_SCALE}px) `,
    position: 'absolute',
    width: `${image.width * PREVIEW_SCALE}px`,
    height: `${image.height * PREVIEW_SCALE}px`,
    boxSizing: 'border-box',
    userSelect: 'none',
  }

  return (
    <img
      src={image.src}
      alt="image"
      width={image.width}
      height={image.height}
      style={style}
    />
  )
}

const TextBoxPreview: React.FC<TextBoxPreviewProps> = ({ textbox }) => {
  const style: React.CSSProperties = {
    transform: `translate(${textbox.x * PREVIEW_SCALE}px, ${textbox.y * PREVIEW_SCALE}px) scale(${PREVIEW_SCALE})`,
    position: 'absolute',
    boxSizing: 'border-box',
    textWrap: 'nowrap',
    width: '0',
    height: '0',
    fontSize: `${textbox.editor.getAttributes('fontSize').size}px`,
    userSelect: 'none',
  }

  const sanitizedTextBoxHTML = DOMPurify.sanitize(textbox.editor.getHTML())

  return <div style={style}>{parse(sanitizedTextBoxHTML)}</div>
}

const slideBackgroundColor = (slide: Slide) => {
  return slide.backgroundColor
}

const SlidePreview: React.FC<{ slide: Slide }> = ({ slide }) => {
  return (
    <div
      style={{ backgroundColor: slideBackgroundColor(slide) }}
      className={styles.slidePreview}
    >
      {slide.textboxes.map((textbox) => (
        <TextBoxPreview
          key={textbox.id}
          textbox={textbox}
        />
      ))}
      {slide.images.map((image) => (
        <SlideImagePreview
          key={image.id}
          image={image}
        />
      ))}
    </div>
  )
}

export default SlidePreview

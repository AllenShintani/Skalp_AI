import type React from 'react'
import styles from '../../styles/Toolbar.module.css'

type ToolbarProps = {
  onCreateNewSlide: () => void
}

const Toolbar: React.FC<ToolbarProps> = ({ onCreateNewSlide }) => {
  return (
    <div className={styles.toolbar}>
      <button
        onClick={onCreateNewSlide}
        className={`${styles.button} ${styles.createNewSlideButton}`}
      >
        Create New Slide
      </button>
    </div>
  )
}

export default Toolbar

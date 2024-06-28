import Link from 'next/link'
import { useRouter } from 'next/router'
import { slidesState } from '../jotai/atoms'
import styles from './Sidebar.module.css'
import { useAtom } from 'jotai'
import SlidePreview from './SlidePreview'

const Sidebar = () => {
  const [slides] = useAtom(slidesState)

  const router = useRouter()
  const { id } = router.query

  return (
    <div className={styles.sidebar}>
      {slides.map((slide, index) => (
        <Link
          key={slide.slideId}
          href={`/slide/${slide.slideId}`}
          passHref
          legacyBehavior
        >
          <a
            className={`${styles.slideLink} ${
              slide.slideId === id ? styles.selected : ''
            }`}
          >
            <div className={styles.slideNumber}>{index + 1}</div>
            <div className={styles.thumbnailContainer}>
              <SlidePreview slide={slide} />
            </div>
          </a>
        </Link>
      ))}
    </div>
  )
}

export default Sidebar

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { slidesState } from '../recoil/atoms'
import styles from './Sidebar.module.css'

const DemoSidebar = () => {
  const slides = useRecoilValue(slidesState)
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
            <div className={styles.thumbnailContainer} />
          </a>
        </Link>
      ))}
    </div>
  )
}

export default DemoSidebar

import Link from 'next/link'
import { useRecoilValue } from 'recoil'
import { slidesState } from '../recoil/atoms'
import styles from '../styles/Sidebar.module.css'

const Sidebar = () => {
  const slides = useRecoilValue(slidesState)

  return (
    <div className={styles.sidebar}>
      {slides.map((slide) => (
        <Link
          key={slide.id}
          href={`/slide/${slide.id}`}
          passHref
          legacyBehavior
        >
          <a className={styles.slideLink}>
            <img
              src={slide.thumbnail}
              alt={slide.title}
              className={styles.thumbnail}
            />
            <p>{slide.title}</p>
          </a>
        </Link>
      ))}
    </div>
  )
}

export default Sidebar

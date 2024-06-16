import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { currentSlideIdState, slidesState } from '@/jotai/atoms'
import { useAtom } from 'jotai'
import type { Slide } from '@/types/Slide'

const Home = () => {
  const [slides, setSlides] = useAtom(slidesState)
  const router = useRouter()

  const createNewSlide = () => {
    const newSlide: Slide = {
      title: 'New Slide',
      slideId: '0',
      slideContent: [],
    }
    setSlides([newSlide])
    router.push(`/slide/0`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Home</h1>
        <button
          onClick={createNewSlide}
          className={styles.button}
        >
          Create New Slide
        </button>
      </div>
    </div>
  )
}

export default Home

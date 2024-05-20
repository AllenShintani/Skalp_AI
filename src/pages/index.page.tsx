import { useRecoilState } from 'recoil'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import Sidebar from '../components/Sidebar'
import { slidesState } from '../recoil/atoms'
import styles from '../styles/Home.module.css'

const Home = () => {
  const router = useRouter()
  const [slides, setSlides] = useRecoilState(slidesState)

  const createNewSlide = () => {
    const newSlideId = uuidv4()
    const newSlide = {
      id: newSlideId,
      title: `スライド${slides.length + 1}`,
      thumbnail: '/thumbnails/default.jpg',
    }
    setSlides([...slides, newSlide])
    router.push(`/slide/${newSlideId}`)
  }

  return (
    <div className={styles.container}>
      <Sidebar />
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

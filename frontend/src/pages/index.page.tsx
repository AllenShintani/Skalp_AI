import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

const Home = () => {
  const router = useRouter()

  const createNewSlide = () => {
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

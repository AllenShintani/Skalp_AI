import type { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import Sidebar from '../../components/Sidebar'
import { useRecoilState } from 'recoil'
import { slidesState } from '../../recoil/atoms'
import styles from '../../styles/SlideEditor.module.css'

type SlideProps = {
  id: string
}

const SlideEditor = ({ id }: SlideProps) => {
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

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.editor}>
        <h1>Editing Slide {id}</h1>
        <textarea
          placeholder="Enter slide content"
          className={styles.textarea}
        />
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

export const getStaticPaths: GetStaticPaths = async () => {
  const slides = [{ id: '1' }]

  const paths = slides.map((slide) => ({
    params: { id: slide.id },
  }))

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.id) {
    return {
      notFound: true,
    }
  }

  const id = params.id as string

  return {
    props: {
      id,
    },
  }
}

export default SlideEditor

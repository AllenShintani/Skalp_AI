// [id].tsx
import type { GetStaticPaths, GetStaticProps } from 'next'
import Sidebar from '../../components/Sidebar'
import SlideEditor from '@/components/SlideEditor/SlideEditor'
import styles from '../../styles/SlideEditorPage.module.css'
import { useRouter } from 'next/router'

type SlideProps = {
  id: string
}

const SlideEditorPage: React.FC<SlideProps> = ({ id }) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.editorContainer}>
        <SlideEditor id={id} />
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
  if (!params || !params.id) return { notFound: true }

  const id = params.id as string

  return {
    props: {
      id,
    },
  }
}

export default SlideEditorPage

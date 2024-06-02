import type React from 'react'
import Sidebar from '../../components/Sidebar'
import styles from '../../styles/SlideEditorPage.module.css'
import { useRouter } from 'next/router'
import { getStaticPaths } from '@/components/SlideEditorPage/getStaticPaths'
import { getStaticProps } from '@/components/SlideEditorPage/getStaticProps'
import SlideEditor from '@/components/SlideEditorPage/SlideEditor'

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
        <SlideEditor slideId={id} />
      </div>
    </div>
  )
}

export { getStaticPaths, getStaticProps }
export default SlideEditorPage

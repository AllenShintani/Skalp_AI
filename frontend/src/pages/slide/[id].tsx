import Sidebar from '@/components/Sidebar'
import SlideEditor from '@/components/SlideEditor'
import styles from './[id].module.css'

const Demo = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <SlideEditor />
    </div>
  )
}

export default Demo

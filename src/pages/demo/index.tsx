import DemoSidebar from '@/demoComponents/DemoSidebar'
import DemoSlideEditor from '@/demoComponents/DemoSlideEditor'
import styles from './Demo.module.css'

const Demo = () => {
  return (
    <div className={styles.container}>
      <DemoSidebar />
      <DemoSlideEditor />
    </div>
  )
}

export default Demo

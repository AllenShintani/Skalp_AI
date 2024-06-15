import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faFire } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

import styles from '../../styles/WorkSpace.module.css'
const WorkSpace = () => {
  const router = useRouter()
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>ワークスペース</h2>
        <div className={styles.headerItem}>
          <button>テンプレート</button>
          <button>メンバーを招待</button>
          <div className={styles.iconFrame}>
            <FontAwesomeIcon
              className={styles.icon}
              icon={faUser}
            />
          </div>
        </div>
      </div>
      <div className={styles.workSpaceSelector} />
      <div className={styles.projectSelector} />
      <div className={styles.main}>
        <div className={styles.buttonBar}>
          {/* todo: /pages/select-ui を作成して、そこに移動させる */}
          <button>
            <FontAwesomeIcon
              className={styles.icon}
              icon={faFire}
            />
            AIでプレゼン作成
          </button>
          {/* todo: slideidと紐づけ */}
          <button onClick={() => router.push('/slide/1')}>プレゼン作成</button>
        </div>
      </div>
    </div>
  )
}

export default WorkSpace

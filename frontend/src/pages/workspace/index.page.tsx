import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import styles from '../../styles/WorkSpace.module.css'
const WorkSpace = () => {
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
      <div className={styles.main} />
    </div>
  )
}

export default WorkSpace

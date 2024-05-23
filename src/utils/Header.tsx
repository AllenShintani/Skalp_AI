// Header.tsx
import styles from '../styles/Header.module.css'
import {
  HomeIcon,
  TextFieldsIcon,
  CropSquareIcon,
  InsertChartIcon,
  CloudUploadIcon,
  ExtensionIcon,
} from '../components/Icon'
import { useRecoilState } from 'recoil'
import { textToolState } from '@/recoil/atoms'

const Header = () => {
  const [isTextToolActive, setIsTextToolActive] = useRecoilState(textToolState)

  const handleTextToolClick = () => {
    setIsTextToolActive((prev) => !prev)
  }

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <HomeIcon style={{ fontSize: 24 }} />
        </div>
        <div className={styles.documentTitle}>
          <h1>新規ドキュメント</h1>
          <div className={styles.menu}>
            <span>ファイル</span>
            <span>編集</span>
            <span>表示</span>
            <span>スライド</span>
            <span>設定</span>
            <span>ヘルプ</span>
          </div>
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.toolbar}>
          <button
            className={`${styles.toolbarButton} ${isTextToolActive ? styles.activeButton : ''}`}
            onClick={handleTextToolClick}
          >
            <TextFieldsIcon style={{ fontSize: 24 }} />
            <span>テキスト</span>
          </button>
          <button className={styles.toolbarButton}>
            <CropSquareIcon style={{ fontSize: 24 }} />
            <span>図形</span>
          </button>
          <button className={styles.toolbarButton}>
            <InsertChartIcon style={{ fontSize: 24 }} />
            <span>グラフ</span>
          </button>
          <button className={styles.toolbarButton}>
            <CloudUploadIcon style={{ fontSize: 24 }} />
            <span>アップロード</span>
          </button>
          <button className={styles.toolbarButton}>
            <ExtensionIcon style={{ fontSize: 24 }} />
            <span>パーツ</span>
          </button>
        </div>
        <button className={styles.themeButton}>テーマ</button>
        <button className={styles.shareButton}>共有</button>
      </div>
    </header>
  )
}

export default Header

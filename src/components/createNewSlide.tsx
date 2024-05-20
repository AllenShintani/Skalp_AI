import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'

const router = useRouter()

const createNewSlide = () => {
  const newSlideId = uuidv4()
  router.push(`/slide/${newSlideId}`)
}

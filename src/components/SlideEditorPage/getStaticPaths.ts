import type { GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  const slides = [{ id: '1' }]

  const paths = slides.map((slide) => ({
    params: { id: slide.id },
  }))

  return { paths, fallback: true }
}

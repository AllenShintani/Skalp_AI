import type { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.id) return { notFound: true }

  const id = params.id as string

  return {
    props: {
      id,
    },
  }
}

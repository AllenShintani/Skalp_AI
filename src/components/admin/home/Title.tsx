import type React from 'react'
import Typography from '@mui/material/Typography'

type TitleProps = {
  children?: React.ReactNode
}

const Title: React.FC<TitleProps> = ({ children }) => {
  return (
    <Typography
      component="h2"
      variant="h6"
      color="primary"
      gutterBottom
    >
      {children}
    </Typography>
  )
}

export default Title

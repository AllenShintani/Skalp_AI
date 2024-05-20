import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import type { FormEvent } from 'react'
import 'firebase/compat/auth'
import dotenv from 'dotenv'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from 'backend/src/routers'
import router from 'next/router'
import type { LoginInput } from 'backend/src/schemas/userSchemas'

dotenv.config()
const theme = createTheme()
const API_HOST = `${process.env.NEXT_PUBLIC_API_HOST}`

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${API_HOST}/trpc`,
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
    }),
  ],
})

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  //----------formのデータを取り出す
  const formData = new FormData(e.currentTarget)

  const loginData: LoginInput = {
    email: formData.get('email')?.toString() || '',
    password: formData.get('password')?.toString() || '',
  }

  //--------user情報をserverに送信
  try {
    const userUuid = await trpc.login.mutate({ loginData })
    router.push(`/home/${userUuid}`)
  } catch (error) {
    console.error(error)
  }
}
export default function SignIn() {
  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
          >
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
              >
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="メールアドレス"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="パスワード"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      value="allowExtraEmails"
                      color="primary"
                    />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              ログイン
            </Button>
            <Grid
              container
              justifyContent="flex-end"
            >
              <Grid item>
                <a href="/signup">まだアカウントをお持ちでない方</a>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

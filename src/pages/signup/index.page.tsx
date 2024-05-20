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
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from 'backend/src/routers'
import { userSchema } from '@/shemas'
import router from 'next/router'

const theme = createTheme()
const API_HOST = `${process.env.NEXT_PUBLIC_API_HOST}`

// tRPCクライアントの作成
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${API_HOST}/trpc`,
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: 'include', //これ設定しないとcookieが送信されてもsetされない。バックエンドもだっけ？
        })
      },
    }),
  ],
})
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)

  const userData = userSchema.parse({
    email: formData.get('email')?.toString() || '',
    password: formData.get('password')?.toString() || '',
    firstName: formData.get('firstName')?.toString(),
    lastName: formData.get('lastName')?.toString(),
  })

  try {
    const { userUuid } = await trpc.signup.mutate({ userData })
    router.push(`/home/${userUuid}`)
  } catch (error) {
    console.error(error)
  }
}
export default function SignUp() {
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
            Sign up
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
                sm={6}
              >
                <TextField
                  autoComplete="given-name"
                  name="lastName"
                  required
                  fullWidth
                  id="lastName"
                  label="姓"
                  autoFocus
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="名"
                  name="firstName"
                  autoComplete="family-name"
                />
              </Grid>
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
              登録
            </Button>
            <Grid
              container
              justifyContent="flex-end"
            >
              <Grid item>
                <a href="/login">既にアカウントをお持ちの方</a>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

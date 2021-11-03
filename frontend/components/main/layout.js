import Head from 'next/head'
import { useEffect, useState } from 'react'
import Header from "./header"
import Footer from './footer'
import styles from '../../styles/layout.module.scss'
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import jwtDecode from 'jwt-decode'

export default function Layout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState()

  const route_need_auth = [
    '/account/[slug]',
  ]

  useEffect(async () => {
    let usr = ''
    try {
      usr = jwtDecode(Cookies.get('access'))
      setUser(usr)
    } catch (err) {
      // cant decode.. not a valid cookie / missing / not logged in
      Cookies.remove('access')
      Cookies.remove('refresh')
      if (route_need_auth.includes(router.pathname)) {
        router.push('/login')
      }
    }
  }, [])
  return (
    <div className={styles.Layout}>
      <Head>
        <title>E-Commerce | My page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={user} />
      <main>{children}</main>
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={true}
        newestOnTop={false}
        rtl={false}
        transition={Flip}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

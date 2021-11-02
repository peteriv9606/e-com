import Head from "next/head"
import Layout from "../../components/main/layout"
import styles from '../../styles/account.module.scss'
import { useEffect, useRef, useState } from "react"
import { fetchWithTokenSSR, isUserSSR } from "../../components/main/auth"
import AccountPersonalBlock from "../../blocks/accountPersonalBlock"
import AccountOrdersBlock from "../../blocks/accountOrdersBlock"
import { useRouter } from "next/router"
import Cookies from "js-cookie"

export const getServerSideProps = async (context) => {
  let ssr_tab = context.query.slug
  const allowed_tabs = ['personal', 'orders', 'favorites', 'wishlist']

  if (!await isUserSSR(context)) {
    return ({
      redirect: {
        destination: '/login',
        permanent: false,
      }
    })
  } else if (!allowed_tabs.includes(ssr_tab)) {
    ssr_tab = 'personal'
    return ({
      redirect: {
        destination: '/account/' + ssr_tab,
        permanent: false,
      }
    })
  } else {
    const ssr_user = await fetchWithTokenSSR(context, process.env.apiUrl + 'users/').then(res => res.json())
    return (
      {
        props: {
          ssr_tab,
          ssr_user
        }
      }
    )
  }

}

export default function Account({ ssr_user, ssr_tab }) {
  const router = useRouter()
  const nav_actions_ref = useRef()
  const [currContent, setCurrContent] = useState(ssr_tab)
  
  useEffect(()=>{
    for (const [key, value] of Object.entries(nav_actions_ref.current.children)) {
      value.id != router.query.slug ?
        value.classList.remove(styles.Active)
        : value.classList.add(styles.Active)
    }
    setCurrContent(router.query.slug)
  }, [router.query.slug])

  const handleMenuBtnClick = () => {
    if (event.target.id !== 'logout') {
      router.push(event.target.id, undefined, { shallow: false })
    } else {
      Cookies.remove('access')
      Cookies.remove('refresh')
      router.reload()
    }
  }

  return (
    <Layout>
      <Head>
        <title>E-Commerce | Account</title>
      </Head>
      <div className={styles.Wrapper}>
        <div className={"Shell"}>
          <div className={styles.Inner}>
            <h1>Account</h1>
            <div className={styles.Split_wrapper}>
              <div className={styles.Nav_actions} ref={nav_actions_ref}>
                <button id={"personal"} onClick={handleMenuBtnClick}>Personal</button>
                <button id={"orders"} onClick={handleMenuBtnClick}>Orders</button>
                <button id={"favorites"} onClick={handleMenuBtnClick}>Favorites</button>
                <button id={"wishlist"} onClick={handleMenuBtnClick}>Wishlist</button>
                <button id={"logout"} onClick={handleMenuBtnClick}>Logout</button>
              </div>
              <div className={styles.Content}>
                {currContent === "personal" && <AccountPersonalBlock ssr_user={ssr_user} />}
                {currContent === "orders" && <AccountOrdersBlock />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
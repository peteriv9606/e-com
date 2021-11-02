import Head from 'next/head'
import styles from '../styles/index.module.scss'
import Layout from '../components/main/layout'

export default function Index() {


  return (
    <Layout>
      <Head>
        <title>E-Commerce | Home</title>
      </Head>

      <div className={styles.Wrapper}>
        <div className="Shell">
          <div className={styles.Inner}>

          </div> 
        </div>
      </div>
    </Layout>
  )
}

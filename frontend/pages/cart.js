import Head from 'next/head'
import Layout from "../components/main/layout";
import styles from "../styles/cart_page.module.scss"

export default function Cart(){
    return (
        <Layout>
            <Head>
                <title>E-Commerce | Cart</title>
            </Head>
        
            <div className={styles.Wrapper}>
                <div className="Shell">
                    <div className={styles.Inner}>
                        <h1>Cart</h1>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
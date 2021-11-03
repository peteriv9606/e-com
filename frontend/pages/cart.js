import Head from 'next/head'
import Layout from "../components/main/layout";
import styles from "../styles/cart_page.module.scss"
import AccountOrdersBlock from '../blocks/accountOrdersBlock'

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
                        <AccountOrdersBlock />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
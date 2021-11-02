import { useState } from 'react'
import SingleProductBlock from '../../blocks/singleProductBlock'
import Layout from '../../components/main/layout'
import styles from '../../styles/singleProductPage.module.scss'

export const getServerSideProps = async (context) => {
  const ssr_product = await fetch(process.env.apiUrl + 'products/' + context.query.slug).then(res=>res.json())
  return {
    props: {
      ssr_product
    }
  }
}

export default function Product ({ssr_product}) {
  const [ product, setProduct ] = useState(ssr_product)

  return(
    <Layout>
      <div className={styles.Wrapper}>
        <div className={"Shell"}>
          <div className={styles.Inner}>
            <SingleProductBlock product={product} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
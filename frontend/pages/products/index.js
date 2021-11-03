import Layout from "../../components/main/layout"
import Head from "next/head"
import styles from "../../styles/products_page.module.scss"
import { useEffect, useRef, useState } from "react"
import ProductsBlock from '../../blocks/productsBlock'
import ReactPaginate from 'react-paginate';
import { useRouter } from "next/router"
import { merge } from "lodash"
import { buildUrlAndFetch, buildUrlAndFetchSSR } from "../../components/main/helpers"

export const getServerSideProps = async (context) => {
    // executed only on initial page load (not after router.push or stuff like that)
    console.log("SSR")
    const ssr_products = await buildUrlAndFetchSSR(context, 'products/')
    return {
        props: {
            ssr_products,
            ssr_ordering: context.query.ordering || null,
            ssr_page: context.query.page || 0
        },
    }
}

export default function Products({ ssr_products, ssr_ordering, ssr_page }) {
    const router = useRouter()
    const [products, setProducts] = useState(ssr_products)
    const [ordering, setOrdering] = useState(ssr_ordering !== null ? ssr_ordering : "")
    const [currentPage, setCurrentPage] = useState(parseInt(ssr_page))
    const [initRender, setInitRender] = useState(true)

    const handleChange = (e) => {
        let rq = router.query
        let selectedPage = ""
        let selectedOrder = ""
        let url = ''

        try{
            // its not a page selection (order)
            selectedOrder = e.target.id
            delete rq?.page
            selectedOrder === '' ? delete rq.ordering : rq = merge(rq, { 'ordering': selectedOrder })
        }catch (err){
            selectedPage = e.selected + 1
            selectedPage === 1 ? delete rq.page : rq = merge(rq, { 'page': selectedPage })
        }

        Object.entries(rq).forEach(([key, value], index) => {
            url += index === 0 ? `?${key}=${value}` : `&${key}=${value}`
        })
        router.push(url, url, {shallow: true})
    }

    useEffect(async ()=>{
        if(!initRender){
            setProducts(await buildUrlAndFetch(router.query, 'products/'))
            setOrdering(router.query.ordering || "")
            setCurrentPage(router.query.page || 0)
        }else{
            setInitRender(false)
        }
    }, [router.query])
    
    return (
        <Layout>
            <Head>
                <title>E-Commerce | Products</title>
            </Head>

            <div className={styles.Wrapper}>
                <div className="Shell">
                    <div className={styles.Inner}>
                        <ProductsBlock 
                            products={products} 
                            ordering={ordering} 
                            handleChange={handleChange}
                        />
                        <ReactPaginate
                            pageCount={Math.ceil(products?.count / 12)}
                            previousLabel={'<'}
                            nextLabel={'>'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handleChange}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                            forcePage={currentPage != 0 ? (currentPage - 1) : currentPage}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
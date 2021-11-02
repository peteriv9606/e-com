import SingleProduct from "../components/products/singleProductCard"
import OrderingDropdown from "../components/secondary/orderingDropdown"
import styles from "../styles/productList.module.scss"
export default function ProductsList({products, ordering, handleChange}){
    return (
        <section className={styles.Products_wrapper}>
            <div>
                <h1>Products</h1>
                <OrderingDropdown ordering={ordering} handleChange={handleChange}/>
            </div>
            <div className={styles.Products_list}>
                {
                    products != undefined ?
                    products?.results?.map((product, index)=>{
                        return <SingleProduct key={index} product={product}/>
                    })
                    : <h1>There was a problem while trying to show these products</h1>
                }
            </div>
        </section>
    )
}
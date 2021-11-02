
import styles from "../../styles/singleProduct.module.scss"
import { fetchWithToken } from "../main/auth"
import { toast } from 'react-toastify'

export default function Product({product}){

    const addToCart = async (id) => {
        let requestOptions = {
          method: "POST",
          body: JSON.stringify({
            'product': id,
            'quantity': 1
          })
        }
    
        const res = await fetchWithToken(process.env.apiUrl + 'orders/', requestOptions)
        .then(res=>res.json())
        res?.detail ? toast.error(res.detail) : toast.success("Product added successfully!")
    }

    return (
    <div className={styles.Product}>
        <a href={`products/${product?.slug}`}>
            <img src={product?.images[0]?.image} />
            <h1>{product.title}</h1>
        </a>
        <div className={styles.Product_actions}>
            <p>${parseFloat(product.price).toFixed(2)}</p>
            <button 
                className="Button" 
                onClick={()=>addToCart(product.id)}>Add to cart
            </button>
        </div>
    </div>
    )
}
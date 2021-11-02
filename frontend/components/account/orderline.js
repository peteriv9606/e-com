
import { useEffect, useState } from 'react'
import styles from '../../styles/account_orderline.module.scss'
import { fetchWithToken } from '../main/auth'
import useDebounce from '../main/useDebounce'
import Loader from '../main/loader'

export default function Orderline({ line, setOrder }) {
  const [quantity, setQuantity] = useState({
    "product": parseInt([line.id]),
    "quantity": parseInt([line.quantity])
  })
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuantity = useDebounce(quantity, 1000)

  useEffect(()=>{quantity.quantity !== line.quantity && setIsLoading(true)},[quantity])

  useEffect(async ()=>{
    // using useDebounce to reduce number of requests on product quantity change
    if(debouncedQuantity.quantity !== line.quantity){
      setOrder(
        await fetchWithToken(process.env.apiUrl + 'orders/', {
          method: "POST",
          body: JSON.stringify(debouncedQuantity)
        })
          .then(res => res.json())
      )
      setIsLoading(false)
    }

  },[debouncedQuantity])

  const handleQuantityChange = async (id) => {
    let err = true
    let curr_quant = parseInt(quantity.quantity)

    if (event.target.id === "add" && quantity.quantity < line?.product?.quantity) {
      curr_quant += 1
      //setQuantity(curr_quant)
      setQuantity({
        "product": id,
        "quantity": curr_quant
      })
      err = false
    }
    else if (event.target.id === "sub" && quantity.quantity > 1) {
      curr_quant -= 1
      setQuantity({
        "product": id,
        "quantity": curr_quant
      })
      err = false
    }

    if (!err) {
      
    }
  }

  const handleRemoveOrderline = async (id) => {
    setOrder(
      await fetchWithToken(
        process.env.apiUrl + 'orders/remove_from_cart/', {
        method: "DELETE",
        body: JSON.stringify({ "id": parseInt(id) })
      })
        .then(res => res.json())
    )
  }

  return (
    <div className={styles.Orderline}>
      <img src={line.product.images[0].image} alt={"prod_img"} />
      <div>
        <h1>{line.product.title}</h1>
        <p>{line.product.description}</p>
      </div>
      <p>${parseFloat(line.product.price).toFixed(2)}</p>
      <p>X</p>
      <div>
        <button id="sub" onClick={() => handleQuantityChange(line.product.id)}>-</button>
        <p>{quantity.quantity}</p>
        <button id="add" onClick={() => handleQuantityChange(line.product.id)}>+</button>
      </div>
      <p>{isLoading ? <Loader orange/> : `$${parseFloat(line.line_total).toFixed(2)}`}</p>
      <button onClick={() => handleRemoveOrderline(line.id)}>&#10006;</button>
    </div>
  )
}
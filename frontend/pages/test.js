import Head from 'next/head'
import styles from '../styles/index_page.module.scss'
import Layout from '../components/main/layout'
import { useState, useEffect } from "react"
import { fetchWithToken } from '../components/main/auth'
import { toast } from 'react-toastify'


export default function Test({ssr_products}) {
  const [ products, setProducts ] = useState(ssr_products)
  const [ quantity, setQuantity ] = useState({})
  const [ order, setOrder ] = useState([])
  const [ loggedIn, setLoggedIn ] = useState(false)



  const removeFromCart = async (id) => {
    console.log("remove_from_cart")
    let requestOptions = {
      method: "DELETE",
      body: JSON.stringify({"id": parseInt(id)})
    }

    const res = await fetchWithTokenTest(
      process.env.apiUrl + 'orders/remove_from_cart/', requestOptions)
    .then(res=>res.json())
    res?.detail ? alert(res.detail) : setOrder(res) 
  }

  const deleteOrder = async (id) => {
    console.log("delete_order")
    let requestOptions = {
      method:"DELETE"
    }

    const res = await fetchWithTokenTest(process.env.apiUrl + 'orders/' + id + "/", 
      requestOptions)
    .then(res=>res.json())
    res?.detail ? alert(res.detail) : (alert(res.API_Message), setOrder([])) 
  }

  const changeQuantity = (id) => {
    let curr_quantity = quantity[id] != undefined ? quantity[id] : 1
    if(event.target.id == "add"){
      curr_quantity++
    }else{
      if(curr_quantity > 1){
        curr_quantity--
      }
    }
    setQuantity({...quantity, [id]: curr_quantity})
  }

  const testFetchData = async () => {
    //const res = await fetchWithToken(process.env.apiUrl + 'check_token_validity/').then(res=>res.json())
    //toast(res?.detail)
    notify()

  }

  const notify = () => toast(<Msg />, {
    onOpen: () => console.log('Called when I open'),
    onClose: () => console.log('Called when I close')
  })

  const Msg = ({ closeToast, toastProps }) => (
    <div>
      Lorem ipsum dolor sit amet
      <button >Retry</button>
      <button onClick={closeToast}>Close</button>
    </div>
  )

  return (
    <Layout>
      <Head>
        <title>E-Commerce | TEST</title>
      </Head>

      <div className="Shell">
        <div className={styles.Inner}>
          <h1>TEST - Products</h1>
          <div className={styles.Products}>
            <button onClick={testFetchData}>TEST FETCH DATA</button>
            {
              products != undefined ?
                products?.results?.map((prod, index)=>{
                  return <div className={styles.Product} key={index}>
                    <h1><span>{prod.title}</span><span>#{prod.id}</span></h1>
                    <h2>{prod.description}</h2>
                    {/* description should be changed with image */}
                    <div className={styles.Product_actions}>
                      <p>${prod.price}</p>
                      <div className={styles.Quantity_wrapper}>
                        <button id="sub" onClick={()=>changeQuantity(prod.id)}>-</button>
                        <p>{quantity[prod.id] != undefined ? quantity[prod.id] : 1}</p>
                        <button id="add" onClick={()=>changeQuantity(prod.id)}>+</button>
                      </div>
                      <button onClick={()=>addToCart(prod.id)}>Add to cart</button>
                    </div>
                  </div>
                })
              : ""
            }
          </div>
          {
            loggedIn ? 
            <>
              
              <div className={styles.Order_wrapper}>
                {
                  order != undefined && order != null && order.length != 0 ?
                  <>
                    <h1>Order #{order.id}</h1>
                    <h2>Products: {order.orderlines_count} (Total price: ${order.orderlines_price_total})</h2>
                    <button onClick={()=>deleteOrder(order.id)}>Delete order</button>
                    <div className={styles.Orderline_wrapper}>
                      {
                        order?.orderlines?.map((line, index)=>
                          <div className={styles.Orderline} key={index}>
                              <p>Orderline id: #{line.id} 
                                <button onClick={()=>removeFromCart(line.id)}>&#10006;</button>
                              </p>
                              <div className={styles.Orderline_details}>
                                <p>Product id: #{line.product.id}</p>
                                <p>{line.product.title}</p>
                                <p>(${line.product.price} x {line.quantity})</p>
                                <p>Total: ${line.line_total}</p>
                              </div>
                          </div>
                        )
                      }
                    </div>
                  </>
                  :<h1>You have no orders yet</h1>
                }
              </div>
            </>
            : <h1>Please login to use "Add to cart" function</h1>
          }
        </div> 
      </div>
    </Layout>
  )
}

import styles from '../styles/accountOrdersBlock.module.scss'
import moment from 'moment'
import Orderline from '../components/account/orderline'
import { useState, useEffect } from 'react'
import { fetchWithToken } from '../components/main/auth'
import Loader from '../components/main/loader'

export default function Orders() {
  const [order, setOrder] = useState()

  useEffect(async () => {
    setOrder(await fetchWithToken(process.env.apiUrl + 'orders/').then(res => res.json()))
  }, [])

  const deleteOrder = async () => {
    setOrder(await fetchWithToken(process.env.apiUrl + 'orders/' + order.id + "/",
    { method: "DELETE" }).then(res => res.json()))
  }

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Inner_head}>
        {
          order && order?.orderlines ?
            <div>
              <div>
                <h1>Order <span>#{order.id}</span></h1>
                <h1>Status: <span>{!order.finished ? "Active" : "Inactive"}</span></h1>
              </div>
              <div>
                <h1>Date created: <span>{moment(order.created_at).format("LLLL")}</span></h1>
                <h1>Last modified: <span>{moment(order.modified_at).format("LLLL")}</span></h1>
              </div>
              <div>
                <button className={"Button"} onClick={deleteOrder}>Remove all</button>
              </div>
            </div>
            : order?.detail ? <h2>{order.detail}</h2> : <Loader orange/>
        }
      </div>
      <div className={styles.Inner_body}>
        <div className={styles.Order_wrapper}>
          {
            order && order?.orderlines ?
              order.orderlines.map((line, index) => 
                <Orderline key={index} line={line} setOrder={setOrder} />
              )
              : ""
          }
        </div>
      </div>
      <div className={styles.Inner_foot}>
        {
          order && order?.orderlines ?
            <>
              <div>
                <h1>Total number of items:</h1>
                <span>{order?.orderlines_count}</span>
              </div>
              <div>
                <h1>Order total:</h1>
                <span>${parseFloat(order?.orderlines_price_total).toFixed(2)}</span>
              </div>
              <button className="Button" onClick={() => alert("Function not yet integrated :(")}>Checkout</button>
            </>
            : ""
        }
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import styles from '../../styles/orderingDropdown.module.scss'

export default function OrderingDropdown({ordering, handleChange}){
  const [active, setActive] = useState(ordering)
  const [toggle, setToggle] = useState(false)
  useEffect(()=>{
    if(ordering && ordering !== ""){
      setActive(document.getElementById(ordering).innerHTML)
      setToggle(false)
    }else{
      setActive('Sort by')
      setToggle(false)
    }
  }, [ordering])
  
  return(
    <div className={styles.Wrapper}>
      <div className={`${styles.Inner} ${toggle ? styles.Active : ""}`}>
        <p onClick={()=>setToggle(!toggle)}>{active}</p>
        <ul>
          <li id='' onClick={(e)=>handleChange(e)}>No sort</li>
          <li id='title' onClick={(e)=>handleChange(e)}>Name (A-Z)</li>
          <li id='-title' onClick={(e)=>handleChange(e)}>Name (Z-A)</li>
          <li id='-price' onClick={(e)=>handleChange(e)}>Price (Highest first)</li>
          <li id='price' onClick={(e)=>handleChange(e)}>Price (Lowest first)</li>
          <li id='-created_at' onClick={(e)=>handleChange(e)}>Newest first</li>
          <li id='created_at' onClick={(e)=>handleChange(e)}>Oldest first</li>
        </ul>
      </div>
    </div>
  )
}
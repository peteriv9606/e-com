import styles from '../styles/singleProductBlock.module.scss'

export default function SingleProductBlock({product}){

  return(
    <div className={styles.Wrapper}>
      <div className={styles.ProductDetails}>
        <div className={styles.Img_container}>
          <div className={styles.Img_carousel}>
            {
              product.images.map((img)=><img src={img.image} key={img.id} />)
            }
          </div>
          <img src={product.images[0].image} />
        </div>
        <div className={styles.Details}>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  )
}
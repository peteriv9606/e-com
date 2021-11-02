import { isUserSSR } from "../../components/main/auth"

export const getServerSideProps = async (context) => {
  let ssr_tab = context.query.slug
  const ssr_user = await isUserSSR(context)

  if (!ssr_user) {
    return ({
      redirect: {
        destination: '/login',
        permanent: false,
      }
    })
  } else {
    if(!ssr_tab){
      ssr_tab="personal"
    }
    return (
      {
        props: {ssr_tab},
        redirect:{
          destination: '/account/' + ssr_tab,
          permanent: false,
        }
      }
    )
  }

}

export default function Account() {
  return (<></>)
}
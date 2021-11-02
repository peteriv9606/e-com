import Cookies from 'js-cookie'
import jwtDecode from "jwt-decode";
import merge from "lodash/merge"

export const ssrHasValidAccessToken = async (context) => {
  // serverside rendering - check if user has access token
  // usually this one might be used if you are trying to /login or /register
  // and you are already logged in (have an access token - 
  // not specified if valid or not)..

  const c = context.req.headers.cookie.split('; ')
  let cookies = {}
  for (const element of c) {
    let cookie = Object(element.split('='))
    cookies[cookie[0]] = cookie[1]
  }
  if (cookies['access'] != undefined) {
    // user already logged in
    let requestOptions = {
      headers: {
        'Authorization': `Bearer ${cookies['access']}`
      }
    }
    const res = await fetchWithToken(process.env.apiUrl + 'check_token_validity/', requestOptions).then(res => res.json())
    return res?.detail === "OK"
  } else {
    // user not logged in - should not have access token
    return false
  }
}

export const getUser = async () => {
  let user_id = '-1'
  try {
    if (Cookies.get("access") !== undefined) {
      user_id = jwtDecode(Cookies.get('access')).user_id
    } else {
      let new_token = await refreshToken()
      if (new_token?.access !== undefined) {
        Cookies.set('access', new_token.access)
        user_id = jwtDecode(Cookies.get('access')).user_id
      } else {
        return undefined
      }
    }
    return await fetchWithToken(process.env.apiUrl + "users/" + user_id + "/").then(res => res.json())
  } catch (error) {
    // console.log(error) // pretty much it would say {message: 'Invalid token specified'}
    return undefined
  }
}

/**A server-side function to check if user is logged in and has access to this route.
 * If a user is not logged in, this function returns false, and should then redirect
 * to the login page.
 * 
 * @param {object} context - provide the context variable from getServerSideProps(context)
 * 
 * example usage:
 * 
 * const user = await isUserSSR(context)
 * 
 * !user? redirect_to... : user_is_logged_in
 */
export const isUserSSR = async (context) => {
  let requestOptions = { headers: { "Content-type": 'application/json' } }
  const res = await fetchWithTokenSSR(context, process.env.apiUrl + 'check_token_validity/', requestOptions).then(res => res.json())
  return res?.detail === "OK" ? true : false
}

export const fetchWithTokenSSR = async (context, url, requestOptions) => {
  const c = context.req.headers.cookie.split('; ')
  let cookies = {}
  for (const element of c) {
    let cookie = Object(element.split('='))
    cookies[cookie[0]] = cookie[1]
  }
  requestOptions = merge(requestOptions, {
    headers: { "Authorization": `Bearer ${cookies['access']}` }
  })

  const res = await fetch(url, requestOptions)

  if (res?.status === 401) {
    const new_token = await fetch(process.env.apiUrl + "auth/token/refresh/", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "refresh": cookies['refresh'] })
    }).then(res => res.json())
    if (new_token?.access !== undefined) {
      // another attempt to fetch with new token
      requestOptions = merge(requestOptions, {
        headers: { "Authorization": `Bearer ${new_token.access}` }
      })
      return await fetch(url, requestOptions)
    }
  }
  return res
}

export const fetchWithToken = async (url, requestOptions) => {
  if (Cookies.get("access") !== undefined) {
    requestOptions = merge(requestOptions, {
      headers: { "Authorization": `Bearer ${Cookies.get("access")}` }
    })
  }
  requestOptions= merge(requestOptions, {
    headers: { "Content-type": 'application/json' }
  })

  const result = await fetch(url, requestOptions)
  if (result?.status === 401) {
    const refresh_response = await refreshToken()
    if (refresh_response?.access !== undefined) {
      Cookies.set("access", refresh_response.access)

      requestOptions = merge(requestOptions, {
        headers: { "Authorization": `Bearer ${Cookies.get("access")}` }
      })

      return await fetch(url, requestOptions)

    } else {
      Cookies.remove('access')
      Cookies.remove('refresh')
      // router.replace("/login")
    }
  }
  return result
}

const refreshToken = async () => {
  return await fetch(process.env.apiUrl + "auth/token/refresh/", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "refresh": Cookies.get('refresh') })
  })
    .then(res => res.json())
}


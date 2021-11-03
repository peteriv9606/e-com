/**Build URL and fetch is used in pagination and router queries. 
 * 
 * Build URL and fetch uses JS Built-in fetch (no token attached!)
 * 
 * Usage: fetch(www.web.com/api/${path}${queryObj})
 * 
 * 
 * @param {object} queryObj - provide the query params as object ({'page':2, 'order': '-id'})
 * @param {string} path - provide path to fetch
 * 
 * Function returns response from fetch
 */
export const buildUrlAndFetch = async (queryObj, path) => {
  let url = ''
  Object.entries(queryObj).forEach(([key, value], index) => {
      url += index === 0 ? `?${key}=${value}` : `&${key}=${value}`
  })

  setTimeout(function () {
    window.scrollTo({top: 0, behavior: 'smooth'});
  },200);
  return await fetch(process.env.apiUrl + `${path}${url}`).then(res=>res.json())
}


/**Build URL andFetch SSR is used to get initial data if there are query params involved. 
 * 
 * Build URL andFetch SSR uses JS Built-in fetch (no token attached!) 
 * 
 * @param {object} context - provide context from getServersideProps (to build the query)
 * @param {string} path - provide path to fetch
 * 
 * Function returns response from fetch
 */
 export const buildUrlAndFetchSSR = async (context, path) => {
    let query = ''
    Object.entries(context.query).forEach(([key, value], index) => {
        query += index === 0 ? `?${key}=${value}` : `&${key}=${value}`
    })
    return await fetch(process.env.apiUrl + `${path}${query}`).then(res=>res.json())
}
const usr = process.env.REACT_APP_MAGENTO_USER || ''
const pass = process.env.REACT_APP_MAGENTO_PASS || ''
const domain = 'https://stage.roomservice360.com'
const apiPath = `${domain}/rest/default`

// *************** URLS ***************
function getTokenUrl(user = '', password = '') {
  return `${apiPath}/V1/integration/admin/token/?username=${`${user}`}&password=${password}`
}

// let token = 'xxx'

const magentoAuthorize = (user: string = usr, password: string = pass) => {
  const getNewToken = async () => {
    const result = await fetch(getTokenUrl(user, password), { method: 'POST' })
    // console.log(result)
    if (!result.ok) {
      if (result.status === 401) {
        throw new Error(
          'Cannot get token. Unauthorized access. Wrong username or password ?'
        )
      }
      throw new Error('non OK response from token request')
    }

    const token = (await result.json()) as string

    console.log('!!! token = ', token)
    return token
  }

  return getNewToken
}

export default magentoAuthorize

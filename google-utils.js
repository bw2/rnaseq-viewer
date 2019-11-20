
const RNA_VIEWER_CLIENT_ID = '61200892608-qphtf65o323setqdcfj4hnf601mmetvs.apps.googleusercontent.com'

const initGoogleClient = () => new Promise(resolve => {
  // init all gapi modules
  gapi.load('client:auth2', () => {
    gapi.client.load('storage', 'v1', resolve)
  })
})


const getGoogleAccessToken = async () => {
  // use OAuth2 to get an access token for RNA-seq viewer to access the google storage API on behalf of the user

  gapi.client.init({
    'clientId': RNA_VIEWER_CLIENT_ID,
    'scope': 'https://www.googleapis.com/auth/devstorage.read_only',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/storage/v1/rest']
  })

  const authInstance = await gapi.auth2.getAuthInstance()
  if(!authInstance.isSignedIn.get()) {
    await authInstance.signIn()
  }

  return () => {
    const user = authInstance.currentUser.get()
    if (!authInstance.isSignedIn.get()) {
      user.reloadAuthResponse()
    }

    return user.getAuthResponse().access_token
  }
}

const listGoogleStorageFiles = async (gsPath) => {
  if (!gsPath.startsWith("gs://")) {
    console.error(`${gsPath} doesn't start with "gs://"` )
    return
  }

  const gsPathParts = gsPath.split("/")
  if (gsPathParts.length < 3) {
    console.error(`${gsPath} must be of the form "gs://bucket-name/..."` )
    return
  }

  const bucketName = gsPathParts[2]
  const bucketSubdir = gsPathParts.slice(3).join('/')

  return await gapi.client.storage.objects.list({ bucket: bucketName, prefix: bucketSubdir, maxResults:1000})
}

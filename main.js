document.title = "RNA-seq viewer"

const initGoogleClient = async () => {
  // use OAuth2 to get an access token for RNA-seq viewer to access the google storage API on behalf of the user
  await gapi.client.init({
    'clientId': '61200892608-qphtf65o323setqdcfj4hnf601mmetvs.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/devstorage.read_only',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/storage/v1/rest']
  })

  await gapi.auth2.getAuthInstance().signIn()

  // pass access token to IGV.js
  const user = gapi.auth2.getAuthInstance().currentUser.get()
  igv.oauth.google.setToken(user.getAuthResponse().access_token)

  createIGV()
}

const createIGV = () => {
  let tracks = []

  tracks = [ 'sampleA', 'sampleB', '2sample', ].map((prefix) => {
    return {
      type: 'merged',
      name: prefix,
      height: 100,
      tracks: [
        {
          type: 'wig',
          format: "bigwig",
          url: `gs://macarthurlab-rnaseq/test_data/${prefix}.bigWig`,
          //oauthToken: token,
        },
        {
          type: 'junctions',
          format: 'bed',
          url: `gs://macarthurlab-rnaseq/test_data/${prefix}.SJ.out.tab.bed.gz`,
          indexURL: `gs://macarthurlab-rnaseq/test_data/${prefix}.SJ.out.tab.bed.gz.tbi`,
          displayMode: 'COLLAPSED',
          //oauthToken: token,
        },
      ],
    }
  })

  let options = {
    genome: 'hg38',
    //locus: 'chr1:3,826,724-3,826,763',
    locus: 'chr15:92,882,678-92,884,209',
    tracks: tracks,
  }

  let igvDiv = document.getElementById("igv-div")

  igv.createBrowser(igvDiv, options)
    .then((browser) => {
      console.log("Created IGV browser with token", token)
    })
}


const initApp = () => {
  gapi.load('client:auth2', initGoogleClient)
}


document.addEventListener("DOMContentLoaded", initApp)

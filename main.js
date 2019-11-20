
const initCheckboxes = (parentDiv, sampleInfo) => {

  sampleInfo.forEach(({label, description, spliceJunctions_bed, coverage_bigWig}) => {
    let divElem = document.createElement("div")
    let labelElem = document.createElement("label")
    let checkboxElem = document.createElement("input")
    checkboxElem.setAttribute("type", "checkbox")
    checkboxElem.addEventListener("click", (e) => {
      if (!e.target.checked) {
        igv.getBrowser().removeTrackByName(label)
        return
      }

      igv.getBrowser().loadTrack({
        type: 'merged',
        name: label,
        height: 100,
        tracks: [
          {
            type: 'wig',
            format: "bigwig",
            url: coverage_bigWig,
            //oauthToken: token,
          },
          {
            type: 'junctions',
            format: 'bed',
            url: spliceJunctions_bed,
            indexURL: `${spliceJunctions_bed}.tbi`,
            displayMode: 'COLLAPSED',
            //oauthToken: token,
          },
        ],
      })

    })
    labelElem.appendChild(checkboxElem)
    labelElem.appendChild(document.createTextNode(label))
    divElem.appendChild(labelElem)
    parentDiv.appendChild(divElem)
    if (description) {
      labelElem.insertAdjacentHTML('afterend', `<div style='color: gray; margin: 0px 0px 10px 15px'>${description}</div>`)
    }
  })
}

const initApp = async () => {

  const controlsDiv = document.getElementById('controls')
  const samplesDiv = document.getElementById('samples')
  initCheckboxes(controlsDiv, CONTROLS)
  initCheckboxes(samplesDiv, SAMPLES)

  await initGoogleClient()
  const googleAccessToken = await getGoogleAccessToken()

  igv.oauth.google.setToken(googleAccessToken)

  //init local files input
  document.getElementById('local-files').addEventListener('change', handleFileSelect, false)

  //https://cloud.google.com/storage/docs/json_api/v1/
  //const storage = await listGoogleStorageFiles('gs://macarthurlab-rnaseq/test_data')
  //if (window.File && window.FileReader && window.FileList)
  //console.log("#getGoogleStorageFiles", storage)

  const tracks = [ 'sampleA', 'sampleB', '2sample', ].map((prefix) => {
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

  // create IGV browser
  const igvDiv = document.getElementById("igv-div")
  await igv.createBrowser(igvDiv, options)


}

const handleFileSelect = (e) => {
  console.log(e.target.files)
  for (let x of e.target.files) {
    console.log(x.type, x.name)
  }
  /*
  igvBrowser.loadTrack({
    type:
    format:
    url:
  })
   */
}


document.addEventListener("DOMContentLoaded", initApp)

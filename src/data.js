import neatCsv from 'neat-csv'

function getSiteInfo() {
    const siteInfoCSV = './siteinfo.csv'
    return new Promise((resolve, reject) => {
      fetch(siteInfoCSV)
        .then(res => res.text())
        .then(data => neatCsv(data, {
          mapValues: ({ header, index, value }) => {
            if (header === 'coordinate') {
              function parseLonLat(x) {
                const reg = new RegExp("[度分秒]")
                const values = x.split(reg)
                return +values[0] + (+values[1]) / 60 + (+values[2]) / 60 / 60
              }
              const splitValue = value.split(" ")
              const lat = parseLonLat(splitValue[1])
              const lon = parseLonLat(splitValue[3])
              return [lat, lon]
            }
            else return value
          }
        }))
        .then(resolve)
        .catch(reject)
    })
  }
  
  function getRiverLog() {
    const siteInfoCSV = './riverlog_201910.csv'
    return new Promise((resolve, reject) => {
      fetch(siteInfoCSV)
        .then(res => res.text())
        .then(data => neatCsv(data, {
          mapValues: ({ header, index, value }) => {
            if (header === 'datetime') return value
            else if (value === "") return NaN
            else return +value
          }
        }))
        .then(resolve)
        .catch(reject)
    })
  }
  
  function getTyphoonTrackLog() {
    // http://agora.ex.nii.ac.jp/digital-typhoon/summary/wnp/s/201919.html.ja
    const typhoonTrackJson = './201919.ja.json'
    return new Promise((resolve, reject) => {
      fetch(typhoonTrackJson)
        .then(res => res.json())
        .then(data => {
          const log = data.features.map(d => {
            const time = d.properties.time
            const coordinates = d.geometry.coordinates
            return { [time]: [coordinates[1], coordinates[0]] }
          })
            .reduce((l, r) => Object.assign(l, r), {})
          resolve(log)
        })
        .catch(reject)
    })
  }

  export {
      getRiverLog,
      getSiteInfo,
      getTyphoonTrackLog,
  }

import colormap from 'colormap'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import './leafletHelper'
import {
  getRiverLog,
  getSiteInfo,
  getTyphoonTrackLog,
} from './data'
import './style.css'
import { isUndefined } from 'util'

const defaultCenter = [35.758771, 139.794158]
const defaultZoom = 11
const map = L.map('map', {
  zoom: defaultZoom,
  center: defaultCenter,
  zoomControl: false,
})
const attribution = [
  'Tiles &copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
  'River log &copy; <a href="http://www1.river.go.jp/">国土交通省 水文水質データベース</a>',
  'Visualization &copy; <a href="https://github.com/colspan">@colspan</a>',
  'Typhoon Track Log &copy; <a href="http://agora.ex.nii.ac.jp/digital-typhoon/summary/wnp/s/201919.html.ja">国立情報学研究所「デジタル台風」</a>'
].join(' | ')
const basemap = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', { attribution })
basemap.addTo(map)
const titleControl = L.control.title({ title: '2019年 台風19号 各河川水位可視化', position: 'topleft' }).addTo(map)
L.control.zoom({ position: 'bottomright' }).addTo(map);

Promise.all([
  getSiteInfo(),
  getRiverLog(),
  getTyphoonTrackLog(),
])
  .then(result => {
    const [siteInfo, riverLog, typhoonTrackLog] = result
    // console.log(siteInfo, riverLog)

    const riverSiteInfo = siteInfo.filter(d => d.site_id.length === 16)
    // const damSiteInfo = siteInfo.filter(d => d.site_id.length < 16)

    // calc max, min
    const riverSiteMaxMin = riverSiteInfo.map(d => {
      const siteLog = riverLog.map(x => x[d.site_id]).filter(x => !isNaN(x))
      const max = siteLog.reduce((a, b) => a > b ? a : b)
      const min = siteLog.reduce((a, b) => a < b ? a : b)
      siteLog.forEach((d, i) => {
        if (isNaN(d)) riverLog[i][d.site_id] = min
      })
      return [max, min]
    })

    // state variables
    let logIndex = 0
    const levelColor = colormap({
      colormap: 'portland',
      nshades: 30,
      format: 'hex',
      alpha: 1,
    })

    // markers
    const siteInfoMarkers = riverSiteInfo.map(d => {
      const marker = L.circleMarker(d.coordinate, {
        weight: 1,
      }).addTo(map)
      const text = `${d.site_name}`
      marker.bindTooltip(text)
      marker.site_id = d.site_id
      return marker
    })
    // update markers
    function updateMarkers() {
      siteInfoMarkers.forEach((d, i) => {
        let value = riverLog[logIndex][d.site_id]
        const [max, min] = riverSiteMaxMin[i]
        const color = levelColor[parseInt((value - min) / (max - min) * (levelColor.length - 1), 10)]
        if (!isNaN(value)) {
          d.setRadius((value - min) * 10 + 5)
          d.setStyle({
            color,
            fillColor: color,
          })
        } else {
          d.setRadius(1)
        }
      })
    }

    // typhoon track
    const typhoonTrackTimes = Object.keys(typhoonTrackLog).map(d => +d)
    const typhoonTrackPositions = Object.values(typhoonTrackLog)
    const typhoonTrackPath = L.polyline(typhoonTrackPositions, { color: 'yellow', weight: 1 })
    typhoonTrackPath.addTo(map)
    const typhoonPosMarker = L.marker(typhoonTrackPositions[0])
    typhoonPosMarker.addTo(map)
    function updateTyphoonTrack() {
      const currentTime = Date.parse(riverLog[logIndex].datetime) / 1000
      const targetIndex = typhoonTrackTimes.reduce((pre, current, i) => current <= currentTime ? i : pre, 0)
      let currentPos
      if (targetIndex === 0 || targetIndex === typhoonTrackPositions.length - 1) {
        currentPos = typhoonTrackPositions[targetIndex]
      } else {
        const lastPos = typhoonTrackPositions[targetIndex]
        const nextPos = typhoonTrackPositions[targetIndex + 1]
        const linearInterpolation = (x, y, i, x_d) => {
          return (y[i + 1] - y[i]) / (x[i + 1] - x[i]) * (x_d - x[i]) + y[i]
        }
        currentPos = [
          linearInterpolation(typhoonTrackTimes, typhoonTrackPositions.map(d => d[0]), targetIndex, currentTime),
          linearInterpolation(typhoonTrackTimes, typhoonTrackPositions.map(d => d[1]), targetIndex, currentTime)
        ]
      }
      typhoonPosMarker.setLatLng(currentPos)
    }

    // indicator
    const mapIndicator = L.control.emptyDiv({ position: 'bottomleft', className: 'map-indicator' })
    const mapIndicatorContainer = mapIndicator.addTo(map)
    /// current time indicator
    const currentTimeContainer = document.createElement('div')
    currentTimeContainer.className = 'datetime'
    mapIndicatorContainer.getContainer().appendChild(currentTimeContainer)
    const timeSliderContainer = document.createElement('input')
    /// time slider
    timeSliderContainer.className = 'selector'
    timeSliderContainer.type = 'range'
    timeSliderContainer.min = 0
    timeSliderContainer.max = riverLog.length - 1
    mapIndicatorContainer.getContainer().appendChild(timeSliderContainer)
    function updateIndicator() {
      currentTimeContainer.innerHTML = riverLog[logIndex].datetime
      mapIndicatorContainer.value = logIndex
      timeSliderContainer.value = logIndex
    }

    // start animation
    const updateInterval = 100
    let animIntervalObj
    const updateIndex = (newIndex) => {
      if (isUndefined(newIndex)) {
        logIndex += 1
      }
      else {
        logIndex = newIndex
      }
      if (riverLog.length <= logIndex || logIndex < 0) logIndex = 0
      updateMarkers()
      updateIndicator()
      updateTyphoonTrack()
    }
    timeSliderContainer.addEventListener('input', (e) => {
      clearInterval(animIntervalObj)
      map.dragging.disable();
      logIndex = +e.target.value
      updateIndex(logIndex)
    })
    timeSliderContainer.addEventListener('change', () => {
      animIntervalObj = setInterval(updateIndex, updateInterval)
      map.dragging.enable();
    })
    animIntervalObj = setInterval(updateIndex, updateInterval)

  })
  .catch(console.error)

'use strict'
const path = require('path')
const fs = require('fs')

function getRouters (truePath) {
  const files = fs.readdirSync(path.join(__dirname, truePath))
  const componentPath = path.join(__dirname, truePath)
  let routers = []
  files.forEach((file, index) => {
    if (file.endsWith('.vue')) {
      let temp = componentPath.replace(path.join(__dirname, '../src/pages/'), '') 
      let routerPath = temp + '/' + file.replace('.vue', '')
      routerPath = routerPath.indexOf('/') === 0 ? routerPath : '/' + routerPath
      routerPath = routerPath.replace(/\\/g, '\/') 
      let component = {
        path: '"' + routerPath + '"',
        name: '"' + routerPath.replace(/\//g, '_') + '"',
        componentPath: '"' + routerPath + '"'
      }
      routers.push(component)
    } else {
      let oldRouters = routers
      if(!truePath.endsWith("/")){
        truePath += "/"
      }
      let newRouters = getRouters(truePath + file)
      routers = [...oldRouters, ...newRouters]
    }
  })
  return routers
}
let routers = getRouters ('../src/pages/')
module.exports = routers

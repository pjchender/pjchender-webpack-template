import midImgUrl from './../assets/mid.jpeg'
import minImgUrl from './../assets/min.jpeg'

// midImg 會是被壓縮過的檔案名稱
const midImg = document.createElement('img')
midImg.src = midImgUrl
document.body.appendChild(midImg)

// minImg 是被注入在 bundle.js 中，可以直接使用
const minImg = document.createElement('img')
minImg.src = minImgUrl
document.body.appendChild(minImg)

export {midImg, minImg}

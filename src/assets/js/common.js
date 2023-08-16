const getImgSize = url => {
  return new Promise(resolve => {
    let imgObj = new Image()
    imgObj.src = url
    imgObj.onload = () => {
      let scale = parseFloat(imgObj.height / imgObj.width)
      resolve({
        width: imgObj.width,
        height: imgObj.height,
        scale: scale,
      })
    }
  })
}

export { getImgSize }
import Canvas2Image from './canvas2Image.js'
class ConvertImage {
    imageUrl = '' //图片url地址 通过初始化构建
    sourceImage = null // 图片对象 通过初始化构建
    baseCanvas = null // 初始化的canvas对象
    sourceCanvas = null // canvas对象 主要针对其进行图片处理操作
    // imageDegree = 0 // 旋转度数
    imageFlipX = -1 // 水平反转
    imageFlipY = -1 // 垂直反转
    /**
     * 构造函数
     * @param {*} url 图片url
     * @param {Function} loadedCallback 图片初始化加载完毕回掉
     */
    constructor(url, loadedCallback) {
        // 如果url存在则加载url图片，否则不操作，只相应方法
        if (url) {
            this.init(url, loadedCallback)
        }
    }
    /**
     * 初始化方法
     * @param {*} url
     * @param {Function} loadedCallback 图片初始化加载完毕回掉
     */
    init(url, loadedCallback) {
        this.imageUrl = url
        this._loadImage(url).then(image => {
            this.sourceImage = image
            let cvs = this._createCanvas(image.naturalWidth, image.naturalHeight) // 根据图片宽高创建canvas对象
            let ctx = cvs.getContext('2d')
            ctx.drawImage(image, 0, 0, image.width, image.height);
            this.baseCanvas = cvs
            this.sourceCanvas = null //清空 防止二次初始化

            loadedCallback && (typeof loadedCallback == 'function') && loadedCallback()
        })
    }
    /**
     * 是否加载图片
     */
    isLoadedImage() {
        if (!("getContext" in document.createElement('canvas'))) {
            console.log('当前浏览器不支持canvas!')
            return false
        }

        // 如果图片不存在，代表未初始化图片，不允许旋转或翻转图片
        if (!this.imageUrl || !this.sourceImage || !this.baseCanvas) {
            console.log('canvas图片未初始化!')
            return false
        }
        return true
    }
    /**
     * 获取图片blob文件
     */
    getImageBase64() {
        if (!this.isLoadedImage()) return null

        // let sourceImage = this.sourceImage
        let cvs = this.sourceCanvas ? this.sourceCanvas : this.baseCanvas
        let ctx = cvs.getContext('2d')
        // ctx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height)
        return new Promise(resolve => {
            const base64 = cvs.toDataURL()
            const newFile = this.dataURLtoFile(base64, 'new_image')
            resolve(newFile)
        })
    }
    /**
     * 获取图片blob文件
     */
    getImageBlob() {
        if (!this.isLoadedImage()) return null

        // let sourceImage = this.sourceImage
        let cvs = this.sourceCanvas ? this.sourceCanvas : this.baseCanvas
        let ctx = cvs.getContext('2d')
        // ctx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height)
        return new Promise(resolve => {
            cvs.toBlob(blob => {
                resolve(blob)
            })
        })
    }
    dataURLtoFile(dataurl, filename) { //将base64转换为文件
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }
    /**
     * 加载图片
     * @param {*} url 图片url
     */
    _loadImage(url) {
        return new Promise((resolve, reject) => {
            var image = new Image()
            image.setAttribute('crossOrigin', 'anonymous'); // 解决使用网络图片跨域问题
            image.src = url
            image.onload = () => {
              // var oFReader = new FileReader();
              //         oFReader.readAsDataURL(this.files[0]);
              //         oFReader.onload = function (oFREvent) {
              //             alert(oFREvent.target.result);
              //         };
                resolve(image)
            }
        })
    }
    /**
     * 创建canvas对象
     * @param {*} w canvas宽
     * @param {*} h canvas高
     */
    _createCanvas(w, h) {
        let canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        return canvas
    }
    /**
     * 根据度数进行旋转
     * @param {*} degree 旋转角度，只支持90的倍数
     */
    _rotate(degree) {
        return new Promise(resolve => {
            // 如果canvas未初始化，不进行处理
            if (!this.isLoadedImage()) {
                reject('图片未初始化')
                return
            }
            let sourceImage = this.sourceImage// ? this.sourceImage : this.baseCanvas
            let w = sourceImage.naturalWidth // 图片宽
            let h = sourceImage.naturalHeight // 图片高
            // let oldcvs = this.sourceCanvas ? this.sourceCanvas : this.baseCanvas
            let cvs = this._createCanvas(w, h);
            let ctx = cvs.getContext('2d')
            ctx.save()
            degree %= 360
            if (degree == 90 || degree == -90) {
                // 旋转90度需要将canvas的宽高做替换
                cvs.width = h;
                cvs.height = w;
                ctx.translate(h / 2, w / 2);
                ctx.rotate(degree * Math.PI / 180);
                ctx.drawImage(sourceImage, -w / 2, -h / 2);
            } else if (degree == 0) {
                // 旋转度数为0
                cvs.width = w;
                cvs.height = h;
                ctx.drawImage(sourceImage, 0, 0, w, h)
            } else if (degree == 180 || degree == -180) {
                // 旋转180度
                cvs.width = w;
                cvs.height = h;
                ctx.rotate(degree * Math.PI / 180)
                ctx.drawImage(sourceImage, -w, -h, w, h)
            } else {
                console.log('不支持的旋转角度,只支持90的倍数')
            }
            ctx.restore()

            this.sourceCanvas = cvs
            // cvs.toBlob(function (blob) {
            //     resolve(blob);
            //     cvs = null;
            //     ctx = null;
            // },"image/jpeg")
            const result = Canvas2Image.getAsJPEG(cvs, cvs.width, cvs.height)
            resolve(result)
        })
    }
    // 向左旋转90度
    slideLeft() {
        const degree = 90 //* Math.PI / 180;
        return new Promise(resolve => {
            this._rotate(degree).then(blob => {
                resolve(blob)
            }).catch(err => {
                reject(err)
            })
        })
    }
    // 向右旋转90度
    slideRight() {
        const degree = -90 //* Math.PI / 180;
        return new Promise(resolve => {
            this._rotate(degree).then(blob => {
                resolve(blob)
            }).catch(err => {
                reject(err)
            })
        })
    }
    /**
     * 翻转
     * @param {*} x 水平 1为反转 0为不翻转
     * @param {*} y 垂直 1为反转 0为不翻转
     */
    _flip(x, y) {
        return new Promise((resolve, reject) => {
            // 如果canvas未初始化，不进行处理
            if (!this.isLoadedImage()) {
                reject('图片未初始化')
                return
            }
            let sourceImage = this.sourceImage
            let w = sourceImage.naturalWidth;
            let h = sourceImage.naturalHeight;
            // let oldcvs = this.sourceCanvas ? this.sourceCanvas : this.baseCanvas
            // console.log(oldcvs)
            // let oldctx = oldcvs.getContext('2d')
            // let oldImageData = oldctx.getImageData(0,0,oldcvs.width,oldcvs.height)
            let cvs = this._createCanvas(w, h);
            let ctx = cvs.getContext('2d');
            ctx.save();
            // this.imageFlipX *= -x
            // this.imageFlipY *= -y
            // console.log(x, y)
            ctx.scale(-1 * x, -1 * y)
            ctx.drawImage(sourceImage, x > 0 ? -w : 0, y > 0 ? -h : 0);
            ctx.restore();

            this.sourceCanvas = cvs

            // cvs.toBlob(function (blob) {
            //     resolve(blob);
            //     cvs = null;
            //     ctx = null;
            // },"image/jpeg")
            // console.log(Canvas2Image)
            const result = Canvas2Image.getAsJPEG(cvs, cvs.width, cvs.height)
            // console.log(result)
            resolve(result)
        })
    }
    /**
     * 水平翻转
     */
    flipX() {
        return new Promise(resolve => {
            this._flip(1, -1).then(blob => {
                resolve(blob)
            })
        }).catch(err => {
            reject(err)
        })
    }
    /**
     * 垂直翻转
     */
    flipY() {
        return new Promise(resolve => {
            this._flip(-1, 1).then(blob => {
                resolve(blob)
            })
        }).catch(err => {
            reject(err)
        })
    }
    /**
     * 上传图片压缩，通过canvas压缩图片
     */
    compress(file, quality, mime, maxWidth = 2000, maxHeight = 1600) {
        return new Promise((resolve, reject) => {
            // this.fileToBase64(file).then(base64 => {
            let base64 = URL.createObjectURL(file)
            this._loadImage(base64).then(image => {
                var canvas = this._createCanvas()
                var context = canvas.getContext('2d')
                var rate = image.width / image.height
                var maxMirror = image.width > image.height ? 'w' : 'h' // 长边为宽还是高
                var width, height
                if (maxMirror == 'w') {
                    width = image.width > maxWidth ? maxWidth : image.width
                    height = width / rate
                } else {
                    height = image.height > maxHeight ? maxHeight : image.height
                    width = height * rate
                }
                canvas.width = width
                canvas.height = height
                context.drawImage(image, 0, 0, width, height)
                // if (quality < 0 || quality > 1) {
                //     resolve(file)
                //     return
                // }
                // let dataurl = canvas.toDataURL(file.type, quality)
                // this.base64ToFile(dataurl, file.name).then(newFile => {
                //     resolve(newFile)
                // })
                canvas.toBlob(function (blob) {
                    // const newFile = new File([blob], file.name, {
                    //     type: mime ? mime : file.type,//file.type,
                    //     lastModified: Date.now()
                    // })
                    resolve(blob)
                }, mime ? mime : file.type) // , quality由于png无法进行质量压缩，所以统一将png转成jpg
            }).catch(err => {
                reject(err)
            })
        })
    }

}
export default ConvertImage

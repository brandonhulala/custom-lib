/*
 * @Author: huxudong
 * @Date: 2021-01-11 09:21:19
 * @LastEditTime: 2021-04-14 15:04:39
 * @Description: 提供与各种文件相关的处理方法
 */
// 获取图片信息
export function getImageInfo(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;

        if (image.complete) {
            resolve(image);
        } else {
            image.onload = function () {
                resolve(image);
            };
            image.onerror = function () {
                reject(new Error("图片读取失败"));
            };
        }
    });
}

// 获取文件内容
export function getFileContent(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const fileName = file.name;
        const fileExt = fileName.substring(fileName.lastIndexOf("."));
        const reader: any = new FileReader();

        switch (fileExt) {
            case ".json":
                reader.onload = () => {
                    try {
                        const data = JSON.parse(reader.result);
                        resolve(data);
                    } catch (err) {
                        console.log(err);
                        reject(new Error("文件读取失败"));
                    }
                };
                reader.readAsText(file);
                break;
            case ".xls":
            case ".xlsx":
                reader.onload = () => {
                    try {
                        let binary = "", readydata: any = "", outdata = [];

                        const bytes = new Uint8Array(reader.result);
                        for (let i = 0; i < bytes.byteLength; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        const XLSX = require('xlsx');
                        readydata = XLSX.read(binary, { type: "binary" });
                        outdata = XLSX.utils.sheet_to_json(
                            readydata.Sheets[readydata.SheetNames[0]],
                            {
                                defval: '',
                                raw: false
                            }
                        );

                        resolve(outdata);
                    } catch (err) {
                        console.log(err);
                        reject(new Error("文件读取失败"));
                    }
                };
                reader.readAsArrayBuffer(file);
                break;
            default:
                resolve(null);
        }
    });
}

// 将文件对象转换为链接
export function fileToObjectURL(file: any): string {
    let url = '';

    if (window['createObjcectURL'] != undefined) {
        url = window['createObjcectURL'](file);
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
    }

    return url;
}

// 将文件对象转换为base64
export function fileToDataURL(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader() as any;
        fileReader.readAsDataURL(obj);
        fileReader.onload = function (event) {
            const dataURL = event.target.result;
            resolve(dataURL);
        };
        fileReader.onerror = function () {
            reject(new Error('fileToBase64 error'));
        }
    });
}

// 将图片链接转换为base64
export function imgURLToDataURL(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = url;

        image.onload = function () {
            const { width, height } = image;
            const canvas = document.createElement("canvas") as any;
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d").drawImage(image, 0, 0);
            const dataURL = canvas.toDataURL();
            resolve(dataURL);
        };

        image.onerror = function () {
            reject(new Error('urlToBase64 error'));
        }
    });
}

// 将base64转换为文件对象
export function dataURLtoFile(dataURL: string): any {
    let arr: any = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new (File as any)([u8arr], new Date().getTime() + '.png', { type: mime });
}

// 将base64转换为二进制
export function dataURLtoBlob(dataURL: string): any {
    let arr: any = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime })
}

// 将二进制下载成一个文件
export function blobToDownload(blob: any, fileName: string): void {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        let objectUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.download = fileName;
        // a.click();
        let evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        a.dispatchEvent(evt);
        a.remove();
        window.URL.revokeObjectURL(objectUrl);
    }
}

// 导出列表数据
export function exportListData(data: any, fileName: string) {
    try {
        const blob = new Blob([JSON.stringify(data)], { type: "" });
        blobToDownload(blob, fileName);
    } catch (err) {
        console.log(err);
        throw new Error('导出失败');
    }
}

/*
 * @Author: huxudong
 * @Date: 2021-01-11 09:21:19
 * @LastEditTime: 2021-04-14 14:45:49
 * @Description: 提供与各种文件相关的处理方法
 */
import jszip from 'jszip';
import { blobToDownload } from './fileUtil';

// 压缩文件
export function zipFile(data: any, fileName: string, zipName: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const zip: any = new jszip();
        zip.file(fileName, JSON.stringify(data));
        zip.generateAsync({ type: "blob" })
            .then((content) => {
                blobToDownload(content, zipName);
                resolve();
            }).catch(err => {
                reject(err);
            });
    })
}

// 解压文件
export function unZipFile(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const zip: any = new jszip();
        zip.loadAsync(file)
            .then((zip) => {
                for (let key in zip.files) {
                    const { dir, name } = zip.files[key];
                    if (!dir) {
                        if (/\.(txt|json)$/.test(name)) {
                            const base = zip.file(name).async('string');
                            base.then(res => {
                                resolve(res);
                            });
                        }
                        if (/\.(png|jpg|jpeg|gif)$/.test(name)) {
                            const base = zip.file(name).async('base64');
                            base.then(res => {
                                resolve(`data:image/png;base64,${res}`);
                            });
                        }
                    }
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}


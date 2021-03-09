/*
 * @Author: huxudong
 * @Date: 2021-01-11 09:21:19
 * @LastEditTime: 2021-03-08 14:16:14
 * @Description: 提供与各种文件相关的处理方法
 */
import XLSX from 'xlsx';
import jszip from 'jszip';

// 文件扩展名与文件类型的映射关系
export const MimeType: object = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.pdf': 'application/pdf',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

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

// 压缩文件
export function zipFile(data: any, fileName: string, zipName: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const zip = new jszip();
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

// 将json导出为excel
export function export_json_to_excel(th: any, jsonData: any[], title: string) {
    let data = jsonData;
    data.unshift(th);
    let ws_name = "SheetJS";
    let wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
    const colWidth = data.map(row => row.map(val => {
        if (val == null) {
            return { 'wch': 10 };
        }
        else if (val.toString().charCodeAt(0) > 255) {
            return { 'wch': val.toString().length * 2 };
        } else {
            return { 'wch': val.toString().length };
        }
    }))
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
        for (let j = 0; j < colWidth[i].length; j++) {
            if (result[j]['wch'] < colWidth[i][j]['wch']) {
                result[j]['wch'] = colWidth[i][j]['wch'];
            }
        }
    }
    ws['!cols'] = result;
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    let blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    let fileName = (title || 'excel-list') + ".xlsx";
    blobToDownload(blob, fileName);
    return Promise.resolve(fileName);
}

// 将表格导出为excel
export function export_table_to_excel(id: string, title: string) {
    let theTable = document.getElementById(id);
    let oo = generateArray(theTable);
    let ranges = oo[1];
    let data = oo[0];
    let ws_name = "SheetJS";
    let wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
    ws['!merges'] = ranges;
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    let blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    let fileName = (title || 'excel-list') + ".xlsx";
    blobToDownload(blob, fileName);
    return Promise.resolve(fileName);
}

function generateArray(table: any): any {
    let out: any = [];
    let rows = table.querySelectorAll('tr');
    let ranges: any = [];
    for (let R = 0; R < rows.length; ++R) {
        let outRow: any = [];
        let row = rows[R];
        let columns = row.querySelectorAll('td');
        for (let C = 0; C < columns.length; ++C) {
            let cell = columns[C];
            let colspan = cell.getAttribute('colspan');
            let rowspan = cell.getAttribute('rowspan');
            let cellValue = cell.innerText;
            if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;
            ranges.forEach(function (range) {
                if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                }
            });
            if (rowspan || colspan) {
                rowspan = rowspan || 1;
                colspan = colspan || 1;
                ranges.push({ s: { r: R, c: outRow.length }, e: { r: R + rowspan - 1, c: outRow.length + colspan - 1 } });
            }
            outRow.push(cellValue !== "" ? cellValue : null);
            if (colspan) for (let k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
    }
    return [out, ranges];
}
function datenum(v: any, date1904?): number {
    if (date1904) v += 1462;
    let epoch = Date.parse(v);
    return (epoch - (new Date(Date.UTC(1899, 11, 30)) as any)) / (24 * 60 * 60 * 1000);
}
function sheet_from_array_of_arrays(data: any) {
    let ws = {};
    let range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    for (let R = 0; R != data.length; ++R) {
        for (let C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            let cell: any = { v: data[R][C] };
            if (cell.v == null) continue;
            let cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = (XLSX.SSF as any)._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';
            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}
function Workbook(): void {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}
function s2ab(s: any): any {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

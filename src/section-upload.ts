// script
export function downloadRange(url, start, end, i) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.setRequestHeader("range", `bytes=${start}-${end}`);
    req.responseType = "blob";
    req.onload = function (oEvent) {
      req.response.arrayBuffer().then((res) => {
        resolve({
          i,
          buffer: res,
        });
      });
    };
    req.send();
  });
}
// 合并buffer
export function concatenate(resultConstructor, arrays) {
  let totalLength = 0;
  for (let arr of arrays) {
    totalLength += arr.length;
  }
  let result = new resultConstructor(totalLength);
  let offset = 0;
  for (let arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
download2.onclick = () => {
  axios({
    url,
    method: "head",
  }).then((res) => {
    // 获取长度来进行分割块
    console.time("并发下载");
    const size = Number(res.headers["content-length"]);
    const length = parseInt(size / m);
    const arr = [];
    for (let i = 0; i < length; i++) {
      let start = i * m;
      let end = i == length - 1 ? size - 1 : (i + 1) * m - 1;
      arr.push(downloadRange(url, start, end, i));
    }
    Promise.all(arr).then((res) => {
      const arrBufferList = res
        .sort((item) => item.i - item.i)
        .map((item) => new Uint8Array(item.buffer));
      const allBuffer = concatenate(Uint8Array, arrBufferList);
      const blob = new Blob([allBuffer], { type: "image/jpeg" });
      const blobUrl = URL.createObjectURL(blob);
      const aTag = document.createElement("a");
      aTag.download = "360_0388.jpg";
      aTag.href = blobUrl;
      aTag.click();
      URL.revokeObjectURL(blob);
      console.timeEnd("并发下载");
    });
  });
};

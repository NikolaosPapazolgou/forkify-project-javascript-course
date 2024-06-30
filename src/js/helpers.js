import { TIMEOUT_SEC } from './config';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData ? fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData)
    }) : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    //2)Providing an handmade error string 
    if (!res.ok) {
      throw new Error(`Error: ${data.message} , ${res.status}`)
    }
    return data;
  }
  catch (err) {

    throw err;
  }
// }
// export const getJSON = async function (url) {
//   try {
//     //1) Loading data:
//     //Promise.race method chooses the first promise that will return an answer either resolved or rejected
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await res.json();
//     //2)Providing an handmade error string
//     if (!res.ok) {
//       throw new Error(`Error: ${res.status} , ${data.message}`)
//     }
//     return data;
//   } catch (err) {
//     throw err;
//   }
// }

// export const sendJSON = async function (url, uploadData) {
//   try {
//     //1) Loading data:
//     //Promise.race method chooses the first promise that will return an answer either resolved or rejected
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(uploadData)
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();
//     //2)Providing an handmade error string
//     if (!res.ok) {
//       throw new Error(`Error: ${res.status} , ${data.message}`)
//     }
//     return data;
//   } catch (err) {
//     throw err;
//   }
// }

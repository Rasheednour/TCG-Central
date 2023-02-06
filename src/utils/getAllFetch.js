export default async function getAllFetch(
  url,
  code = null,
  accessToken = null,
  subPath = ""
) {
  return await fetch(url + subPath, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    mehod: "GET",
  })
    .then((res) => {
      if (res.status < 300) {
        //console.log("got a response from " + url);
        return res.json();
      } else {
        console.log(
          `error in retrieval from ${subPath}`,
          res.status,
          res.json()
        );
        return [];
      }
    })
    .then((data) => {
      //console.log("returning data", data);
      return data;
    });
}

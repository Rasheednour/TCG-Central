export default async function getAllRules(
  url,
  code = null,
  accessToken = null
) {
  return await fetch(url + "/rules", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    mehod: "GET",
  })
    .then((res) => {
      if (res.status < 300) {
        return res.json();
      } else {
        console.log("error in rule retrieval", res.status, res.json());
        return [];
      }
    })
    .then((data) => {
      return data;
    });
}

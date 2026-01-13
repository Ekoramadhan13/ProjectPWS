const token = localStorage.getItem("token");

function generate() {
  fetch(`${BASE_URL}/user/apikey`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("key").innerText = data.api_key;
  });
}

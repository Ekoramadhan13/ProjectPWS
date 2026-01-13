function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  fetch(`${BASE_URL}/${role}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);
      window.location.href = role === "admin"
        ? "admin/dashboard.html"
        : "user/dashboard.html";
    } else {
      alert("Login gagal");
    }
  });
}

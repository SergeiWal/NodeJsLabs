window.addEventListener("load", () => {
  console.log("There is JS");
});

window.addEventListener("load", () => {
  fetch("http://localhost:5000/json/data.json", { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.querySelector(".json_data").innerHTML = JSON.stringify(data);
    });
});

window.addEventListener("load", () => {
  fetch("http://localhost:5000/xml/data.xml", { method: "GET" })
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      document.querySelector(".xml_data").innerHTML = data;
    });
});

Chart.defaults.backgroundColor = "rgb(128, 138, 135)";
var stored = [[0], [0], [0], [0], [0], [0]];
const httpRequest = new XMLHttpRequest();

function draw_line_chart(data, element_id, label="數據", color="rgb(128, 138, 135)") {
      const ctx = document.getElementById(element_id);
      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: stored[5],
          datasets: [{
            label: label,
            data: data,
            borderWidth: 3,
            borderColor: color,
          }]
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false, 
            }
          }
        }
      });

      return chart
}

charts = []

for (i = 0; i < stored.length - 1; i++) {
  charts.push(draw_line_chart(stored[i], `chart${i+1}`, `數據${i+1}`));
}



function shortPolling() {
    httpRequest.open("GET", "http://10.240.40.209:5000", true)
    httpRequest.setRequestHeader('Access-Control-Allow-Headers', '*');
    httpRequest.setRequestHeader('Content-type', 'application/ecmascript');
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      console.log(httpRequest.responseText);
      var data = JSON.parse(httpRequest.responseText);

      value1 = Number(data.p1);
      charts[0].data.datasets[0].data.push(value1);
      value2 = Number(data.p2);
      charts[1].data.datasets[0].data.push(value2);
      value3 = Number(data.p3);
      charts[2].data.datasets[0].data.push(value3);
      value4 = Number(data.p4);
      charts[3].data.datasets[0].data.push(value4);
      value5 = Number(data.p5);
      charts[4].data.datasets[0].data.push(value5);
      value6 = toString(new Date(data.time*1000));    
      charts[0].data.labels.push(value6);
      charts[1].data.labels.push(value6);
      charts[2].data.labels.push(value6);
      charts[3].data.labels.push(value6);
      charts[4].data.labels.push(value6);
    };
   }
;

setInterval(shortPolling, 2000);

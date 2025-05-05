class ServerInfoPawn {
  setup() {
    this.allowedObjectsServer = new Set();
    this.lastClickedObjectServer = null;
    this.objectServer = null;
    this.subscribe(this.id, "3dModelLoaded", "ModelLoadedServer");
    console.log("serverInfo setup ");
    this.addEventListener("pointerTap", "onTapserver");
    this.rackChart = null;
  }

  ModelLoadedServer() {
    if (
      !this.shape ||
      !this.shape.children ||
      this.shape.children.length === 0
    ) {
      console.error("Shape or children are not properly defined.");
      return;
    }
    console.log("HighlightPawn ModelLoaded");

    this.objectServer = this.shape.children[0];
    if (!this.objectServer) {
      console.error("No valid object found in shape's children.");
      return;
    }
    console.log("Model server is", this.objectServer);

    this.allowedObjectsServer.add(this.objectServer);
  }

  onTapserver(event) {
    if (!this.objectServer || !this.objectServer.children) {
      console.error("3D model not loaded yet or failed to load");
      return;
    }

    let avatar = this.getMyAvatar();
    let raycaster = avatar.setRaycastFrom2D(event.xy);

    const intersects = raycaster.intersectObjects(
      this.objectServer.children,
      true
    );

    if (intersects.length === 0) {
      this.hideAllInfo();
      return;
    }

    let clickedObjectServer = intersects[0].object;

    if (this.lastClickedObjectServer === clickedObjectServer) {
      this.hideAllInfo();
      this.lastClickedObjectServer = null;
      return;
    }

    this.lastClickedObjectServer = clickedObjectServer;

    console.log("Clicked object: server pawn ", clickedObjectServer.name);

    let isRack = false;
    let isServer = false;
    let isSwitch = false;
    for (let i = 3; i <= 148; i++) {
      if (i >= 4 && i <= 17) continue;

      const child = this.objectServer.children[i];
      if (!child || !child.children) continue;

      if (clickedObjectServer === child.children[12]) {
        isRack = true;
        break;
      }
    }

    if (isRack) {
      this.rackinfo(clickedObjectServer);
      this.hideServerInfo();
      this.hideSwitchInfo();
      return;
    }

    for (let i = 3; i <= 148; i++) {
      if (i >= 4 && i <= 17) continue;

      const child = this.objectServer.children[i];
      if (!child || !child.children) continue;

      for (let j = 0; j <= 11; j++) {
        if (!child.children[j] || !child.children[j].children) continue;

        for (let k = 0; k <= 1; k++) {
          if (
            child.children[j].children[k] &&
            clickedObjectServer === child.children[j].children[k]
          ) {
            isServer = true;
            break;
          }
        }
        if (isServer) break;
      }
      if (isServer) break;
    }

    if (isServer) {
      console.log("jenkrkdmk", clickedObjectServer);
      this.hideRackInfo();
      this.hideSwitchInfo();
      this.serverinfo(clickedObjectServer);
    }
    for (let i = 3; i <= 148; i++) {
      if (i >= 4 && i <= 17) continue;

      const child = this.objectServer.children[i];
      if (!child || !child.children) continue;

      if (clickedObjectServer === child.children[13]) {
        isSwitch = true;
        break;
      }
    }

    if (isSwitch) {
      this.switchinfo(clickedObjectServer);
      this.hideServerInfo();
      this.hideRackInfo();
      return;
    } else {
      this.hideAllInfo();
    }
  }
  async rackinfo(serverObject) {
    const rackInfo = document.getElementById("rackInfo");
    if (!rackInfo) {
      console.error("rackInfo element not found");
      return;
    }

    let current = serverObject;
    while (current && !current.name?.startsWith("Server_Rack")) {
      current = current.parent;
    }

    const rackName = current?.name;
    if (!rackName) {
      console.error("No valid rack name found from clicked object.");
      return;
    }

    const apiUrl = `https://ems-backend-ui21.onrender.com/api/v1/ems/rack/${rackName}`;
    const historyUrl = `https://ems-backend-ui21.onrender.com/api/v1/ems/rack-history/${rackName}`;

    try {
      const [currentRes, historyRes] = await Promise.all([
        fetch(apiUrl),
        fetch(historyUrl),
      ]);

      const currentData = await currentRes.json();
      const historyData = await historyRes.json();

      const data = currentData?.data;
      const history = historyData?.data;

      if (!data || !history) {
        rackInfo.innerHTML = `<p>No data found for ${rackName}</p>`;
        rackInfo.style.display = "block";
        return;
      }

      // Format time labels and datasets
      const categories = history.serverUtilization.map((d) =>
        new Date(d.createdAt).toLocaleTimeString()
      );
      const utilizationData = history.serverUtilization.map((d) => d.value);
      const temperatureData = history.temperatureModeling.map((d) => d.value);
      const trafficData = history.networkTrafficUsage.map((d) => d.value);
      const powerData = history.itPower.map((d) => d.value);

      // Set rack info text + div for Highcharts
      rackInfo.innerHTML = `
      <h3>${data.rack_name || "N/A"} Info</h3>
      <p><strong>Row:</strong> ${data.row_name}</p>
      <p><strong>Servers:</strong> 12 servers</p>
      <p><strong>PUE:</strong> ${data.pue} ${data.pue_unit}</p>
      <p><strong>HVAC Power:</strong> ${data.hvac_power} ${
        data.hvac_power_unit
      }</p>
      <p><strong>Total UPS Power:</strong> ${data.total_ups_power} kW</p>
      <p><strong>UPS Time:</strong> ${data.total_ups_time} hrs</p>
      <p><strong>CFD:</strong> ${data.cfd}</p>
      <p><strong>Last Updated:</strong> ${new Date(
        data.createdAt
      ).toLocaleString()}</p>
      <hr>
      <div id="rackChart" style="width:100%; height:400px;"></div>
    `;

      rackInfo.style.left = "10px";
      rackInfo.style.top = "10px";
      rackInfo.style.display = "block";

      // Render Highchart
      Highcharts.chart("rackChart", {
        chart: { type: "line", backgroundColor: "rgba(255, 255, 255, 0.4)" },

        style: {
          color: "black",
          fontWeight: "bold",
        },
        title: {
          text: `Rack: ${rackName} - Live Metrics`,
          style: {
            color: "black",
            fontWeight: "bold",
            fontSize: "14px",
          },
        },
        credits: { enabled: false },
        xAxis: {
          categories,
          title: {
            text: "Time",
            style: {
              color: "black",
              fontWeight: "bold",
              fontSize: "14px",
            },
          },
        },
        yAxis: {
          title: {
            text: "Metric Values",
            style: {
              color: "black",
              fontWeight: "bold",
              fontSize: "14px",
            },
          },
          min: 0,
          max: 80,
          tickInterval: 10,
          labels: {
            style: {
              color: "black",
            },
          },
        },
        series: [
          {
            name: "Server Utilization (%)",
            data: utilizationData,
            color: "blue",
          },
          {
            name: "Temperature (°C)",
            data: temperatureData,
            color: "red",
          },
          {
            name: "Network Traffic (%)",
            data: trafficData,
            color: "green",
          },
          {
            name: "IT Power (kW)",
            data: powerData,
            color: "orange",
          },
        ],
        responsive: {
          rules: [
            {
              condition: { maxWidth: 800 },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                },
              },
            },
          ],
        },
      });

      // Refresh every 5 minutes
      clearInterval(window.liveChartInterval);
      window.liveChartInterval = setInterval(
        () => rackinfo(serverObject),
        300000
      );
    } catch (error) {
      console.error("Error fetching rack data:", error);
      rackInfo.innerHTML = `<p>Error loading data.</p>`;
      rackInfo.style.display = "block";
    }
  }
  async serverinfo(serverObject) {
    const serverInfo = document.getElementById("serverInfo");
    if (!serverInfo) {
      console.error("serverInfo element not found");
      return;
    }

    let current = serverObject;
    while (current && !current.name?.startsWith("server")) {
      current = current.parent;
    }

    let rawName = current?.name;
    if (!rawName) {
      console.error("No valid server name found from clicked object.");
      return;
    }

    const match = rawName.match(/server(\d+)_\d+/);
    if (!match) {
      console.error("Invalid server name format:", rawName);
      return;
    }

    const number = parseInt(match[1], 10);
    const serverName = `server_${number}`;

    const infoUrl = `https://ems-backend-ui21.onrender.com/api/v1/ems/server/${serverName}`;
    const historyUrl = `https://ems-backend-ui21.onrender.com/api/v1/ems/history/${serverName}`;

    try {
      const [infoRes, historyRes] = await Promise.all([
        fetch(infoUrl),
        fetch(historyUrl),
      ]);

      const infoData = await infoRes.json();
      const historyData = await historyRes.json();

      const data = infoData?.data;
      const history = historyData?.data;

      if (!data || !history) {
        serverInfo.innerHTML = `<p>No data found for ${serverName}</p>`;
        serverInfo.style.display = "block";
        return;
      }

      const categories = history.cpuUtilization.map((d) =>
        new Date(d.createdAt).toLocaleTimeString()
      );
      const powerData = history.powerUtilization.map((d) => d.value);
      const cpuData = history.cpuUtilization.map((d) => d.value);
      const memoryData = history.memoryUtilization.map((d) => d.value);
      const networkData = history.networkUtilization.map((d) => d.value);

      serverInfo.innerHTML = `
      <h3>${data.server_name || "N/A"} Info</h3>
      <p><strong>Rack:</strong> ${data.rack_name}</p>
      <p><strong>Row:</strong> ${data.row_name}</p>
      <p><strong>DG Set Power:</strong> ${data.dg_set_power} ${
        data.dg_set_power_unit
      }</p>
      <p><strong>Condition:</strong> ${data.condition}</p>
      <p><strong>Power Status:</strong> ${data.on_off ? "ON" : "OFF"}</p>
      <hr>
      <div id="serverChart" style="width:100%; height:400px;"></div>
    `;

      serverInfo.style.left = "10px";
      serverInfo.style.top = "10px";
      serverInfo.style.display = "block";

      Highcharts.chart("serverChart", {
        chart: {
          type: "line",
          backgroundColor: "rgba(255,255,255,0.4)",
        },
        title: {
          text: `Server: ${serverName} - Live Metrics`,
          style: {
            color: "black",
            fontSize: "14px",
          },
        },
        credits: { enabled: false },
        xAxis: {
          categories: history.cpuUtilization
            .slice(-12)
            .map((d) => new Date(d.createdAt).toLocaleTimeString()),
          title: {
            text: "Time",
            style: { color: "black" },
          },
          labels: { style: { color: "black" } },
        },

        yAxis: {
          title: {
            text: "Metric Values",
            style: { color: "black" },
          },
          min: 0,
          max: 200, // Set the max value to 150
          tickInterval: 20, // Set interval between ticks to 15
          labels: { style: { color: "black" } },
        },

        series: [
          {
            name: "Power Utilization (W)",
            data: history.powerUtilization.slice(-12).map((d) => d.value),
            color: "orange",
          },
          {
            name: "CPU Utilization (%)",
            data: history.cpuUtilization.slice(-12).map((d) => d.value),
            color: "blue",
          },
          {
            name: "Memory Utilization (%)",
            data: history.memoryUtilization.slice(-12).map((d) => d.value),
            color: "green",
          },
          {
            name: "Network Utilization (%)",
            data: history.networkUtilization.slice(-12).map((d) => d.value),
            color: "purple",
          },
          {
            name: "Server Utilization (%)",
            data: history.serverUtilization.slice(-12).map((d) => d.value),
            color: "#1abc9c",
          },
          {
            name: "Temperature (°C)",
            data: history.temperatureModeling.slice(-12).map((d) => d.value),
            color: "red",
          },
          {
            name: "Network Traffic (%)",
            data: history.networkTraffic.slice(-12).map((d) => d.value),
            color: "oklch(59.1% 0.293 322.896)",
          },
        ],
        responsive: {
          rules: [
            {
              condition: { maxWidth: 800 },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                },
              },
            },
          ],
        },
      });

      // Highcharts.chart("serverChart", {
      //   chart: {
      //     type: "column",
      //     backgroundColor: "rgba(255,255,255,0.4)",
      //   },
      //   title: {
      //     text: `Server: ${serverName} - Current Snapshot`,
      //     style: {
      //       color: "black",
      //       fontSize: "14px",
      //     },
      //   },
      //   xAxis: {
      //     categories: [
      //       "Power (W)",
      //       "CPU (%)",
      //       "Memory (%)",
      //       "Network (%)",
      //       "Utilization (%)",
      //       "Temp (°C)",
      //       "Traffic (%)",
      //     ],
      //     title: { text: "Metrics", style: { color: "black" } },
      //     labels: { style: { color: "black" } },
      //   },
      //   yAxis: {
      //     min: 0,
      //     title: {
      //       text: "Values",
      //       style: { color: "black" },
      //     },
      //     labels: { style: { color: "black" } },
      //   },
      //   series: [
      //     {
      //       name: serverName,
      //       data: [
      //         data.power_utilization,
      //         data.cpu_utilization,
      //         data.memory_utilization,
      //         data.network_utilization,
      //         data.server_utilization,
      //         data.temperature_modeling,
      //         data.network_traffic,
      //       ],
      //       colorByPoint: true,
      //       colors: [
      //         "orange",
      //         "blue",
      //         "green",
      //         "purple",
      //         "#1abc9c",
      //         "red",
      //         "#f39c12",
      //       ],
      //     },
      //   ],
      //   credits: { enabled: false },
      // });

      // Highcharts.chart("serverChart", {
      //   chart: {
      //     type: "line",
      //     backgroundColor: "rgba(255,255,255,0.4)",
      //   },
      //   title: {
      //     text: `Server: ${serverName} - Live Metrics`,
      //     style: {
      //       color: "black",
      //       fontSize: "14px",
      //     },
      //   },
      //   credits: { enabled: false },
      //   xAxis: {
      //     categories,
      //     title: {
      //       text: "Time",
      //       style: { color: "black" },
      //     },
      //   },
      //   yAxis: {
      //     title: {
      //       text: "Metric Values",
      //       style: { color: "black" },
      //     },
      //     min: 0,
      //     max: 100,
      //     tickInterval: 10,
      //     labels: { style: { color: "black" } },
      //   },
      //   series: [
      //     { name: "Power Utilization (W)", data: powerData, color: "orange" },
      //     { name: "CPU Utilization (%)", data: cpuData, color: "blue" },
      //     { name: "Memory Utilization (%)", data: memoryData, color: "green" },
      //     {
      //       name: "Network Utilization (%)",
      //       data: networkData,
      //       color: "purple",
      //     },
      //   ],
      //   responsive: {
      //     rules: [
      //       {
      //         condition: { maxWidth: 800 },
      //         chartOptions: {
      //           legend: {
      //             layout: "horizontal",
      //             align: "center",
      //             verticalAlign: "bottom",
      //           },
      //         },
      //       },
      //     ],
      //   },
      // });

      // Refresh every 30 seconds
      clearInterval(window.liveServerChartInterval);
      window.liveServerChartInterval = setInterval(() => {
        this.serverinfo(serverObject);
      }, 30000);
    } catch (error) {
      console.error("Error fetching server data:", error);
      serverInfo.innerHTML = `<p>Error loading data.</p>`;
      serverInfo.style.display = "block";
    }
  }
  // async switchinfo(serverObject) {
  //   const switchInfo = document.getElementById("switchInfo");
  //   if (!switchInfo) {
  //     console.error("switchInfo element not found");
  //     return;
  //   }

  //   let current = serverObject;
  //   while (current && !current.name?.startsWith("Switch")) {
  //     current = current.parent;
  //   }

  //   const rackName = current?.name;
  //   if (!rackName) {
  //     console.error("No valid rack name found from clicked object.");
  //     return;
  //   }

  //   const apiUrl = `https://ems-backend-ui21.onrender.com/api/v1/ems/rack/${rackName}`;
  //   const historyUrl = `https://ems-backend-ui21.onrender.com/api/v1/ems/switch/${rackName}`;

  //   try {
  //     const [currentRes, historyRes] = await Promise.all([
  //       fetch(apiUrl),
  //       fetch(historyUrl),
  //     ]);

  //     const currentData = await currentRes.json();
  //     const historyData = await historyRes.json();

  //     const data = currentData?.data;
  //     const history = historyData?.data;

  //     if (!data || !history) {
  //       switchInfo.innerHTML = `<p>No data found for ${rackName}</p>`;
  //       switchInfo.style.display = "block";
  //       return;
  //     }

  //     // Format time labels and datasets
  //     const categories = history.serverUtilization.map((d) =>
  //       new Date(d.createdAt).toLocaleTimeString()
  //     );
  //     const utilizationData = history.serverUtilization.map((d) => d.value);
  //     const temperatureData = history.temperatureModeling.map((d) => d.value);
  //     const trafficData = history.networkTrafficUsage.map((d) => d.value);
  //     const powerData = history.itPower.map((d) => d.value);

  //     // Set rack info text + div for Highcharts
  //     switchInfo.innerHTML = `
  //     <h3>${data.rack_name || "N/A"} Info</h3>
  //     <p><strong>Row:</strong> ${data.row_name}</p>
  //     <p><strong>Servers:</strong> 12 servers</p>
  //     <p><strong>PUE:</strong> ${data.pue} ${data.pue_unit}</p>
  //     <p><strong>HVAC Power:</strong> ${data.hvac_power} ${
  //       data.hvac_power_unit
  //     }</p>
  //     <p><strong>Total UPS Power:</strong> ${data.total_ups_power} kW</p>
  //     <p><strong>UPS Time:</strong> ${data.total_ups_time} hrs</p>
  //     <p><strong>CFD:</strong> ${data.cfd}</p>
  //     <p><strong>Last Updated:</strong> ${new Date(
  //       data.createdAt
  //     ).toLocaleString()}</p>
  //     <hr>
  //     <div id="rackChart" style="width:100%; height:400px;"></div>
  //   `;

  //     switchInfo.style.left = "10px";
  //     switchInfo.style.top = "10px";
  //     switchInfo.style.display = "block";

  //     // Render Highchart
  //     if (!Array.isArray(history)) {
  //       switchInfo.innerHTML += `<p>No switch power data available.</p>`;
  //       return;
  //     }

  //     Highcharts.chart("switchChart", {
  //       chart: { type: "line", backgroundColor: "rgba(255, 255, 255, 0.4)" },
  //       title: {
  //         text: `Rack: ${rackName} - Switch Power Usage`,
  //         style: {
  //           color: "black",
  //           fontWeight: "bold",
  //           fontSize: "14px",
  //         },
  //       },
  //       credits: { enabled: false },
  //       xAxis: {
  //         categories: history.map((_, index) => `Point ${index + 1}`),
  //         title: {
  //           text: "Time Points",
  //           style: {
  //             color: "black",
  //             fontWeight: "bold",
  //             fontSize: "14px",
  //           },
  //         },
  //       },
  //       yAxis: {
  //         title: {
  //           text: "Switch Power (W)",
  //           style: {
  //             color: "black",
  //             fontWeight: "bold",
  //             fontSize: "14px",
  //           },
  //         },
  //         min: 0,
  //         max: 1000,
  //         tickInterval: 100,
  //         labels: {
  //           style: {
  //             color: "black",
  //           },
  //         },
  //       },
  //       series: [
  //         {
  //           name: "Switch Power (W)",
  //           data: history.map((entry) => entry.switch_power),
  //           color: "orange",
  //         },
  //       ],
  //       responsive: {
  //         rules: [
  //           {
  //             condition: { maxWidth: 800 },
  //             chartOptions: {
  //               legend: {
  //                 layout: "horizontal",
  //                 align: "center",
  //                 verticalAlign: "bottom",
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     });

  //     // Refresh every 5 minutes
  //     clearInterval(window.liveChartInterval);
  //     window.liveChartInterval = setInterval(
  //       () => switchInfo(serverObject),
  //       300000
  //     );
  //   } catch (error) {
  //     console.error("Error fetching rack data:", error);
  //     switchInfo.innerHTML = `<p>Error loading data.</p>`;
  //     switchInfo.style.display = "block";
  //   }
  // }

  async switchinfo(serverObject) {
    const switchInfo = document.getElementById("switchInfo");
    if (!switchInfo) {
      console.error("switchInfo element not found");
      return;
    }

    let current = serverObject;
    while (current && !current.name?.startsWith("Switch")) {
      current = current.parent;
    }

    const switchName = current?.name;
    if (!switchName) {
      console.error("No valid rack name found from clicked object.");
      return;
    }

    const historyUrl = `https://ems-backend-ui21.onrender.com/api/v1/ems/switch-data/${switchName}`;

    try {
      const historyRes = await fetch(historyUrl);
      const historyData = await historyRes.json();
      const history = historyData?.data;

      if (!Array.isArray(history) || history.length === 0) {
        switchInfo.innerHTML = `<p>No switch power data available for ${switchName}</p>`;
        switchInfo.style.display = "block";
        return;
      }

      const switchPowerData = history.map((entry) => entry.switch_power);
      const categories = switchPowerData.map(
        (_, index) => `Point ${index + 1}`
      );

      switchInfo.innerHTML = `
      <h3>${switchName} - Switch Power</h3>
      <div id="switchChart" style="width:100%; height:400px;"></div>
    `;
      switchInfo.style.left = "10px";
      switchInfo.style.top = "10px";
      switchInfo.style.display = "block";

      Highcharts.chart("switchChart", {
        chart: {
          type: "line",
          backgroundColor: "rgba(255, 255, 255, 0.4)",
        },
        title: {
          text: "Switch Power Usage",
          style: {
            color: "black",
            fontWeight: "bold",
            fontSize: "14px",
          },
        },
        credits: { enabled: false },
        xAxis: {
          categories,
          title: {
            text: "Time Points",
            style: {
              color: "black",
              fontWeight: "bold",
              fontSize: "14px",
            },
          },
        },
        yAxis: {
          min: 0,
          max: 1000,
          tickInterval: 100,
          title: {
            text: "Power (W)",
            style: {
              color: "black",
              fontWeight: "bold",
              fontSize: "14px",
            },
          },
          labels: {
            style: {
              color: "black",
            },
          },
        },
        series: [
          {
            name: "Switch Power (W)",
            data: switchPowerData,
            color: "orange",
          },
        ],
        responsive: {
          rules: [
            {
              condition: { maxWidth: 800 },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                },
              },
            },
          ],
        },
      });

      // Auto-refresh every 5 minutes
      clearInterval(window.switchChartInterval);
      window.switchChartInterval = setInterval(
        () => this.switchinfo(serverObject),
        30000
      );
    } catch (error) {
      console.error("Error fetching switch power data:", error);
      switchInfo.innerHTML = `<p>Error loading data for ${switchName}</p>`;
      switchInfo.style.display = "block";
    }
  }

  hideRackInfo() {
    const rackInfo = document.getElementById("rackInfo");
    if (rackInfo) {
      rackInfo.style.display = "none";
    }
  }
  hideServerInfo() {
    const serverInfo = document.getElementById("serverInfo");
    if (serverInfo) {
      serverInfo.style.display = "none";
    }
  }
  hideSwitchInfo() {
    const switchInfo = document.getElementById("switchInfo");
    if (switchInfo) {
      switchInfo.style.display = "none";
    }
  }

  hideAllInfo() {
    this.hideRackInfo();
    this.hideServerInfo();
    this.hideSwitchInfo();
  }
}

export default {
  modules: [
    {
      name: "ServerInfo",
      pawnBehaviors: [ServerInfoPawn],
    },
  ],
};

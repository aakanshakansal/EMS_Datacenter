class TialObjectPawn {
  setup() {
    this.allowedObjectsTials = new Set();
    this.highlightedObjecttials = null;

    this.lastClickedObjectTials = null;
    this.subscribe(this.id, "3dModelLoaded", "ModelLoadedTials");
    this.addEventListener("pointerTap", "onTapTialsObjact");

    console.log("setup for tials");

    this.tempChart = null;
    this.humidityChart = null;
  }

  ModelLoadedTials() {
    if (
      !this.shape ||
      !this.shape.children ||
      this.shape.children.length === 0
    ) {
      console.error("Shape or children are not properly defined.");
      return;
    }

    this.objectTials = this.shape.children[0];
    console.log("Model tials is", this.objectTials);
    // this.allowedObjects.add(this.objectTials);

    this.allowedObjectsTials.add(this.objectTials);
  }

  onTapTialsObjact(event) {
    console.log("HighlightPawn onDocumentMouseClick");
    let avatar = this.getMyAvatar();
    let raycaster = avatar.setRaycastFrom2D(event.xy);
    const intersects = raycaster.intersectObjects([this.shape], true);

    if (intersects.length > 0) {
      const clickedObjectTials = intersects[0].object;

      console.log("Clicked Object:", clickedObjectTials);
      console.log("Clicked Object Name:", clickedObjectTials.name);

      let isTile = false;
      let isObject = false;

      // Check if the clicked object is the same as the last clicked object
      if (this.lastClickedObjectTials === clickedObjectTials) {
        isObject = false;
        this.hideTileInfo();
        this.hideAllHVACInfoAndCharts();
        this.highlightedObjecttials = null;
        this.lastClickedObjectTials = null; // Reset last clicked object
        return;
      }
      this.lastClickedObjectTials = clickedObjectTials;

      // Check if clicked object is a tile
      for (let i = 0; i <= 77; i++) {
        if (clickedObjectTials === this.objectTials.children[71].children[i]) {
          isTile = true;
          break;
        }
      }

      if (isTile) {
        console.log("isTile:", isTile);
        this.displayTileInfo(clickedObjectTials);
        this.highlightedObjecttials = clickedObjectTials; // Highlight the new object
      } else {
        this.hideTileInfo();
        this.highlightedObjecttials = null; // Reset highlighted object
      }

      for (let i = 0; i <= 17; i++) {
        for (let j = 0; j <= 2; j++) {
          if (
            clickedObjectTials ===
            this.objectTials.children[79].children[i].children[j]
          ) {
            isObject = true;
            break;
          }
        }
      }

      if (isObject) {
        this.displayAllInfoAndChartsHVAC(clickedObjectTials);
      } else {
        this.hideAllHVACInfoAndCharts();
        this.highlightedObjecttials = null;
      }
    } else {
      if (this.highlightedObjecttials) {
        this.hideAllHVACInfoAndCharts();
        this.highlightedObjecttials = null;
      }
    }
  }

  // hide info

  hideTileInfo() {
    const tileInfo = document.getElementById("TileInfo");
    tileInfo.style.display = "none";
  }

  // display tile info

  displayTileInfo(object) {
    const tileInfo = document.getElementById("TileInfo");
    const dynamicTemperature = this.generateDynamicTemperature();
    const perforationPercentage = this.generatePerfuration();

    tileInfo.innerHTML = `
                  <h3>Perforated Tile Info</h3>
                  <p>Name: ${object.name || "N/A"}</p>
                  <p>Temperature: ${dynamicTemperature} °C</p>
                  <p>Perforation: ${perforationPercentage} %</p>
                  <p>Perforation:${perforationPercentage}%</p>
                  <div id="perfurationChartContainer" style=" position: absolute;
               
                 
                  padding: 3px;
                  border: 0.2px solid #ccc;
                  z-index: 1000;
                  top: 150px !important;
                  left: 5px;
                  bottom: 100px;
                  height: 170px !important;
                  width: 180px !important;"></div>
                  <hr>
              `;
    tileInfo.style.left = "10px";
    tileInfo.style.top = "10px";
    tileInfo.style.display = "block";
    const perforationData = {
      percentage: perforationPercentage,
    };
    this.updatePerfurationChart(perforationData);
  }

  generateDynamicTemperature() {
    return 5 + Math.floor(Math.random() * 11);
  }

  //generate tile graph

  generatePerfuration() {
    const minPercentage = 35;
    const maxPercentage = 75;
    const range = maxPercentage - minPercentage;
    const percentage = minPercentage + Math.random() * range;
    return Math.round(percentage);
  }

  updatePerfurationChart(perforationData) {
    Highcharts.chart("perfurationChartContainer", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
      },
      title: {
        text: `Tile<br>Perforation<br>${perforationData.percentage}%`,
        align: "center",
        verticalAlign: "middle",
        y: 70,
        style: {
          fontSize: "1.1em",
          color: "black",
          fontWeight: "bold",
        },
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: "bold",
              color: "white",
            },
          },
          startAngle: -90,
          endAngle: 90,
          center: ["50%", "75%"],
          size: "100%",
        },
      },
      series: [
        {
          type: "pie",
          name: "Perforation",
          innerSize: "50%",
          data: [
            {
              name: "Perforation",
              y: perforationData.percentage,
              color: "blue",
            },
            {
              name: "",
              y: 100 - perforationData.percentage,
              color: "lightblue",
            },
          ],
        },
      ],
    });
  }

  // hide info
  hideAllHVACInfoAndCharts() {
    this.hideHVACInfo();
    this.hideCartsHumidityTempratureAir();
  }

  hideHVACInfo() {
    const HVACInfo = document.getElementById("HVACInfo");
    HVACInfo.style.display = "none";
  }

  hideCartsHumidityTempratureAir() {
    const chartContainerA = document.getElementById("chartContainerA");

    if (chartContainerA) {
      chartContainerA.style.display = "none";
    }
    const chartContainerB = document.getElementById("chartContainerB");

    if (chartContainerB) {
      chartContainerB.style.display = "none";
    }
    const container_humidity = document.getElementById("container_humidity");

    if (container_humidity) {
      container_humidity.style.display = "none";
    }
  }
  // display all info

  displayAllInfoAndChartsHVAC(object) {
    this.displayHVACInfo(object);
    this.AirGuageChartForHVAC(object);
    this.TempChartForHVAC(object);
    this.HumidityChartHVAC(object);
  }

  // hvac Info

  displayHVACInfo(object) {
    const HVACInfo = document.getElementById("HVACInfo");
    const powerCoolingTower = this.generateDynamicPowerforHVAC();

    HVACInfo.innerHTML = `
                  <h3>HVAC Rack Info</h3>
                  <p>Name: ${object.name || "N/A"}</p>
                  <p>Power Cooling Tower: ${powerCoolingTower} kW</p>
                  <hr>
              `;

    HVACInfo.style.left = "10px";
    HVACInfo.style.top = "10px";
    HVACInfo.style.display = "block";
  }

  generateDynamicPowerforHVAC() {
    return 5 + Math.floor(Math.random() * 6);
  }

  // air charts

  AirGuageChartForHVAC(object) {
    const chartContainerA = document.getElementById("chartContainerA");

    if (!(chartContainerA instanceof HTMLDivElement)) {
      return;
    }

    const dynamicData = this.generateDynamicDataforAir(object);

    Highcharts.chart("chartContainerA", {
      chart: {
        type: "gauge",
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: "80%",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
      },
      title: {
        text: "Air Flow Rate",
        style: {
          color: "black",
          fontWeight: "bold",
        },
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        background: null,
        center: ["50%", "75%"],
        size: "110%",
      },
      yAxis: {
        min: 0,
        max: 500,
        tickPixelInterval: 72,
        tickPosition: "inside",
        tickColor: Highcharts.defaultOptions.chart.backgroundColor || "#FFFFFF",
        tickLength: 20,
        tickWidth: 2,
        minorTickInterval: null,
        labels: {
          distance: 20,
          style: {
            fontSize: "14px",
          },
        },
        lineWidth: 0,
        plotBands: [
          {
            from: 0,
            to: 250,
            color: "#55BF3B",
            thickness: 20,
            borderRadius: "50%",
          },
          {
            from: 250,
            to: 400,
            color: "#DDDF0D",
            thickness: 20,
            borderRadius: "50%",
          },
          {
            from: 400,
            to: 500,
            color: "#DF5353",
            thickness: 20,
          },
        ],
      },
      series: [
        {
          name: "Flow",
          data: dynamicData.series[0].data,
          tooltip: {
            valueSuffix: " cfm",
          },
          dataLabels: {
            format: "{y} cfm",
            borderWidth: 0,
            color:
              (Highcharts.defaultOptions.title &&
                Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color) ||
              "#333333",
            style: {
              fontSize: "16px",
            },
          },
          dial: {
            radius: "80%",
            backgroundColor: "gray",
            baseWidth: 12,
            baseLength: "0%",
            rearLength: "0%",
          },
          pivot: {
            backgroundColor: "gray",
            radius: 6,
          },
        },
      ],
    });

    chartContainerA.style.display = "block";
  }

  generateDynamicDataforAir(object) {
    const categories = ["00:00"];
    const seriesData = categories.map((category, index) => {
      const baseTime = Date.now();
      const timestamp = baseTime + index * 3600 * 1000 * 4;
      const flow = 300 + Math.floor(Math.random() * 100);
      return [timestamp, flow];
    });

    return {
      categories,
      series: [
        {
          name: object.name || "Object",
          data: seriesData,
        },
      ],
    };
  }

  // temprature charts

  TempChartForHVAC(object) {
    const chartContainerB = document.getElementById("chartContainerB");

    if (!(chartContainerB instanceof HTMLDivElement)) {
      return;
    }

    const dynamicData =
      this.generateDynamicDataForTempratureChartOfObject(object);

    const gaugeOptions = {
      chart: {
        type: "solidgauge",
        height: "80%",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
      },
      title: {
        text: "Set Point Temperature",
        style: {
          color: "black",
          fontWeight: "bold",
        },
      },
      pane: {
        center: ["50%", "75%"],
        size: "110%",
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: null,
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc",
        },
      },
      tooltip: {
        enabled: false,
      },
      yAxis: {
        min: 0,
        max: 35,
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 5,
        title: {
          y: -70,
        },
        labels: {
          y: 16,
          style: {
            fontSize: "14px",
          },
        },
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true,
            style: {
              color: "black",
              fontWeight: "bold",
            },
          },
        },
      },
      series: [
        {
          name: "Temp",
          data: [dynamicData.series[0].data[0][1]],
          dataLabels: {
            format:
              '<div style="text-align:center">' +
              '<span style="font-size:25px; color: black; font-weight: bold">{y}</span><br/>' +
              '<span style="font-size:12px;opacity:0.4">°C</span>' +
              "</div>",
          },
          tooltip: {
            valueSuffix: "°C",
          },
        },
      ],
    };

    this.tempChart = Highcharts.chart(
      "chartContainerB",
      Highcharts.merge(gaugeOptions)
    );

    chartContainerB.style.display = "block";

    const updateChart = () => {
      if (this.tempChart && !this.tempChart.renderer.forExport) {
        const point = this.tempChart.series[0].points[0];
        const newTemp =
          this.generateDynamicDataForTempratureChartOfObject(object).series[0]
            .data[0][1];
        point.update(newTemp);
      }
    };

    setInterval(updateChart, 10000);
  }

  generateDynamicDataForTempratureChartOfObject(object) {
    const categories = ["00:00"];
    const seriesData = categories.map(() => {
      const baseTime = Date.now();
      const temp = Math.floor(Math.random() * 35);
      return [baseTime, temp];
    });

    return {
      categories,
      series: [
        {
          name: object.name || "Object",
          data: seriesData,
        },
      ],
    };
  }

  // humidy charts

  HumidityChartHVAC(object) {
    const chartContainerHumidity =
      document.getElementById("container_humidity");

    if (!(chartContainerHumidity instanceof HTMLDivElement)) {
      return;
    }

    const dynamicDataHumidity = this.generateDynamicDataHumidityHVAC(object);

    const gaugeOptionsHumidity = {
      chart: {
        type: "solidgauge",
        height: "80%",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
      },
      title: {
        text: "Humidity",
        style: {
          color: "black",
          fontWeight: "bold",
        },
      },
      pane: {
        center: ["50%", "75%"],
        size: "110%",
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: null,
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc",
        },
      },
      tooltip: {
        enabled: false,
      },
      yAxis: {
        min: 20,
        max: 80,
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 5,
        title: {
          y: -70,
        },
        labels: {
          y: 16,
          style: {
            fontSize: "14px",
          },
        },
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true,
            style: {
              color: "black",
              fontWeight: "bold",
            },
          },
        },
      },
      series: [
        {
          name: "Humidity",
          data: [dynamicDataHumidity.series[0].data[0][1]],
          dataLabels: {
            format:
              '<div style="text-align:center">' +
              '<span style="font-size:25px; color: black; font-weight: bold">{y}</span><br/>' +
              '<span style="font-size:12px;opacity:0.4"></span>' +
              "</div>",
          },
          tooltip: {
            valueSuffix: "%",
          },
        },
      ],
    };

    this.humidityChart = Highcharts.chart(
      "container_humidity",
      Highcharts.merge(gaugeOptionsHumidity)
    );

    chartContainerHumidity.style.display = "block";

    const updateChart = () => {
      if (this.humidityChart && !this.humidityChart.renderer.forExport) {
        const newHumidityData = this.generateDynamicDataHumidityHVAC(object);
        const newHumidity = newHumidityData.series[0].data[0][1];
        const point = this.humidityChart.series[0].points[0];
        point.update(newHumidity);
      }
    };

    setInterval(updateChart, 10000);
  }

  generateDynamicDataHumidityHVAC(object) {
    const categories = ["00:00"];
    const seriesData = categories.map(() => {
      const baseTime = Date.now();
      const humidity = Math.floor(Math.random() * (80 - 20 + 1)) + 20; // Random humidity between 20% and 80%
      return [baseTime, humidity];
    });

    return {
      categories,
      series: [
        {
          name: object.name || "Object",
          data: seriesData,
        },
      ],
    };
  }
}

export default {
  modules: [
    {
      name: "TialObject",
      // actorBehaviors: [HighlightActor],
      pawnBehaviors: [TialObjectPawn],
    },
  ],
};

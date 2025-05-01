class Values {
  setup() {
    if (!this._cardData.values) this._cardData.values = [];
    if (!this._cardData.length) this._cardData.length = 20;
    if (!this._cardData.height) this._cardData.height = 0.5;

    this.apiURL =
      "https://ems-backend-ui21.onrender.com/api/v1/ems/rack/Server_Rack001";
    this.fetchFromAPI();
  }

  teardown() {
    this.stop = true; // stops future fetches
  }

  length() {
    return this._cardData.length;
  }

  height() {
    return this._cardData.height;
  }

  values() {
    return this._cardData.values;
  }

  addValue(value, notSay) {
    let values = this._cardData.values;
    values.push(value);
    if (values.length > this.length()) {
      values.shift();
    }

    if (!notSay) {
      this.say("updateGraph");
    }
  }

  async fetchFromAPI() {
    if (this.stop) return;

    try {
      let response = await fetch(this.apiURL);
      if (response.ok) {
        let data = await response.json();
        let power = data.it_power;
        if (typeof power === "number") {
          this.addValue(power);
        } else {
          console.warn("Invalid power value, simulating instead");
          this.addValue(Math.random()); // simulate
        }
      } else {
        console.error("API error:", response.status);
        this.addValue(Math.random()); // simulate
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      this.addValue(Math.random()); // simulate
    }

    this.future(1000).fetchFromAPI();
  }
}
class BarGraphPawn {
  setup() {
    this.constructBars();
    this.listen("updateGraph", "updateGraph");
    this.updateGraph();
  }

  constructBars() {
    [...this.shape.children].forEach((c) => {
      c.material.dispose();
      this.shape.remove(c);
    });
    this.bars = [];
    let len = this.actor._cardData.length;
    let size = 1 / len;
    let THREE = Microverse.THREE;
    let color = this.actor._cardData.color;
    this.base = new THREE.Mesh(
      new THREE.BoxGeometry(1, size / 4, size, 2, 4, 2),
      new THREE.MeshStandardMaterial()
    );
    this.base.position.set(0, -size / 4, 0);
    this.shape.add(this.base);
    this.bar = new THREE.Mesh(
      new THREE.BoxGeometry(size * 1.0, 1, size * 1.0, 2, 2, 2),
      new THREE.MeshStandardMaterial({ color: color, emissive: color })
    );
    for (let i = 0; i < len; i++) {
      let bar = this.bar.clone();
      bar.material = bar.material.clone();
      bar.position.set((0.5 + i - len / 2) * size, 0, 0);
      this.shape.add(bar);
      this.bars.push(bar);
    }
  }

  updateGraph() {
    let values = this.actor._cardData.values;
    let height = this.actor._cardData.height;
    let mn = Math.min(...values);
    let mx = Math.max(...values);
    let range = mx - mn;
    mn = Math.max(mn - range / 10, 0);
    range = mx - mn; //update this with the additional bit

    this.bars.forEach((b, i) => {
      let d = (height * (values[i] - mn)) / range;
      b.scale.set(1, d, 1);
      b.position.y = d / 2;
    });
  }
}

class LineGraphPawn {
  setup() {
    this.constructLines();
    this.listen("updateGraph", "updateGraph");
    this.updateGraph();
  }

  constructLines() {
    [...this.shape.children].forEach((c) => {
      c.material.dispose();
      this.shape.remove(c);
    });
    let len = this.actor._cardData.length;
    let size = 1 / len;
    let THREE = Microverse.THREE;
    let color = this.actor._cardData.color;
    this.base = new THREE.Mesh(
      new THREE.BoxGeometry(1, size / 4, size, 2, 4, 2),
      new THREE.MeshStandardMaterial()
    );
    this.base.position.set(0, -size / 4, 0);
    this.shape.add(this.base);

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(len * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.LineBasicMaterial({
      linewidth: 2,
      color: color,
    });

    this.line = new THREE.Line(geometry, material);
    this.shape.add(this.line);
  }

  updateGraph() {
    let values = this.actor._cardData.values;
    let len = this.actor._cardData.length;
    let height = this.actor._cardData.height;
    let mn = Math.min(...values);
    let mx = Math.max(...values);
    let range = mx - mn;
    mn = Math.max(mn - range / 10, 0);
    range = mx - mn; //update this with the additional bit

    const buffer = this.line.geometry.getAttribute("position");
    let i = 0;
    values.forEach((v) => {
      let x = (0.5 + i - len / 2) / len;
      let y = (height * (v - mn)) / range;
      buffer.setXYZ(i, x, y, 0);
      i++;
    });
    buffer.needsUpdate = true;
  }
}

export default {
  modules: [
    {
      name: "Values",
      actorBehaviors: [Values],
    },
    {
      name: "BarGraph",
      pawnBehaviors: [BarGraphPawn],
    },
    {
      name: "LineGraph",
      pawnBehaviors: [LineGraphPawn],
    },
  ],
};

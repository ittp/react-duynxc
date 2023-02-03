import G6 from '@antv/g6';

const nodes = [];
const edges = [];

// Center node
const centerNode = {
  id: 'center',
  x: 500,
  y: 300,
  type: 'center-node',
  size: 20,
};
nodes.push(centerNode);
// Add 4 nodes on the left
for (let i = 0; i < 1; i++) {
  const id = 'left' + i;
  nodes.push({
    id,
    x: 0,
    y: 0, //(i + 1) * 100 + 50,
    type: 'leaf-node',
  });
  edges.push({ source: id, target: 'center', type: 'can-running' });
}
// Add 6 nodes on the right
let getData = async() => {
  let url= 'https://gist.githubusercontent.com/ittp/10b49dd3ee046ac6c94e97e9b194b480/raw/3b092e0e5cf9b0f9ac1c2e400a108080cd899a40/hosts.json',
  dataRequest = await axios.get(url).then(res=> res.data)

console.log(dataRequest)

if(dataRequest.length >= 1) {
   console.log(dataRequest)
} else {

console.log('no data')
}

console.log('getData')

return dataRequest
}


try {
getData()
} catch(err) {

}
for (let i = 0; i < 4; i++) {
  const id = 'right' + i;
  nodes.push({
    id,
    x: 0,
    y: 500, // i * 100 + 50,
    type: 'leaf-node',
  });
  edges.push({ source: 'center', target: id, type: 'can-running' });
}

G6.registerNode(
  'leaf-node',
  {
    afterDraw(cfg, group) {
      group.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: 5,
          fill: cfg.color || '#5B8FF9',
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'circle-shape',
      });
    },
    getAnchorPoints() {
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    },
  },
  'circle'
);

G6.registerNode(
  'center-node',
  {
    afterDraw(cfg, group) {
      const r = cfg.size / 2;
      group.addShape('circle', {
        zIndex: -3,
        attrs: {
          x: 0,
          y: 0,
          r: r + 10,
          fill: 'gray',
          opacity: 0.4,
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'circle-shape1',
      });
      group.addShape('circle', {
        zIndex: -2,
        attrs: {
          x: 0,
          y: 0,
          r: r + 20,
          fill: 'gray',
          opacity: 0.2,
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'circle-shape2',
      });
      group.sort();
    },
    getAnchorPoints() {
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    },
  },
  'circle'
);

// lineDash array
const lineDash = [4, 2, 1, 2];

G6.registerEdge(
  'can-running',
  {
    setState(name, value, item) {
      const shape = item.get('keyShape');
      if (name === 'running') {
        if (value) {
          let index = 0;
          shape.animate(
            () => {
              index++;
              if (index > 9) {
                index = 0;
              }
              const res = {
                lineDash,
                lineDashOffset: -index,
              };
              // return the params for this frame
              return res;
            },
            {
              repeat: true,
              duration: 3000,
            }
          );
          console.log('start');
        } else {
          shape.stopAnimate();
          shape.attr('lineDash', null);
          console.log('stop');
        }
      }
    },
  },
  'cubic-horizontal'
);

const container = document.getElementById('container');
const width = container.scrollWidth;
const height = container.scrollHeight || 500;
const graph = new G6.Graph({
  container: 'container',
  width,
  height,
  defaultNode: {
    style: {
      fill: '#DEE9FF',
      stroke: '#5B8FF9',
    },
  },
  defaultEdge: {
    style: {
      stroke: '#b5b5b5',
    },
  },
});
graph.data({ nodes, edges });
graph.render();
graph.fitView();

// set hover state
graph.on('node:mouseenter', (ev) => {
  const node = ev.item;
  const edges = node.getEdges();
  edges.forEach((edge) => graph.setItemState(edge, 'running', true));
});
graph.on('node:mouseleave', (ev) => {
  const node = ev.item;
  const edges = node.getEdges();
  edges.forEach((edge) => graph.setItemState(edge, 'running', false));
});

if (typeof window !== 'undefined')
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
  };

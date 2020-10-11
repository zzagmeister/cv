function parseQuery(queryString) {
  var query = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

const result = [];
let loaded = false;
const _bind = method => function() {
  const args = Array.from(arguments);
  if (!loaded) {
    result.push({
      method,
      args,
    });
  } else {
    console.warn('extra', {method, args}, new Error().stack);
    debugger;
  }
};
globalThis.dcl = {};
[
  'addEntity',
  'onUpdate',
  'onEvent',
  'subscribe',
  'onStart',
  'error',
  'attachEntityComponent',
  'setParent',
  'updateEntityComponent',
  'componentCreated',
  'componentUpdated',
].forEach(method => {
  dcl[method] = _bind(method);
});

(async () => {

const q = parseQuery(self.location.search);
const {hash} = q;

const res = await fetch('https://peer-ec1.decentraland.org/lambdas/contentv2/contents/' + hash);
const text = await res.text();
const timeoutQueue = [];
globalThis.setTimeout = fn => {
  timeoutQueue.push(fn);
  /* try {
    fn();
  } catch(err) {
    console.warn(err);
  } */
};
globalThis.setInterval = fn => {
  timeoutQueue.push(fn);
  /* try {
    fn();
  } catch(err) {
    console.warn(err);
  } */
};
eval(text);
['onStart', 'onUpdate'].forEach(m => {
  for (const entry of result) {
    const {method, args} = entry;
    if (method === m) {
      const [fn] = args;
      console.log('run', m, fn);
      fn();
    }
  }
});
for (const fn of timeoutQueue) {
  fn();
}
timeoutQueue.length = 0;
/* for (let i = 0; i < 10; i++) {
  for (const fn of timeoutQueue) {
    fn();
  }
  timeoutQueue.length = 0;
  ['onUpdate'].forEach(m => {
    for (const entry of result) {
      const {method, args} = entry;
      if (method === m) {
        const [fn] = args;
        console.log('run', m, fn);
        fn();
      }
    }
  });
} */
loaded = true;

console.log('done');

self.postMessage(JSON.stringify({
  result,
}));

})();
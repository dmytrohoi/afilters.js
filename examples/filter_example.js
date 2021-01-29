const Filter = require('afilters.js');

// Chaining
new Filter({ filters: [(a, b) => a > b] }).try(1, 0).finally((a) => console.log(a));

// Constructing
const f = new Filter();
f.add((a, b) => a > b);

const result = f.execute(1, 0);
console.log(result.isSuccess)

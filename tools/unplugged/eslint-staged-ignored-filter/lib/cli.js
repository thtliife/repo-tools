#!/usr/bin/env node
"use strict";const _nodeProcess=require("node:process");const _filterIgnored=require("./filter-ignored");const[,,...files]=_nodeProcess.argv;(async()=>{console.log((await (0,_filterIgnored.filterIgnored)(files)).join(" "))})();
//# sourceMappingURL=cli.js.map
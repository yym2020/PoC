#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("@aws-cdk/core");
const cdk_construct_stack_1 = require("../lib/cdk-construct-stack");
const demoapp = new cdk.App();
new cdk_construct_stack_1.CdkConstructStack(demoapp, 'CdkConstructStack');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNkay1jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsdUNBQXFDO0FBQ3JDLHFDQUFxQztBQUNyQyxvRUFBK0Q7QUFFL0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDOUIsSUFBSSx1Q0FBaUIsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENka0NvbnN0cnVjdFN0YWNrIH0gZnJvbSAnLi4vbGliL2Nkay1jb25zdHJ1Y3Qtc3RhY2snO1xuXG5jb25zdCBkZW1vYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBDZGtDb25zdHJ1Y3RTdGFjayhkZW1vYXBwLCAnQ2RrQ29uc3RydWN0U3RhY2snKTtcbiJdfQ==
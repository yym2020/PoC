import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Autoscaling from '../lib/autoscaling-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Autoscaling.AutoscalingStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});

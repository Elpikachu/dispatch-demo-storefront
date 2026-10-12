import assert from 'node:assert/strict';
import { test } from 'node:test';
import { currentEnvironment } from '../src/environment.js';
import { escapeHtml } from '../src/views.js';

test('escapeHtml neutralises HTML special characters', () => {
  assert.equal(
    escapeHtml(`<script>alert("x")</script> & 'y'`),
    '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;',
  );
});

test('currentEnvironment reads Upsun variables', () => {
  assert.deepEqual(currentEnvironment({}), { name: 'local', isProduction: false });
  assert.deepEqual(
    currentEnvironment({ PLATFORM_BRANCH: 'pr-3', PLATFORM_ENVIRONMENT_TYPE: 'development' }),
    { name: 'pr-3', isProduction: false },
  );
  assert.deepEqual(
    currentEnvironment({ PLATFORM_BRANCH: 'main', PLATFORM_ENVIRONMENT_TYPE: 'production' }),
    { name: 'main', isProduction: true },
  );
});

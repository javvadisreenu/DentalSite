import { test } from 'node:test';
import assert from 'node:assert/strict';
import { depthFromPath } from '../assets/js/lib/config.js';

test('depthFromPath root is 0', () => {
  assert.equal(depthFromPath('/'), 0);
});

test('depthFromPath index at root is 0', () => {
  assert.equal(depthFromPath('/index.html'), 0);
});

test('depthFromPath service page is 1', () => {
  assert.equal(depthFromPath('/services/root-canal-treatment.html'), 1);
});

test('depthFromPath blog index is 1', () => {
  assert.equal(depthFromPath('/blog/index.html'), 1);
});

test('depthFromPath blog post is 2', () => {
  assert.equal(depthFromPath('/blog/posts/brushing-tips.html'), 2);
});
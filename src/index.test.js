import createForm from '.';

test('says hello world', () => (
  expect(createForm()).toBe('Hello Universe!')
));

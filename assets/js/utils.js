export const title = str => {
  const [lead, ...rest] = str.split('');
  return [lead.toUpperCase(), ...rest].join('');
};

import { client } from '@sigmacomputing/plugin';

client.config.configureEditorPanel([
  { name: 'exampleSource', type: 'element' },
  {
    name: 'exampleColumn',
    type: 'column',
    source: 'exampleSource',
    allowedTypes: ['number'],
  },
]);

let columnName;

export function updateDisplay(element) {
  const _unsubscribe2 = client.elements.subscribeToElementColumns(
    client.config.getKey('exampleSource'),
    columns => {
      columnName = columns[client.config.getKey('exampleColumn')]?.name;
    }
  );

  const _unsubscribe = client.elements.subscribeToElementData(
    client.config.getKey('exampleSource'),
    data => {
      const dataArray = data[client.config.getKey('exampleColumn')];
      if (!Array.isArray(dataArray)) return;

      const sum = dataArray.reduce((acc, dataPoint) => {
        return acc + dataPoint;
      }, 0);

      element.innerHTML = `Sum of the column ${columnName} is ${sum}`;
    }
  );
}

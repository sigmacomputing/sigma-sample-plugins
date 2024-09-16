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

export function updateDisplay(element) {
  let columnName;
  const unsubscribeFromElementColumns =
    client.elements.subscribeToElementColumns(
      client.config.getKey('exampleSource'),
      columns => {
        columnName = columns[client.config.getKey('exampleColumn')]?.name;
      }
    );

  const unsubscribeFromElementData = client.elements.subscribeToElementData(
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

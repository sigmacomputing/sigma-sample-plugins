import React from 'react';
import copyToClipboard from 'copy-to-clipboard';

function handleCopy(info) {
  const objects = info.objects ? info.objects : [info.object];
  // make csv style data
  const headers = [];
  const firstObject = objects[0];
  if (firstObject) {
    headers.push('Latitude', 'Longitude');
    firstObject.tooltips.forEach(t => headers.push(t.key));
  }

  const contents = objects.map(data => {
    const { coordinates } = data; 
    const tooltips = data.tooltips.map(t => t.value);
    const row = [coordinates[1], coordinates[0], ...tooltips];
    return row.join(',');
  });

  const text = [headers.join(','), ...contents].join('\n');
  copyToClipboard(text);
}

export function renderContextMenu(info) {
  if (!info) return null;
  const { x, y } = info;

  return (
    <ul className="contextMenu" style={{position: 'fixed', left: x, top: y}}>
      <li onClick={() => handleCopy(info)}>Copy data</li>
    </ul>
  )
}
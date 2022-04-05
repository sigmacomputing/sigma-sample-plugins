import React from 'react';

function TooltipText({ info }) {
  const { coordinates, tooltips } = info
  return (
    <>
      <div className="tooltipPoint">
      {`Lat: ${coordinates[1]}, Long: ${coordinates[0]}`}
      </div>
      {
        tooltips.map(({ key, value }) => (
          <div key={key} className="tooltipDetails">{`${key}: ${value}`}</div>  
        ))
      }
    </>
  )
}

export function renderTooltip(info) {
  if (!info) return null;
  const { object, x, y } = info;

  if (info.objects) {
    return (
      <div className="tooltip interactive" style={{position: 'fixed', left: x, top: y}}>
        {info.objects.map((obj, index) => (
          <TooltipText key={index} info={obj} />
        ))}
      </div>
    );
  }

  if (!object) {
    return null;
  }

  return object.cluster ? (
    <div className="tooltip" style={{position: 'fixed', left: x, top: y}}>
      {object.point_count} records
      <br />
      (click to see details)
    </div>
  ) : (
    <div className="tooltip" style={{position: 'fixed', left: x, top: y}}>
      <TooltipText info={object} />
    </div>
  );
}
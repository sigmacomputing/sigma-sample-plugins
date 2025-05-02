import { IncomingDataEntry, IncomingDataType } from './App';
import { Marks, ResourceTiming, ResourceTimings } from './plugin';

const consistentColor = '#FF00FF';

export function useTransformData(
  resourceTimingsArray: ResourceTimings[] | undefined,
  marks: Marks[] | undefined,
  offsets: number[] | undefined
): IncomingDataType {
  if (!resourceTimingsArray || !marks || !offsets) {
    return [];
  }
  if (
    resourceTimingsArray.length !== marks.length ||
    resourceTimingsArray.length !== offsets.length
  ) {
    throw new Error(
      `Unequal number of events for different areas: ResourceTimings ${resourceTimingsArray.length}, Marks ${marks.length}, Offsets ${offsets.length}`
    );
  }

  const minimumOffset = Math.min(...offsets);
  const normalizedOffsets = offsets.map(offset => offset - minimumOffset);

  const transformedData = resourceTimingsArray.reduce<IncomingDataType>(
    (previousArray, resourceTimings, i) => {
      const currentOffset = normalizedOffsets[i];
      for (const resourceTiming of resourceTimings) {
        const entry = transformResourceTiming(resourceTiming, currentOffset);
        previousArray.push(entry);
      }
      const markEntries = transformMarks(marks[i], currentOffset);
      previousArray.push(...markEntries);
      return previousArray;
    },
    [] as IncomingDataType
  );

  return transformedData;
}

function transformResourceTiming(
  resourceTiming: ResourceTiming,
  offset: number
): IncomingDataEntry {
  return {
    name: resourceTiming.name,
    value: [
      0,
      resourceTiming.timeRange[0] + offset,
      resourceTiming.timeRange[1] + offset,
      resourceTiming.name,
      0,
    ],
    itemStyle: { color: consistentColor },
  };
}

function transformMarks(marks: Marks, offset: number): IncomingDataEntry[] {
  return Object.entries(marks).map(([name, time]) => ({
    name,
    value: [0, time + offset, time + offset, name, 1],
    itemStyle: { color: consistentColor },
  }));
}

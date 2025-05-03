import { IncomingDataEntry, IncomingDataType } from './App';
import { Marks, ResourceTiming, ResourceTimings } from './plugin';

const consistentColor = '#FF00FF';
const MAX_LEVEL = 100;

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
        const startTime = resourceTiming.timeRange[0] + currentOffset;
        const endTime = resourceTiming.timeRange[1] + currentOffset;
        const level = calculateLevel(startTime, endTime, previousArray);

        const entry = transformResourceTiming(
          resourceTiming,
          currentOffset,
          level
        );
        previousArray.push(entry);
      }
      const markEntries = transformMarks(
        marks[i],
        currentOffset,
        previousArray
      );
      previousArray.push(...markEntries);
      return previousArray;
    },
    [] as IncomingDataType
  );

  return transformedData;
}

function transformResourceTiming(
  resourceTiming: ResourceTiming,
  offset: number,
  level: number
): IncomingDataEntry {
  return {
    name: resourceTiming.name,
    value: [
      level,
      resourceTiming.timeRange[0] + offset,
      resourceTiming.timeRange[1] + offset,
      resourceTiming.name,
      0,
    ],
    itemStyle: { color: consistentColor },
  };
}

function transformMarks(
  marks: Marks,
  offset: number,
  previousArray: IncomingDataType
): IncomingDataEntry[] {
  return Object.entries(marks).map(([name, time]) => {
    const level = calculateLevel(time, time, previousArray);
    return {
      name,
      value: [level, time + offset, time + offset, name, 1],
      itemStyle: { color: consistentColor },
    };
  });
}

function calculateLevel(
  startTime: number,
  endTime: number,
  data: IncomingDataType
) {
  let level = 0;
  while (level < MAX_LEVEL) {
    if (
      data.every(
        entry =>
          !(entry.value[1] <= endTime && startTime <= entry.value[2]) ||
          entry.value[0] !== level
      )
    ) {
      return level;
    }
    level++;
  }
  throw new Error(`Cannot graph more than ${MAX_LEVEL} levels deep`);
}

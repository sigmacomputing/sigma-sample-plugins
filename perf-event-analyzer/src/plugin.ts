import {
  CustomPluginConfigOptions,
  useConfig,
  useEditorPanelConfig,
  useElementData,
} from '@sigmacomputing/plugin';
import { useEffect, useMemo, useState } from 'react';
import { logIfDebug } from './log';

export type Marks = Record<string, number>;

export type ResourceTiming = {
  decodedBodySize: number;
  encodedBodySize: number;
  name: string;
  timeRange: [number, number];
};
export type ResourceTimings = ResourceTiming[];

const configOptions: CustomPluginConfigOptions[] = [
  {
    type: 'element',
    name: 'dataSource',
    label: 'Data source',
  },
  {
    type: 'column',
    name: 'sessionId',
    label: 'Session Id',
    source: 'dataSource',
    allowMultiple: false,
    allowedTypes: ['text'],
  },
  {
    type: 'column',
    name: 'resourceTimings',
    label: 'Resource Timings',
    source: 'dataSource',
    allowMultiple: false,
    allowedTypes: ['variant'],
  },
  {
    type: 'column',
    name: 'marks',
    label: 'Marks',
    source: 'dataSource',
    allowMultiple: false,
    allowedTypes: ['variant'],
  },
  {
    type: 'column',
    name: 'offset',
    label: 'Offset',
    source: 'dataSource',
    allowMultiple: false,
    allowedTypes: ['number'],
  },
];

export function useFetchDataFromSigma() {
  useEditorPanelConfig(configOptions);
  const config = useConfig();
  const sigmaData = useElementData(config.dataSource);

  const [isMultipleSessionIds, setIsMultipleSessionIds] = useState(false);

  const sessionIds = useMemo<string[] | undefined>(
    () => sigmaData[config.sessionId],
    [config, sigmaData]
  );

  const resourceTimings = useMemo<ResourceTimings[] | undefined>(() => {
    const initialData = sigmaData[config.resourceTimings];
    // TODO: Filter resourceTimings to exclude font downloads

    return initialData?.map(jsonOutput => JSON.parse(jsonOutput));
  }, [config, sigmaData]);

  // TODO: Figure out the type here
  const marks = useMemo<Marks[] | undefined>(() => {
    const initialData = sigmaData[config.marks];

    return initialData?.map(jsonOutput => JSON.parse(jsonOutput));
  }, [config, sigmaData]);

  const offsets = useMemo<number[] | undefined>(
    () => sigmaData[config.offset],
    [config, sigmaData]
  );

  useEffect(() => {
    const uniqueSessionIds = new Set(sessionIds);
    if (uniqueSessionIds && uniqueSessionIds.size > 1) {
      setIsMultipleSessionIds(true);
    } else {
      setIsMultipleSessionIds(false);
    }

    return () => {
      setIsMultipleSessionIds(false);
    };
  }, [sessionIds]);

  useEffect(() => {
    logIfDebug('log', {
      isMultipleSessionIds,
      resourceTimings,
      marks,
      offsets,
    });
  }, [isMultipleSessionIds, resourceTimings, marks, offsets]);

  return {
    isMultipleSessionIds,
    resourceTimings,
    marks,
    offsets,
  };
}

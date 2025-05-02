import {
  CustomPluginConfigOptions,
  useConfig,
  useEditorPanelConfig,
  useElementData,
} from '@sigmacomputing/plugin';
import { useEffect, useMemo, useState } from 'react';

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
    name: 'annotations',
    label: 'Annotations',
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

  const sessionIds = useMemo(
    () => sigmaData[config.sessionId],
    [config, sigmaData]
  );

  const resourceTimings = useMemo(
    () => sigmaData[config.resourceTimings],
    [config, sigmaData]
  );

  const annotations = useMemo(
    () => sigmaData[config.annotations],
    [config, sigmaData]
  );

  const marks = useMemo(() => sigmaData[config.marks], [config, sigmaData]);

  const offset = useMemo(() => sigmaData[config.offset], [config, sigmaData]);

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

  // TODO: Filter resourceTimings to exclude font downloads

  useEffect(() => {
    console.log({
      isMultipleSessionIds,
      resourceTimings: resourceTimings.map(jsonOutput =>
        JSON.parse(jsonOutput)
      ),
      annotations: annotations.map(jsonOutput => JSON.parse(jsonOutput)),
      marks: marks.map(jsonOutput => JSON.parse(jsonOutput)),
      offset,
    });
  }, [isMultipleSessionIds, resourceTimings, annotations, marks, offset]);

  return {
    isMultipleSessionIds,
    resourceTimings,
    annotations,
    marks,
    offset,
  };
}

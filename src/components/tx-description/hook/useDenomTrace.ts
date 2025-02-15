import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { LCDClient } from '@terra-money/terra.js';
import { DenomTrace } from '@terra-money/terra.js/dist/core/ibc-transfer/DenomTrace';

const useDenomTrace = (denom = '', lcd: LCDClient) => {
  const hash = denom.replace('ibc/', '');
  const [ibcData, setIBCData] = useState<DenomTrace>();
  const { data } = useQuery(
    ['denomTrace', hash],
    async () => {
      const { denomTrace } = (await lcd.ibcTransfer.denomTrace(
        hash,
      )) /* TODO: Remove force typing on terra.js fixed */ as unknown as {
        denomTrace: DenomTrace;
      };
      return denomTrace;
    },
    { enabled: denom.startsWith('ibc') },
  );

  useEffect(() => {
    if (data) {
      setIBCData(data);
    }
  }, [data]);

  return ibcData;
};

export default useDenomTrace;

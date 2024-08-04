import React from 'react';
import {Table} from 'client-library';
import {tableHeadsParameters} from '../../employees/absents/constants.tsx';
import useGetParameters from '../../../services/graphql/templates/useGetParameters.ts';

const Parameters = () => {
  const {parameters, loading} = useGetParameters();

  return (
    <div style={{marginTop: 24}}>
      <Table tableHeads={tableHeadsParameters} data={parameters} isLoading={loading} />
    </div>
  );
};

export default Parameters;

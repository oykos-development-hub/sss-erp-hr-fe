import React from 'react';
import {PrintPageProps} from '../../types';
import {JobInfo, PrintPageWrapper, SectorTitle} from './styles';
import {Typography, Divider, Theme} from 'client-library';
import {SectorType} from '../../../../types/graphql/systematizationsTypes';

export const PrintPage: React.FC<PrintPageProps> = ({sectorDetails}) => {
  return (
    <PrintPageWrapper>
      {sectorDetails?.map((sector: SectorType) => {
        return (
          <div key={`sector-details-${sector?.id}`}>
            <div>
              <SectorTitle>
                <Typography variant="bodyLarge" content={sector?.title} style={{fontWeight: 600}} />
              </SectorTitle>
              <Divider height="2px" color={Theme?.palette?.gray200} />
            </div>
            <div>
              {sector?.job_positions_organization_units?.map((jobPosition: any) => {
                return (
                  <>
                    <JobInfo key={`job-position-${jobPosition?.id}`}>
                      <Typography
                        variant="bodyMedium"
                        content={jobPosition?.job_positions?.title}
                        style={{fontWeight: 600, minWidth: 200}}
                      />
                      <Typography variant="bodyMedium" content={jobPosition?.description} style={{minWidth: 200}} />
                      <Typography
                        variant="bodyMedium"
                        content={jobPosition?.employees?.map((item: any) => item?.title).join(', ')}
                        style={{minWidth: 200}}
                      />
                    </JobInfo>
                  </>
                );
              })}
            </div>
          </div>
        );
      })}
    </PrintPageWrapper>
  );
};

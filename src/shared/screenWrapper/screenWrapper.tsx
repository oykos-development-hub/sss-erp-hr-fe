import React, {ReactElement, ReactNode, forwardRef} from 'react';
import useAppContext from '../../context/useAppContext';
import {Container, StyledBreadcrumbs} from './styles';

interface ScreenWrapperProps {
  children: ReactNode;
  showBreadcrumbs?: boolean;
}

export const ScreenWrapper = forwardRef<HTMLDivElement, ScreenWrapperProps>(
  ({children, showBreadcrumbs = true}, ref) => {
    const context = useAppContext();

    const breadcrumbs = context?.breadcrumbs;

    const breadcrumbItems = breadcrumbs?.get();

    const navigate = context?.navigation?.navigate;

    const handleNavigation = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined,
      item?: {
        name: string;
        to: string;
        icon?: ReactElement;
      },
    ) => {
      e?.preventDefault();
      const newBreacrumbs = [...breadcrumbItems];
      const index = newBreacrumbs.findIndex((breadcrumb: any) => breadcrumb.name === item?.name);
      newBreacrumbs.splice(index + 1, newBreacrumbs.length - index);
      breadcrumbs.set(newBreacrumbs);
      navigate(item?.to);
    };

    return (
      <Container ref={ref}>
        {showBreadcrumbs ? <StyledBreadcrumbs items={breadcrumbItems} onClick={handleNavigation} /> : null}
        {children}
      </Container>
    );
  },
);

ScreenWrapper.displayName = 'ScreenWrapper';

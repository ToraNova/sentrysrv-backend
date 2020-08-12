/*
 *
 * HomePage
 *
 */
/* eslint-disable */
import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { get, upperFirst } from 'lodash';
import { auth } from 'strapi-helper-plugin';
import PageTitle from '../../components/PageTitle';

import useFetch from './hooks';
import { ALink, Block, Container, LinkWrapper, P, Wave, Separator } from './components';
import BlogPost from './BlogPost';
import SocialLink from './SocialLink';

const FIRST_BLOCK_LINKS = [
];

const SOCIAL_LINKS = [
];

const HomePage = ({ global: { plugins }, history: { push } }) => {
  const { error, isLoading, posts } = useFetch();
  const handleClick = e => {
    e.preventDefault();

    push(
      '/plugins/content-type-builder/content-types/plugins::users-permissions.user?modalType=contentType&kind=collectionType&actionType=create&settingType=base&forTarget=contentType&headerId=content-type-builder.modalForm.contentType.header-create&header_icon_isCustom_1=false&header_icon_name_1=contentType&header_label_1=null'
    );
  };
  const hasAlreadyCreatedContentTypes =
    get(plugins, ['content-manager', 'leftMenuSections', '0', 'links'], []).filter(
      contentType => contentType.isDisplayed === true
    ).length > 1;

  const headerId = hasAlreadyCreatedContentTypes
    ? 'HomePage.greetings'
    : 'app.components.HomePage.welcome';
  const username = get(auth.getUserInfo(), 'username', '');

  return (
    <>
      <FormattedMessage id="HomePage.helmet.title">
        {title => <PageTitle title={title} />}
      </FormattedMessage>
      <Container className="container-fluid">
        <div className="row">
          <div className="col-lg-12 col-md-12">
		  <Block>
		  <FormattedMessage
		  id={headerId}
		  values={{
			  name: upperFirst(username),
		  }}
		  >
		  {msg => <h2 id="mainHeader">{msg}</h2>}
		  </FormattedMessage>
		  </Block>
	  </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);

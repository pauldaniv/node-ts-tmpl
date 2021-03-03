'use strict';

const router = require('express').Router();

const {handle} = require('./custom/request-common');
const axios = require('axios');

const path = '/api/read_page_data';

router.use(path, handle(async req => {

  const response = {
    pages: []
  };

  const shortLivedPageAccessToken = req.body.access_token;
  let userIdResponse = await axios.get(`https://graph.facebook.com/v10.0/me?fields=id&access_token=${shortLivedPageAccessToken}`);


  const userId = userIdResponse.data.id;
  const longLivedUserAccessTokenResponse = await axios.get(`https://graph.facebook.com/v10.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${shortLivedPageAccessToken}`);
  const longLivedPageAccessTokensResponse = await axios.get(`https://graph.facebook.com/v10.0/${userId}/accounts?access_token=${longLivedUserAccessTokenResponse.data.access_token}`);

  for (const it of longLivedPageAccessTokensResponse.data.data) {
    const pageInfo = await axios.get(`https://graph.facebook.com/v10.0/${it.id}?fields=about%2Cbio%2Chours%2Clink%2Cname%2Cphone%2Cschedule%2Cwebsite%2Clikes%7Bratings.limit(10)%7Bhas_rating%2Crating%2Crecommendation_type%2Chas_review%2Copen_graph_story%2Ccreated_time%2Creview_text%2Creviewer%7D%2Cemails%7D%2Cemails%2Cratings.limit(10)%7Bopen_graph_story%2Crating%2Chas_review%2Creview_text%2Crecommendation_type%2Chas_rating%2Ccreated_time%2Creviewer%7D&access_token=${it.access_token}`);
    response.pages.push({pageId: it.id, pageName: it.name, longLivedPageAccessToken: it.access_token, pageInfo: pageInfo.data});
  }

  return response;
}));

module.exports = router;

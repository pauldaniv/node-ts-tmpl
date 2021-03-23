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
    const pageInfo = await axios.get(`https://graph.facebook.com/v10.0/${it.id}?fields=id,category_list,ratings.limit(10){reviewer,rating,has_rating,has_review,created_time,open_graph_story,recommendation_type,review_text},tagged.limit(10),about,bio,hours,is_permanently_closed,is_unclaimed,name,phone,photos{target,images},price_range,website,emails,network,location,link,rating_count,parking,overall_star_rating,app_id,username&access_token=${it.access_token}`);
    response.pages.push({pageId: it.id, pageName: it.name, longLivedPageAccessToken: it.access_token, pageInfo: pageInfo.data});
  }

  return response;
}));

module.exports = router;
